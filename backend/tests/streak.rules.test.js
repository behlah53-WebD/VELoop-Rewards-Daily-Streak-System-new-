import {
  computeStreakPhase,
  resolveDayStatus,
  calculateNextClaimSchedule,
} from '../src/services/streak.rules.js';

describe('Streak Rules Engine (Pure Functions)', () => {
  const config = {
    cycleLength: 7,
    claimIntervalHours: 24,
    claimWindowHours: 24,
  };

  const baseDate = new Date('2026-09-01T12:00:00.000Z');

  describe('computeStreakPhase', () => {
    it('returns READY and Day 1 AVAILABLE when user has not claimed yet in cycle', () => {
      const cycle = {
        status: 'ACTIVE',
        currentDay: 1,
        claimedDays: [],
        lastClaimAt: null,
      };

      const result = computeStreakPhase(cycle, config, baseDate);

      expect(result.phase).toBe('READY');
      expect(result.targetDay).toBe(1);
      expect(result.canClaim).toBe(true);
      expect(result.isMissed).toBe(false);
    });

    it('returns WAITING and canClaim=false when cooldown interval has not elapsed', () => {
      const lastClaimAt = new Date('2026-09-01T12:00:00.000Z');
      const nextClaimAt = new Date('2026-09-02T12:00:00.000Z'); // 24h later
      const expiresAt = new Date('2026-09-03T12:00:00.000Z'); // 48h later
      const now = new Date('2026-09-01T20:00:00.000Z'); // Only 8 hours later

      const cycle = {
        status: 'ACTIVE',
        currentDay: 2,
        claimedDays: [1],
        lastClaimAt,
        nextClaimAt,
        expiresAt,
      };

      const result = computeStreakPhase(cycle, config, now);

      expect(result.phase).toBe('WAITING');
      expect(result.targetDay).toBe(2);
      expect(result.canClaim).toBe(false);
      expect(result.isMissed).toBe(false);
    });

    it('returns READY and canClaim=true when current time is between nextClaimAt and expiresAt', () => {
      const lastClaimAt = new Date('2026-09-01T12:00:00.000Z');
      const nextClaimAt = new Date('2026-09-02T12:00:00.000Z');
      const expiresAt = new Date('2026-09-03T12:00:00.000Z');
      const now = new Date('2026-09-02T14:30:00.000Z'); // 26.5 hours later (2.5 hours into window)

      const cycle = {
        status: 'ACTIVE',
        currentDay: 2,
        claimedDays: [1],
        lastClaimAt,
        nextClaimAt,
        expiresAt,
      };

      const result = computeStreakPhase(cycle, config, now);

      expect(result.phase).toBe('READY');
      expect(result.targetDay).toBe(2);
      expect(result.canClaim).toBe(true);
      expect(result.isMissed).toBe(false);
    });

    it('returns MISSED and isMissed=true when current time is past expiresAt', () => {
      const lastClaimAt = new Date('2026-09-01T12:00:00.000Z');
      const nextClaimAt = new Date('2026-09-02T12:00:00.000Z');
      const expiresAt = new Date('2026-09-03T12:00:00.000Z');
      const now = new Date('2026-09-03T12:01:00.000Z'); // Missed window by 1 minute

      const cycle = {
        status: 'ACTIVE',
        currentDay: 2,
        claimedDays: [1],
        lastClaimAt,
        nextClaimAt,
        expiresAt,
      };

      const result = computeStreakPhase(cycle, config, now);

      expect(result.phase).toBe('MISSED');
      expect(result.targetDay).toBe(2);
      expect(result.canClaim).toBe(false);
      expect(result.isMissed).toBe(true);
    });
  });

  describe('resolveDayStatus', () => {
    it('correctly maps CLAIMED, TODAY, and LOCKED during WAITING phase', () => {
      const phaseInfo = {
        phase: 'WAITING',
        targetDay: 2,
        isMissed: false,
      };
      const claimedDays = [1];

      expect(resolveDayStatus(1, phaseInfo, claimedDays)).toBe('CLAIMED');
      expect(resolveDayStatus(2, phaseInfo, claimedDays)).toBe('TODAY');
      expect(resolveDayStatus(3, phaseInfo, claimedDays)).toBe('LOCKED');
      expect(resolveDayStatus(7, phaseInfo, claimedDays)).toBe('LOCKED');
    });

    it('correctly maps CLAIMED, AVAILABLE, and LOCKED during READY phase', () => {
      const phaseInfo = {
        phase: 'READY',
        targetDay: 2,
        isMissed: false,
      };
      const claimedDays = [1];

      expect(resolveDayStatus(1, phaseInfo, claimedDays)).toBe('CLAIMED');
      expect(resolveDayStatus(2, phaseInfo, claimedDays)).toBe('AVAILABLE');
      expect(resolveDayStatus(3, phaseInfo, claimedDays)).toBe('LOCKED');
    });

    it('correctly maps MISSED status when streak is broken', () => {
      const phaseInfo = {
        phase: 'MISSED',
        targetDay: 3,
        isMissed: true,
      };
      const claimedDays = [1, 2];

      expect(resolveDayStatus(1, phaseInfo, claimedDays)).toBe('CLAIMED');
      expect(resolveDayStatus(2, phaseInfo, claimedDays)).toBe('CLAIMED');
      expect(resolveDayStatus(3, phaseInfo, claimedDays)).toBe('MISSED');
      expect(resolveDayStatus(4, phaseInfo, claimedDays)).toBe('MISSED');
    });
  });

  describe('calculateNextClaimSchedule', () => {
    it('advances currentDay from 1 to 2 with 24h interval and 24h window', () => {
      const claimTime = new Date('2026-09-01T12:00:00.000Z');
      const schedule = calculateNextClaimSchedule(1, config, claimTime);

      expect(schedule.nextDay).toBe(2);
      expect(schedule.isCycleCompleted).toBe(false);
      expect(schedule.nextClaimAt.toISOString()).toBe('2026-09-02T12:00:00.000Z');
      expect(schedule.expiresAt.toISOString()).toBe('2026-09-03T12:00:00.000Z');
    });

    it('marks cycle as completed when claiming the final day (Day 7)', () => {
      const claimTime = new Date('2026-09-07T12:00:00.000Z');
      const schedule = calculateNextClaimSchedule(7, config, claimTime);

      expect(schedule.isCycleCompleted).toBe(true);
      expect(schedule.nextDay).toBe(1);
    });
  });
});
