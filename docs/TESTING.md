# VELoop Rewards — Testing Documentation

## Test Strategy Overview

The testing suite validates all requirements outlined in the VELoop specification:
- Pure rules engine tests (deterministic time calculations)
- API endpoint integration tests (Supertest + In-Memory MongoDB replica set)
- Concurrency & idempotency tests (`Promise.all` parallel claims)
- Security & tamper-resistance tests (fake payloads, invalid tokens, cross-user claims)
- Time-travel and streak reset verification

## Running Automated Tests

```bash
# Run all backend tests
cd backend
npm test

# Run with watch mode
npm run test:watch
```

## Manual Verification Matrix

| Test Case | Steps | Expected Outcome |
|---|---|---|
| 1. Normal Claim (Day 1) | Click "Claim Now" on Day 1 | CPA demo displays for 3s -> Claim completes -> Balance +5 VEs -> Next reward Day 2 locked |
| 2. Locked Day | Attempt to claim Day 2 immediately | Rejected with `STILL_LOCKED` code |
| 3. Tampered Device Clock | Change local device clock forward 24 hours | UI countdown may show 00:00:00, but sync request confirms `canClaim: false`. Backend rejects claim |
| 4. Concurrent Claims | Trigger two simultaneous confirm requests | Exactly one succeeds, second returns `ALREADY_CLAIMED` / idempotent replay |
| 5. Fake Payload | Send `{ "amount": 1000, "day": 7 }` | Ignored. Backend grants only Day 1 reward (5 VEs) |
| 6. Missed Day Reset | Advance time past `expiresAt` via dev tool | Lazy check marks cycle BROKEN, starts new cycle at Day 1, shows reset banner |
