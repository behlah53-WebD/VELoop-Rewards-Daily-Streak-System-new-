import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { StreakCycle } from '../models/StreakCycle.js';
import { StreakClaim } from '../models/StreakClaim.js';
import { User } from '../models/User.js';
import rewardService from './reward.service.js';
import walletService from './wallet.service.js';
import transactionService from './transaction.service.js';
import auditService from './audit.service.js';
import { computeStreakPhase, resolveDayStatus, calculateNextClaimSchedule } from './streak.rules.js';
import clock from './clock.js';

export class StreakService {
  /**
   * Retrieves or initializes the active streak cycle for a user.
   */
  async getOrCreateActiveCycle(userId, session = null) {
    let query = StreakCycle.findOne({ userId, status: 'ACTIVE' });
    if (session) query = query.session(session);
    let cycle = await query;

    if (!cycle) {
      // Find highest cycle number from previous cycles
      const lastCycle = await StreakCycle.findOne({ userId })
        .sort({ cycleNumber: -1 })
        .session(session);

      const nextCycleNumber = lastCycle ? lastCycle.cycleNumber + 1 : 1;
      const initialStreakCount = lastCycle && lastCycle.status === 'COMPLETED' ? lastCycle.streakCount : 0;
      const longestStreak = lastCycle ? lastCycle.longestStreak : 0;

      cycle = new StreakCycle({
        userId,
        cycleNumber: nextCycleNumber,
        status: 'ACTIVE',
        currentDay: 1,
        claimedDays: [],
        streakCount: initialStreakCount,
        longestStreak,
        startedAt: clock.nowDate(),
        resetNoticeAcknowledged: false,
      });

      if (session) {
        await cycle.save({ session });
      } else {
        await cycle.save();
      }
    }

    return cycle;
  }

  /**
   * Performs lazy missed-day evaluation on any read or claim attempt.
   * If deadline has expired, terminates old cycle as BROKEN and spins up a fresh cycle starting at Day 1.
   */
  async lazyCheckMissedDay(cycle, config, session = null) {
    const phaseInfo = computeStreakPhase(cycle, config, clock.nowDate());

    if (!phaseInfo.isMissed) {
      return {
        cycle,
        resetNotice:
          !cycle.resetNoticeAcknowledged && cycle.cycleNumber > 1 && cycle.claimedDays.length === 0
            ? {
                previousStreak: cycle.streakCount,
                message: 'Your streak was reset because the claim window expired. Start fresh today!',
              }
            : null,
      };
    }

    // Cycle deadline was missed!
    const previousStreak = cycle.streakCount;
    const missedDay = cycle.currentDay;

    // Mark current cycle BROKEN
    cycle.status = 'BROKEN';
    cycle.endedAt = clock.nowDate();
    cycle.endReason = 'MISSED';

    if (session) {
      await cycle.save({ session });
    } else {
      await cycle.save();
    }

    // Mark any unclaimed/pending claims in this cycle as MISSED
    await StreakClaim.updateMany(
      { cycleId: cycle._id, status: 'PENDING' },
      { status: 'MISSED' },
      session ? { session } : {}
    );

    // Audit streak reset
    await auditService.logAudit({
      userId: cycle.userId,
      event: 'STREAK_RESET',
      details: {
        brokenCycleId: cycle._id,
        missedDay,
        previousStreak,
        serverTime: clock.toISOString(),
      },
      session,
    });

    // Create fresh cycle starting at Day 1
    const newCycle = new StreakCycle({
      userId: cycle.userId,
      cycleNumber: cycle.cycleNumber + 1,
      status: 'ACTIVE',
      currentDay: 1,
      claimedDays: [],
      streakCount: 0,
      longestStreak: cycle.longestStreak,
      startedAt: clock.nowDate(),
      resetNoticeAcknowledged: false,
    });

    if (session) {
      await newCycle.save({ session });
    } else {
      await newCycle.save();
    }

    const resetNotice = {
      previousStreak,
      missedDay,
      message: 'Your streak was reset because the claim window expired. Start fresh from Day 1!',
    };

    return { cycle: newCycle, resetNotice };
  }

  /**
   * Computes full streak payload for GET /api/daily-streak
   */
  async getStreakStatus(userId) {
    const config = await rewardService.getActiveConfig();
    const rawCycle = await this.getOrCreateActiveCycle(userId);
    const { cycle, resetNotice } = await this.lazyCheckMissedDay(rawCycle, config);

    const rewardsCatalog = await rewardService.getRewardsCatalog(config.configKey || 'default');
    const wallet = await walletService.getOrCreateWallet(userId);

    const phaseInfo = computeStreakPhase(cycle, config, clock.nowDate());

    // Map each day (1 to cycleLength)
    const rewards = rewardsCatalog.map((rewardDoc) => {
      const status = resolveDayStatus(rewardDoc.day, phaseInfo, cycle.claimedDays);
      return {
        day: rewardDoc.day,
        status,
        badge: rewardDoc.badge,
        assetType: rewardDoc.assetType,
        isUltimate: rewardDoc.isUltimate,
        nextClaimAt: status === 'TODAY' && phaseInfo.nextClaimAt ? phaseInfo.nextClaimAt.toISOString() : null,
        reward: {
          type: rewardDoc.rewardType,
          amount: rewardDoc.amount,
          currency: rewardDoc.currency,
          title: rewardDoc.title,
          subtitle: rewardDoc.subtitle,
          description: rewardDoc.description,
        },
      };
    });

    // Find next reward and ultimate reward
    const nextRewardDoc = rewardsCatalog.find((r) => r.day === cycle.currentDay) || rewardsCatalog[0];
    const ultimateRewardDoc = rewardsCatalog.find((r) => r.isUltimate) || rewardsCatalog[rewardsCatalog.length - 1];

    return {
      success: true,
      serverTime: clock.toISOString(),
      streak: {
        status: cycle.status,
        phase: phaseInfo.phase,
        currentStreak: cycle.streakCount,
        currentDay: cycle.currentDay,
        checkedIn: cycle.claimedDays.length,
        totalRewards: config.cycleLength || 7,
        nextClaimAt: phaseInfo.nextClaimAt ? phaseInfo.nextClaimAt.toISOString() : null,
        expiresAt: phaseInfo.expiresAt ? phaseInfo.expiresAt.toISOString() : null,
        canClaim: phaseInfo.canClaim,
        longestStreak: cycle.longestStreak,
        nextReward: nextRewardDoc
          ? {
              day: nextRewardDoc.day,
              type: nextRewardDoc.rewardType,
              amount: nextRewardDoc.amount,
              currency: nextRewardDoc.currency,
              title: nextRewardDoc.title,
            }
          : null,
        ultimateReward: ultimateRewardDoc
          ? {
              day: ultimateRewardDoc.day,
              amount: ultimateRewardDoc.amount,
              currency: ultimateRewardDoc.currency,
              title: ultimateRewardDoc.title,
              unlockDay: ultimateRewardDoc.day,
            }
          : null,
        resetNotice,
      },
      rewards,
      wallet: wallet.balances,
    };
  }

  /**
   * Lightweight status check for countdown synchronization (GET /api/daily-streak/status)
   */
  async getLightweightStatus(userId) {
    const config = await rewardService.getActiveConfig();
    const rawCycle = await this.getOrCreateActiveCycle(userId);
    const { cycle } = await this.lazyCheckMissedDay(rawCycle, config);
    const wallet = await walletService.getOrCreateWallet(userId);
    const phaseInfo = computeStreakPhase(cycle, config, clock.nowDate());

    return {
      success: true,
      serverTime: clock.toISOString(),
      phase: phaseInfo.phase,
      currentDay: cycle.currentDay,
      nextClaimAt: phaseInfo.nextClaimAt ? phaseInfo.nextClaimAt.toISOString() : null,
      canClaim: phaseInfo.canClaim,
      streakCount: cycle.streakCount,
      wallet: wallet.balances,
    };
  }

  /**
   * Phase 1 of Claim: Initiate Claim (POST /api/daily-streak/claim)
   */
  async initiateClaim(userId, requestedDayHint, { reqId = null, ip = null, userAgent = null } = {}) {
    // 1. Verify user account status
    const user = await User.findById(userId);
    if (!user || user.status !== 'ACTIVE') {
      await auditService.logAudit({
        userId,
        event: 'STREAK_CLAIM_REJECTED',
        requestId: reqId,
        ip,
        userAgent,
        details: { reason: 'ACCOUNT_NOT_ELIGIBLE', userStatus: user?.status },
      });
      const error = new Error('Your account is not eligible to claim rewards.');
      error.statusCode = 403;
      error.code = 'ACCOUNT_NOT_ELIGIBLE';
      throw error;
    }

    // 2. Fetch config & active cycle (with lazy check)
    const config = await rewardService.getActiveConfig();
    let rawCycle = await this.getOrCreateActiveCycle(userId);
    const { cycle } = await this.lazyCheckMissedDay(rawCycle, config);

    // 3. Requested day verification (validate requested day first)
    const currentDay = cycle.currentDay;
    if (requestedDayHint !== undefined && requestedDayHint !== null) {
      const hintNum = Number(requestedDayHint);
      if (cycle.claimedDays.includes(hintNum)) {
        await auditService.logAudit({
          userId,
          event: 'DUPLICATE_CLAIM',
          requestId: reqId,
          ip,
          userAgent,
          details: { day: hintNum, cycleId: cycle._id },
        });

        const error = new Error('This reward has already been claimed.');
        error.statusCode = 400;
        error.code = 'ALREADY_CLAIMED';
        throw error;
      }

      if (hintNum !== currentDay) {
        await auditService.logAudit({
          userId,
          event: 'INVALID_CLAIM',
          requestId: reqId,
          ip,
          userAgent,
          details: { requestedDay: hintNum, serverCurrentDay: currentDay },
        });

        const error = new Error(`Requested Day ${hintNum} does not match eligible Day ${currentDay}.`);
        error.statusCode = 400;
        error.code = 'DAY_MISMATCH';
        throw error;
      }
    }

    // 4. Compute Phase and check timing
    const phaseInfo = computeStreakPhase(cycle, config, clock.nowDate());

    if (phaseInfo.phase === 'WAITING') {
      const retryAfterMs = phaseInfo.nextClaimAt
        ? Math.max(0, phaseInfo.nextClaimAt.getTime() - clock.nowMs())
        : 0;

      await auditService.logAudit({
        userId,
        event: 'STREAK_CLAIM_REJECTED',
        requestId: reqId,
        ip,
        userAgent,
        details: { reason: 'STILL_LOCKED', targetDay: cycle.currentDay, nextClaimAt: phaseInfo.nextClaimAt },
      });

      const error = new Error('Your next reward is not available yet.');
      error.statusCode = 400;
      error.code = 'STILL_LOCKED';
      error.retryAfterMs = retryAfterMs;
      throw error;
    }

    if (!phaseInfo.canClaim) {
      await auditService.logAudit({
        userId,
        event: 'STREAK_CLAIM_REJECTED',
        requestId: reqId,
        ip,
        userAgent,
        details: { reason: 'NOT_ELIGIBLE_PHASE', phase: phaseInfo.phase },
      });

      const error = new Error('You are not currently eligible to claim this reward.');
      error.statusCode = 400;
      error.code = 'STILL_LOCKED';
      throw error;
    }

    // 5. Already claimed check
    if (cycle.claimedDays.includes(currentDay)) {
      await auditService.logAudit({
        userId,
        event: 'DUPLICATE_CLAIM',
        requestId: reqId,
        ip,
        userAgent,
        details: { day: currentDay, cycleId: cycle._id },
      });

      const error = new Error('This reward has already been claimed.');
      error.statusCode = 400;
      error.code = 'ALREADY_CLAIMED';
      throw error;
    }

    // 6. Reward snapshot
    const reward = await rewardService.getRewardForDay(currentDay, config.configKey || 'default');
    if (!reward) {
      const error = new Error(`No reward configuration found for Day ${currentDay}.`);
      error.statusCode = 500;
      error.code = 'SERVER_ERROR';
      throw error;
    }

    const now = clock.nowDate();
    const demoDurationMs = (config.cpaDemoSeconds !== undefined ? config.cpaDemoSeconds : 3) * 1000;
    const pendingTtlMs = (config.pendingClaimTtlSeconds || 120) * 1000;
    const demoReadyAt = new Date(now.getTime() + demoDurationMs);
    const pendingExpiresAt = new Date(now.getTime() + pendingTtlMs);

    // 7. Find existing PENDING claim or create new one (Idempotent initiate)
    let claim = await StreakClaim.findOne({
      userId,
      cycleId: cycle._id,
      day: currentDay,
      status: 'PENDING',
    });

    if (claim) {
      // Refresh timestamps if expired or reuse
      claim.demoReadyAt = demoReadyAt;
      claim.pendingExpiresAt = pendingExpiresAt;
      await claim.save();
    } else {
      claim = new StreakClaim({
        claimId: uuidv4(),
        userId,
        cycleId: cycle._id,
        day: currentDay,
        rewardId: reward._id,
        rewardSnapshot: {
          type: reward.rewardType,
          currency: reward.currency,
          amount: reward.amount,
          title: reward.title,
        },
        status: 'PENDING',
        demoReadyAt,
        pendingExpiresAt,
      });
      await claim.save();
    }

    await auditService.logAudit({
      userId,
      event: 'STREAK_CLAIM_REQUEST',
      requestId: reqId,
      ip,
      userAgent,
      details: { claimId: claim.claimId, day: currentDay, reward: claim.rewardSnapshot },
    });

    return {
      success: true,
      claimId: claim.claimId,
      demoDurationMs,
      serverTime: clock.toISOString(),
    };
  }

  /**
   * Phase 2 of Claim: Confirm Claim (POST /api/daily-streak/claim/confirm)
   */
  async confirmClaim(userId, claimId, idempotencyKey = null, { reqId = null, ip = null, userAgent = null } = {}) {
    // 1. Load claim by claimId AND authenticated userId (Prevents cross-user attacks)
    const claim = await StreakClaim.findOne({ claimId, userId });
    if (!claim) {
      await auditService.logAudit({
        userId,
        event: 'INVALID_CLAIM',
        requestId: reqId,
        ip,
        userAgent,
        details: { reason: 'CLAIM_NOT_FOUND_OR_FORBIDDEN', claimId },
      });

      const error = new Error('Claim record not found or unauthorized.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    // 2. Check if already completed (Idempotent Replay — grants NO second credit)
    if (claim.status === 'COMPLETED') {
      await auditService.logAudit({
        userId,
        event: 'DUPLICATE_CLAIM',
        requestId: reqId,
        ip,
        userAgent,
        details: { claimId, day: claim.day, idempotentReplay: true },
      });

      const wallet = await walletService.getOrCreateWallet(userId);
      return {
        success: true,
        idempotentReplay: true,
        message: 'This reward has already been claimed.',
        claimId: claim.claimId,
        day: claim.day,
        reward: claim.rewardSnapshot,
        wallet: wallet.balances,
      };
    }

    if (claim.status !== 'PENDING') {
      const error = new Error('This claim is no longer valid.');
      error.statusCode = 400;
      error.code = 'CLAIM_EXPIRED';
      throw error;
    }

    // 3. Verify CPA Demo Ready timing: now >= demoReadyAt
    const now = clock.nowDate();
    if (now < claim.demoReadyAt) {
      const retryAfterMs = Math.max(0, claim.demoReadyAt.getTime() - clock.nowMs());
      await auditService.logAudit({
        userId,
        event: 'STREAK_CLAIM_REJECTED',
        requestId: reqId,
        ip,
        userAgent,
        details: { reason: 'CLAIM_NOT_READY', demoReadyAt: claim.demoReadyAt, now },
      });

      const error = new Error('Verification in progress. Please wait.');
      error.statusCode = 400;
      error.code = 'CLAIM_NOT_READY';
      error.retryAfterMs = retryAfterMs;
      throw error;
    }

    // 4. Verify TTL: now <= pendingExpiresAt
    if (now > claim.pendingExpiresAt) {
      claim.status = 'EXPIRED';
      await claim.save();

      await auditService.logAudit({
        userId,
        event: 'STREAK_CLAIM_REJECTED',
        requestId: reqId,
        ip,
        userAgent,
        details: { reason: 'CLAIM_EXPIRED', pendingExpiresAt: claim.pendingExpiresAt, now },
      });

      const error = new Error('Claim verification expired. Please initiate the claim again.');
      error.statusCode = 400;
      error.code = 'CLAIM_EXPIRED';
      throw error;
    }

    // 5. Execute atomic state transition
    const config = await rewardService.getActiveConfig();
    const schedule = calculateNextClaimSchedule(claim.day, config, now);

    // Use MongoDB transaction if supported by environment (e.g. replica set), fallback to atomic updates
    let session = null;
    let useTransaction = false;

    try {
      session = await mongoose.startSession();
      // Check if replica set supports transactions
      if (mongoose.connection.client?.topology?.description?.type !== 'Single') {
        session.startTransaction();
        useTransaction = true;
      }
    } catch {
      session = null;
      useTransaction = false;
    }

    try {
      // A. Conditional update on StreakCycle
      const cycleUpdateFilter = {
        _id: claim.cycleId,
        status: 'ACTIVE',
        currentDay: claim.day,
      };

      const cycleUpdateFields = {
        $push: { claimedDays: claim.day },
        $inc: { streakCount: 1 },
        $set: {
          lastClaimAt: now,
          nextClaimAt: schedule.nextClaimAt,
          expiresAt: schedule.expiresAt,
          currentDay: schedule.nextDay,
          ...(schedule.isCycleCompleted
            ? { status: 'COMPLETED', endedAt: now, endReason: 'COMPLETED' }
            : {}),
        },
      };

      const cycleOptions = { new: true, runValidators: true };
      if (useTransaction) cycleOptions.session = session;

      const updatedCycle = await StreakCycle.findOneAndUpdate(
        cycleUpdateFilter,
        cycleUpdateFields,
        cycleOptions
      );

      if (!updatedCycle) {
        throw { code: 'ALREADY_CLAIMED', message: 'This reward has already been claimed or cycle changed.' };
      }

      // Update longestStreak if streakCount exceeded it
      if (updatedCycle.streakCount > updatedCycle.longestStreak) {
        updatedCycle.longestStreak = updatedCycle.streakCount;
        if (useTransaction) {
          await updatedCycle.save({ session });
        } else {
          await updatedCycle.save();
        }
      }

      // B. Update StreakClaim PENDING -> COMPLETED
      claim.status = 'COMPLETED';
      claim.claimedAt = now;
      if (idempotencyKey) claim.idempotencyKey = idempotencyKey;

      if (useTransaction) {
        await claim.save({ session });
      } else {
        await claim.save();
      }

      // C. Atomic Credit to Wallet
      const rewardSnapshot = claim.rewardSnapshot;
      const txStatus = rewardSnapshot.type === 'VES' ? 'COMPLETED' : 'PENDING_FULFILLMENT';

      const { balanceBefore, balanceAfter, wallet } = await walletService.creditBalance({
        userId,
        currency: rewardSnapshot.currency,
        amount: rewardSnapshot.amount,
        session: useTransaction ? session : null,
      });

      // D. Record immutable transaction ledger entry
      const transaction = await transactionService.recordStreakTransaction({
        userId,
        currency: rewardSnapshot.currency,
        amount: rewardSnapshot.amount,
        streakDay: claim.day,
        claimId: claim.claimId,
        balanceBefore,
        balanceAfter,
        status: txStatus,
        session: useTransaction ? session : null,
      });

      // Link transaction ID to claim
      claim.transactionId = transaction.transactionId;
      if (useTransaction) {
        await claim.save({ session });
      } else {
        await claim.save();
      }

      // E. Write audit event
      await auditService.logAudit({
        userId,
        event: 'STREAK_CLAIM_SUCCESS',
        requestId: reqId,
        ip,
        userAgent,
        details: {
          claimId: claim.claimId,
          day: claim.day,
          reward: rewardSnapshot,
          transactionId: transaction.transactionId,
          balanceAfter,
        },
        session: useTransaction ? session : null,
      });

      if (useTransaction) {
        await session.commitTransaction();
      }

      return {
        success: true,
        message: 'Reward claimed successfully!',
        claimId: claim.claimId,
        day: claim.day,
        reward: rewardSnapshot,
        wallet: wallet.balances,
        transaction: {
          transactionId: transaction.transactionId,
          referenceId: transaction.referenceId,
          status: transaction.status,
        },
      };
    } catch (err) {
      if (useTransaction && session) {
        try {
          await session.abortTransaction();
        } catch {
          // Ignore abort errors
        }
      }

      if (
        err.code === 11000 ||
        err.code === 112 ||
        err.code === 'ALREADY_CLAIMED' ||
        err.name === 'MongoServerError' ||
        err.hasErrorLabel?.('TransientTransactionError')
      ) {
        // Check if the claim succeeded in the winning concurrent transaction
        const completedClaim = await StreakClaim.findOne({ claimId, status: 'COMPLETED' });
        if (completedClaim) {
          const wallet = await walletService.getOrCreateWallet(userId);
          return {
            success: true,
            idempotentReplay: true,
            message: 'This reward has already been claimed.',
            claimId: completedClaim.claimId,
            day: completedClaim.day,
            reward: completedClaim.rewardSnapshot,
            wallet: wallet.balances,
          };
        }

        const error = new Error('This reward has already been claimed.');
        error.statusCode = 409;
        error.code = 'ALREADY_CLAIMED';
        throw error;
      }

      throw err;
    } finally {
      if (session) {
        session.endSession();
      }
    }
  }

  /**
   * Acknowledges and dismisses the streak reset banner for the active cycle.
   */
  async acknowledgeResetNotice(userId) {
    const cycle = await StreakCycle.findOneAndUpdate(
      { userId, status: 'ACTIVE' },
      { $set: { resetNoticeAcknowledged: true } },
      { new: true }
    );
    return { success: true, acknowledged: !!cycle };
  }

  /**
   * Returns paginated claim history (for Streak Calendar)
   */
  async getClaimHistory(userId, { page = 1, limit = 20 } = {}) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [claims, total] = await Promise.all([
      StreakClaim.find({ userId, status: { $in: ['COMPLETED', 'MISSED'] } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      StreakClaim.countDocuments({ userId, status: { $in: ['COMPLETED', 'MISSED'] } }),
    ]);

    return {
      success: true,
      claims,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }
}

export const streakService = new StreakService();
export default streakService;
