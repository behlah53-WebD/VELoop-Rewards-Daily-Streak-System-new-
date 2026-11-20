import streakService from '../services/streak.service.js';

export async function getStreak(req, res, next) {
  try {
    const status = await streakService.getStreakStatus(req.user._id);
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
}

export async function getStatus(req, res, next) {
  try {
    const status = await streakService.getLightweightStatus(req.user._id);
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
}

export async function claim(req, res, next) {
  try {
    const requestedDay = req.body?.day;
    const meta = {
      reqId: req.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    };

    const result = await streakService.initiateClaim(req.user._id, requestedDay, meta);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function confirm(req, res, next) {
  try {
    const { claimId } = req.body;
    const idempotencyKey = req.headers['idempotency-key'] || null;
    const meta = {
      reqId: req.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    };

    const result = await streakService.confirmClaim(req.user._id, claimId, idempotencyKey, meta);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function acknowledgeReset(req, res, next) {
  try {
    const result = await streakService.acknowledgeResetNotice(req.user._id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getHistory(req, res, next) {
  try {
    const { page, limit } = req.query;
    const result = await streakService.getClaimHistory(req.user._id, { page, limit });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export default {
  getStreak,
  getStatus,
  claim,
  confirm,
  acknowledgeReset,
  getHistory,
};
