import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import { setupTestDB, teardownTestDB } from './setup.js';
import clock from '../src/services/clock.js';
import { StreakConfig } from '../src/models/StreakConfig.js';
import { StreakCycle } from '../src/models/StreakCycle.js';

describe('VELoop Daily Streak Engine — E2E Proof & Security Suite', () => {
  let demoToken = '';
  let secondUserToken = '';

  beforeAll(async () => {
    jest.setTimeout(60000);
    await setupTestDB();

    // Login default demo user
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'demo@veloop.test', password: 'Demo@1234' });
    demoToken = loginRes.body.token;

    // Register a secondary user for cross-user attack tests
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Attacker User', email: 'attacker@veloop.test', password: 'Password123!' });
    secondUserToken = registerRes.body.token;
  });

  afterAll(async () => {
    clock.resetOffset();
    await teardownTestDB();
  });

  afterEach(() => {
    clock.resetOffset();
  });

  it('13. Unauthenticated request returns 401 UNAUTHENTICATED', async () => {
    const res = await request(app).get('/api/daily-streak');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHENTICATED');
  });

  it('14. Refresh/relogin state persistence: state matches database on fresh token', async () => {
    const res = await request(app)
      .get('/api/daily-streak')
      .set('Authorization', `Bearer ${demoToken}`);

    expect(res.status).toBe(200);
    expect(res.body.streak.currentDay).toBe(1);
    expect(res.body.streak.canClaim).toBe(true);
    expect(res.body.wallet.VES).toBe(120);
    expect(res.body.rewards).toHaveLength(7);
  });

  it('1. Normal claim flow (Day 1 -> Day 2) with CPA readiness check', async () => {
    // Initiate Day 1 claim
    const initRes = await request(app)
      .post('/api/daily-streak/claim')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ day: 1 });

    expect(initRes.status).toBe(200);
    expect(initRes.body.success).toBe(true);
    expect(initRes.body).toHaveProperty('claimId');
    const claimId = initRes.body.claimId;

    // Immediate confirm before demoDuration should fail with CLAIM_NOT_READY
    const earlyConfirmRes = await request(app)
      .post('/api/daily-streak/claim/confirm')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ claimId });

    expect(earlyConfirmRes.status).toBe(400);
    expect(earlyConfirmRes.body.error.code).toBe('CLAIM_NOT_READY');
    expect(earlyConfirmRes.body.error).toHaveProperty('retryAfterMs');

    // Simulate CPA demo duration completion (advance server clock by 4 seconds)
    clock.advanceTime(4000);

    // Confirm Day 1 claim
    const confirmRes = await request(app)
      .post('/api/daily-streak/claim/confirm')
      .set('Authorization', `Bearer ${demoToken}`)
      .set('Idempotency-Key', 'test-idempotency-key-day-1')
      .send({ claimId });

    expect(confirmRes.status).toBe(200);
    expect(confirmRes.body.success).toBe(true);
    expect(confirmRes.body.day).toBe(1);
    expect(confirmRes.body.reward.amount).toBe(5);
    expect(confirmRes.body.reward.currency).toBe('VES');
    // Balance before 120 + 5 = 125 VEs
    expect(confirmRes.body.wallet.VES).toBe(125);
    expect(confirmRes.body.transaction).toHaveProperty('referenceId');

    // Fetch updated streak
    const statusRes = await request(app)
      .get('/api/daily-streak')
      .set('Authorization', `Bearer ${demoToken}`);

    expect(statusRes.body.streak.currentDay).toBe(2);
    expect(statusRes.body.streak.currentStreak).toBe(1);
    expect(statusRes.body.streak.phase).toBe('WAITING');
    expect(statusRes.body.streak.canClaim).toBe(false);
    expect(statusRes.body.rewards[0].status).toBe('CLAIMED');
    expect(statusRes.body.rewards[1].status).toBe('TODAY');
  });

  it('2. Already claimed: attempting to initiate Day 1 again returns ALREADY_CLAIMED', async () => {
    const res = await request(app)
      .post('/api/daily-streak/claim')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ day: 1 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('ALREADY_CLAIMED');
  });

  it('3. Locked day: attempting to claim Day 2 during cooldown interval returns STILL_LOCKED', async () => {
    const res = await request(app)
      .post('/api/daily-streak/claim')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ day: 2 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('STILL_LOCKED');
    expect(res.body.error.message).toContain('not available yet');
  });

  it('4. Timer & Server clock authority: client cannot bypass cooldown by sending forged hints or times', async () => {
    // Attempting to initiate claim while server time is still in cooldown
    const res = await request(app)
      .post('/api/daily-streak/claim')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ day: 2, clientTimestamp: new Date(Date.now() + 86400000).toISOString() });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('STILL_LOCKED');
  });

  it('6. Duplicate confirm replay returns original success and grants NO second credit', async () => {
    // Fast-forward by 24h via dev time-travel to unlock Day 2
    await request(app)
      .post('/api/dev/time-travel')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ advanceHours: 24.5 });

    // Initiate Day 2 claim
    const initRes = await request(app)
      .post('/api/daily-streak/claim')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ day: 2 });

    expect(initRes.status).toBe(200);
    const claimId = initRes.body.claimId;

    clock.advanceTime(4000);

    // Confirm first time
    const firstConfirm = await request(app)
      .post('/api/daily-streak/claim/confirm')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ claimId });

    expect(firstConfirm.status).toBe(200);
    expect(firstConfirm.body.wallet.VES).toBe(135); // 125 + 10 = 135

    // Replay confirm second time
    const replayConfirm = await request(app)
      .post('/api/daily-streak/claim/confirm')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ claimId });

    expect(replayConfirm.status).toBe(200);
    expect(replayConfirm.body.idempotentReplay).toBe(true);
    expect(replayConfirm.body.wallet.VES).toBe(135); // Still 135, NO second credit!
  });

  it('7. Concurrency safe: simultaneous confirms via Promise.all result in exactly ONE credit', async () => {
    // Advance time by 24h to unlock Day 3
    await request(app)
      .post('/api/dev/time-travel')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ advanceHours: 24.5 });

    // Initiate Day 3 claim
    const initRes = await request(app)
      .post('/api/daily-streak/claim')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ day: 3 });

    expect(initRes.status).toBe(200);
    const claimId = initRes.body.claimId;

    clock.advanceTime(4000);

    // Fire 3 simultaneous confirm requests concurrently
    const [res1, res2, res3] = await Promise.all([
      request(app)
        .post('/api/daily-streak/claim/confirm')
        .set('Authorization', `Bearer ${demoToken}`)
        .send({ claimId }),
      request(app)
        .post('/api/daily-streak/claim/confirm')
        .set('Authorization', `Bearer ${demoToken}`)
        .send({ claimId }),
      request(app)
        .post('/api/daily-streak/claim/confirm')
        .set('Authorization', `Bearer ${demoToken}`)
        .send({ claimId }),
    ]);

    // All should return either HTTP 200 (primary or idempotent replay) or HTTP 409 ALREADY_CLAIMED
    const statuses = [res1.status, res2.status, res3.status];
    expect(statuses.filter((s) => s === 200).length).toBeGreaterThanOrEqual(1);
    statuses.forEach((s) => expect([200, 409]).toContain(s));

    // Check final wallet balance: Day 3 reward is +15 VEs -> 135 + 15 = 150 VEs (EXACTLY ONE CREDIT!)
    const walletRes = await request(app)
      .get('/api/wallet')
      .set('Authorization', `Bearer ${demoToken}`);

    expect(walletRes.body.wallet.VES).toBe(150);
  });

  it('8. Fake reward amount & currency in payload are ignored/stripped', async () => {
    // Advance time to Day 4
    await request(app)
      .post('/api/dev/time-travel')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ advanceHours: 24.5 });

    // Client attempts to send fake amount = 99999 and currency = 'USD'
    const initRes = await request(app)
      .post('/api/daily-streak/claim')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ day: 4, amount: 99999, currency: 'USD', reward: { amount: 99999 } });

    expect(initRes.status).toBe(200);
    const claimId = initRes.body.claimId;

    clock.advanceTime(4000);

    const confirmRes = await request(app)
      .post('/api/daily-streak/claim/confirm')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ claimId, amount: 99999, currency: 'USD' });

    expect(confirmRes.status).toBe(200);
    // Day 4 is ₹1 Amazon Gift Card (INR), amount MUST be 1 from database!
    expect(confirmRes.body.reward.amount).toBe(1);
    expect(confirmRes.body.reward.currency).toBe('INR');
  });

  it('9. Fake day (Day 7 requested while eligible for Day 5) is rejected and audited', async () => {
    // User is on Day 5, but sends day: 7
    const res = await request(app)
      .post('/api/daily-streak/claim')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ day: 7 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('DAY_MISMATCH');
    expect(res.body.error.message).toContain('Requested Day 7 does not match eligible Day 5');
  });

  it('10. Fake streak count in payload is completely ignored', async () => {
    // Advance time to Day 5
    await request(app)
      .post('/api/dev/time-travel')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ advanceHours: 24.5 });

    const res = await request(app)
      .post('/api/daily-streak/claim')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ day: 5, streak: 100, currentStreak: 100 });

    // Succeeded because day 5 is eligible, but fake streak field had zero effect
    expect(res.status).toBe(200);
    const claimId = res.body.claimId;

    clock.advanceTime(4000);

    await request(app)
      .post('/api/daily-streak/claim/confirm')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ claimId });

    const statusRes = await request(app)
      .get('/api/daily-streak')
      .set('Authorization', `Bearer ${demoToken}`);

    // Real streak count is 5, not 100
    expect(statusRes.body.streak.currentStreak).toBe(5);
  });

  it('11. Fake userId in payload is completely ignored (derived only from JWT)', async () => {
    await request(app)
      .post('/api/dev/time-travel')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ advanceHours: 24.5 });

    // Attacker token user tries to send demo user's ID
    const res = await request(app)
      .post('/api/daily-streak/claim')
      .set('Authorization', `Bearer ${secondUserToken}`)
      .send({ day: 1, userId: '666666666666666666666666' });

    expect(res.status).toBe(200);
    // Claim was created for the second user (Day 1), not the fake userId
  });

  it('12. Cross-user claimId confirmation is rejected with 404/NOT_FOUND', async () => {
    // Second user initiates Day 1 claim
    const initRes = await request(app)
      .post('/api/daily-streak/claim')
      .set('Authorization', `Bearer ${secondUserToken}`);

    const victimClaimId = initRes.body.claimId;

    // Attacker attempts to confirm using second user's claimId
    const attackRes = await request(app)
      .post('/api/daily-streak/claim/confirm')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ claimId: victimClaimId });

    expect(attackRes.status).toBe(404);
    expect(attackRes.body.error.code).toBe('NOT_FOUND');
  });

  it('5. Missed day: advancing time past expiresAt resets the streak to Day 1 with reset notice', async () => {
    // Current streak is at Day 6. Advance time past expiresAt (by 55 hours: 24h interval + 24h window + 7h overdue)
    await request(app)
      .post('/api/dev/time-travel')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({ advanceHours: 55 });

    // Next request triggers lazy reset
    const res = await request(app)
      .get('/api/daily-streak')
      .set('Authorization', `Bearer ${demoToken}`);

    expect(res.status).toBe(200);
    expect(res.body.streak.currentDay).toBe(1);
    expect(res.body.streak.currentStreak).toBe(0);
    expect(res.body.streak.canClaim).toBe(true);
    expect(res.body.streak.resetNotice).not.toBeNull();
    expect(res.body.streak.resetNotice.message).toContain('reset');

    // Acknowledge reset notice
    const ackRes = await request(app)
      .post('/api/daily-streak/reset-notice/ack')
      .set('Authorization', `Bearer ${demoToken}`);

    expect(ackRes.status).toBe(200);
    expect(ackRes.body.acknowledged).toBe(true);
  });

  it('15. Full 7-day cycle completion starts a new cycle while preserving streak progression', async () => {
    // Reset user to start fresh 7-day cycle run
    await request(app)
      .post('/api/dev/reset-user')
      .set('Authorization', `Bearer ${demoToken}`);

    // Temporarily reduce interval to 0 in config to rapidly claim Days 1 through 7
    await StreakConfig.findOneAndUpdate(
      { configKey: 'default' },
      { $set: { claimIntervalHours: 0, cpaDemoSeconds: 0 } }
    );

    for (let day = 1; day <= 7; day++) {
      const initRes = await request(app)
        .post('/api/daily-streak/claim')
        .set('Authorization', `Bearer ${demoToken}`)
        .send({ day });

      expect(initRes.status).toBe(200);

      const confirmRes = await request(app)
        .post('/api/daily-streak/claim/confirm')
        .set('Authorization', `Bearer ${demoToken}`)
        .send({ claimId: initRes.body.claimId });

      expect(confirmRes.status).toBe(200);
      expect(confirmRes.body.day).toBe(day);
    }

    // Check database cycle status
    const previousCycle = await StreakCycle.findOne({
      userId: (await request(app).get('/api/auth/me').set('Authorization', `Bearer ${demoToken}`)).body.user.id,
      cycleNumber: 1,
    });

    expect(previousCycle.status).toBe('COMPLETED');
    expect(previousCycle.claimedDays).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(previousCycle.streakCount).toBe(7);

    // Verify GET /daily-streak reflects completed cycle / next cycle ready
    const streakRes = await request(app)
      .get('/api/daily-streak')
      .set('Authorization', `Bearer ${demoToken}`);

    expect(streakRes.body.streak.currentStreak).toBe(7);
  });
});
