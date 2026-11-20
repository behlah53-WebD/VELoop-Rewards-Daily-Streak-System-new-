/**
 * VELoop Rewards — Streak Rules Engine
 * Pure mathematical & logical functions with zero I/O or side-effects.
 * Highly unit-testable and deterministic.
 */

/**
 * Derives the active streak phase and timeline given the cycle, config, and current server time.
 *
 * @param {Object} cycle - StreakCycle document or plain object
 * @param {Object} config - StreakConfig document or plain object
 * @param {Date|number} nowInput - Current server time (Date or ms)
 * @returns {Object} { phase: 'INITIAL'|'WAITING'|'READY'|'MISSED'|'CYCLE_COMPLETED', targetDay, canClaim, nextClaimAt, expiresAt, isMissed }
 */
export function computeStreakPhase(cycle, config, nowInput = new Date()) {
  const now = nowInput instanceof Date ? nowInput.getTime() : Number(nowInput);
  const cycleLength = config.cycleLength || 7;
  const intervalMs = (config.claimIntervalHours || 24) * 60 * 60 * 1000;
  const windowMs = (config.claimWindowHours || 24) * 60 * 60 * 1000;

  if (!cycle) {
    return {
      phase: 'INITIAL',
      targetDay: 1,
      canClaim: true,
      nextClaimAt: null,
      expiresAt: null,
      isMissed: false,
    };
  }

  // If cycle is not active
  if (cycle.status !== 'ACTIVE') {
    return {
      phase: cycle.status === 'COMPLETED' ? 'CYCLE_COMPLETED' : 'MISSED',
      targetDay: 1,
      canClaim: false,
      nextClaimAt: cycle.nextClaimAt ? new Date(cycle.nextClaimAt) : null,
      expiresAt: cycle.expiresAt ? new Date(cycle.expiresAt) : null,
      isMissed: cycle.status === 'BROKEN',
    };
  }

  // Never claimed in this cycle yet
  if (!cycle.lastClaimAt) {
    return {
      phase: 'READY',
      targetDay: 1,
      canClaim: true,
      nextClaimAt: null,
      expiresAt: null,
      isMissed: false,
    };
  }

  const lastClaimAtMs = new Date(cycle.lastClaimAt).getTime();
  const nextClaimAtMs = cycle.nextClaimAt ? new Date(cycle.nextClaimAt).getTime() : lastClaimAtMs + intervalMs;
  const expiresAtMs = cycle.expiresAt ? new Date(cycle.expiresAt).getTime() : nextClaimAtMs + windowMs;

  const nextClaimAt = new Date(nextClaimAtMs);
  const expiresAt = new Date(expiresAtMs);

  // Check if deadline passed (MISSED)
  if (now > expiresAtMs) {
    return {
      phase: 'MISSED',
      targetDay: cycle.currentDay,
      canClaim: false,
      nextClaimAt,
      expiresAt,
      isMissed: true,
    };
  }

  // Check if still waiting for interval cooldown (WAITING)
  if (now < nextClaimAtMs) {
    return {
      phase: 'WAITING',
      targetDay: cycle.currentDay,
      canClaim: false,
      nextClaimAt,
      expiresAt,
      isMissed: false,
    };
  }

  // Inside eligible window: nextClaimAt <= now <= expiresAt (READY)
  return {
    phase: 'READY',
    targetDay: cycle.currentDay,
    canClaim: cycle.currentDay <= cycleLength,
    nextClaimAt,
    expiresAt,
    isMissed: false,
  };
}

/**
 * Resolves the visual/interaction status of each day (1 to cycleLength) in the streak.
 * Status values: 'CLAIMED' | 'AVAILABLE' | 'TODAY' | 'LOCKED' | 'MISSED'
 *
 * @param {number} day - The day number (1..cycleLength)
 * @param {Object} phaseInfo - Computed phase info from computeStreakPhase
 * @param {Array<number>} claimedDays - Array of claimed days (e.g. [1, 2])
 * @returns {string} Status string
 */
export function resolveDayStatus(day, phaseInfo, claimedDays = []) {
  if (claimedDays.includes(day)) {
    return 'CLAIMED';
  }

  if (phaseInfo.isMissed) {
    if (day < phaseInfo.targetDay) return 'CLAIMED';
    return 'MISSED';
  }

  if (day === phaseInfo.targetDay) {
    if (phaseInfo.phase === 'READY') {
      return 'AVAILABLE';
    }
    if (phaseInfo.phase === 'WAITING') {
      return 'TODAY';
    }
  }

  if (day > phaseInfo.targetDay) {
    return 'LOCKED';
  }

  return 'LOCKED';
}

/**
 * Calculates new timestamps and cycle progression when a claim is confirmed.
 */
export function calculateNextClaimSchedule(claimedDay, config, claimTimeInput = new Date()) {
  const claimTime = claimTimeInput instanceof Date ? claimTimeInput : new Date(claimTimeInput);
  const intervalMs = (config.claimIntervalHours || 24) * 60 * 60 * 1000;
  const windowMs = (config.claimWindowHours || 24) * 60 * 60 * 1000;
  const cycleLength = config.cycleLength || 7;

  const nextClaimAt = new Date(claimTime.getTime() + intervalMs);
  const expiresAt = new Date(nextClaimAt.getTime() + windowMs);
  const isFinalDayOfCycle = claimedDay >= cycleLength;

  return {
    nextClaimAt,
    expiresAt,
    nextDay: isFinalDayOfCycle ? 1 : claimedDay + 1,
    isCycleCompleted: isFinalDayOfCycle,
  };
}

export default {
  computeStreakPhase,
  resolveDayStatus,
  calculateNextClaimSchedule,
};
