import env from '../config/env.js';
import { StreakCycle } from '../models/StreakCycle.js';
import { StreakClaim } from '../models/StreakClaim.js';
import { WalletTransaction } from '../models/WalletTransaction.js';
import { Wallet } from '../models/Wallet.js';
import auditService from '../services/audit.service.js';
import clock from '../services/clock.js';

export async function timeTravel(req, res, next) {
  try {
    if (!env.ENABLE_DEV_TOOLS || env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Developer tools are disabled in this environment.',
          requestId: req.id,
        },
      });
    }

    const { advanceHours } = req.body;
    const offsetMs = advanceHours * 60 * 60 * 1000;

    const cycle = await StreakCycle.findOne({ userId: req.user._id, status: 'ACTIVE' });

    if (!cycle) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'No active streak cycle found for user.',
          requestId: req.id,
        },
      });
    }

    // Rewind timestamps on the active cycle by offsetMs (equivalent to advancing time)
    if (cycle.lastClaimAt) {
      cycle.lastClaimAt = new Date(cycle.lastClaimAt.getTime() - offsetMs);
    }
    if (cycle.nextClaimAt) {
      cycle.nextClaimAt = new Date(cycle.nextClaimAt.getTime() - offsetMs);
    }
    if (cycle.expiresAt) {
      cycle.expiresAt = new Date(cycle.expiresAt.getTime() - offsetMs);
    }
    await cycle.save();

    // Also rewind any active pending claim timestamps
    const pendingClaims = await StreakClaim.find({
      userId: req.user._id,
      cycleId: cycle._id,
      status: 'PENDING',
    });

    for (const c of pendingClaims) {
      c.demoReadyAt = new Date(c.demoReadyAt.getTime() - offsetMs);
      c.pendingExpiresAt = new Date(c.pendingExpiresAt.getTime() - offsetMs);
      await c.save();
    }

    // Audit dev time-travel event
    await auditService.logAudit({
      userId: req.user._id,
      event: 'DEV_TIME_TRAVEL',
      requestId: req.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        advanceHours,
        offsetMs,
        updatedNextClaimAt: cycle.nextClaimAt,
        updatedExpiresAt: cycle.expiresAt,
      },
    });

    res.status(200).json({
      success: true,
      message: `Time advanced by ${advanceHours} hours. Stored timestamps rewound.`,
      serverTime: clock.toISOString(),
      cycle: {
        currentDay: cycle.currentDay,
        lastClaimAt: cycle.lastClaimAt,
        nextClaimAt: cycle.nextClaimAt,
        expiresAt: cycle.expiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function resetUser(req, res, next) {
  try {
    if (!env.ENABLE_DEV_TOOLS || env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Developer tools are disabled in this environment.',
          requestId: req.id,
        },
      });
    }

    // Reset user cycles
    await StreakCycle.deleteMany({ userId: req.user._id });
    await StreakClaim.deleteMany({ userId: req.user._id });
    await WalletTransaction.deleteMany({ userId: req.user._id });

    // Reset wallet to initial 120 VEs (as seeded for demo user)
    await Wallet.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { balances: { VES: 120, INR: 0 } } },
      { upsert: true }
    );

    await auditService.logAudit({
      userId: req.user._id,
      event: 'STREAK_RESET',
      requestId: req.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      details: { reason: 'DEV_USER_RESET' },
    });

    res.status(200).json({
      success: true,
      message: 'User streak, claims, and wallet reset to initial state.',
    });
  } catch (error) {
    next(error);
  }
}

export default {
  timeTravel,
  resetUser,
};
