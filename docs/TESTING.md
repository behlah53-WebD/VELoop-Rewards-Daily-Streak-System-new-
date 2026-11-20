# VELoop Rewards — Testing Documentation & Proof

This document provides complete proof and instructions for executing the automated test suite and performing end-to-end manual testing of the VELoop Daily Streak & Rewards Engine.

---

## 🧪 1. Automated Test Suite (Jest + Supertest + In-Memory MongoDB Replica Set)

The automated test suite uses `mongodb-memory-server` in replica set mode to test atomic transactions, concurrency, and temporal mechanics with zero external dependencies.

### Running the Tests
```bash
cd backend
npm test
```

### Coverage of Non-Negotiable Rules & Edge Cases

| # | Test Scenario | Test Implementation | Assertion Proof |
|---|---|---|---|
| 1 | **Normal Claim (Day 1 -> Day 2)** | `streak.e2e.test.js` | Day 1 transitions to CLAIMED; Day 2 becomes TODAY (locked behind countdown); +5 VEs credited to wallet; audit logged. |
| 2 | **Premature Confirmation** | `streak.e2e.test.js` | Confirming before CPA demo duration (3s) completes returns HTTP 400 `CLAIM_NOT_READY` with `retryAfterMs`. |
| 3 | **Already Claimed Day** | `streak.e2e.test.js` | Attempting to initiate Day 1 again returns HTTP 400 `ALREADY_CLAIMED`. |
| 4 | **Locked Day (Early Claim)** | `streak.e2e.test.js` | Requesting Day 2 before `nextClaimAt` returns HTTP 400 `STILL_LOCKED`. |
| 5 | **Tampered Device Clock** | `streak.e2e.test.js` | Client-sent timestamps have no effect; server evaluates eligibility strictly against server clock. |
| 6 | **Duplicate Confirm Replay** | `streak.e2e.test.js` | Replaying an already-completed claim returns HTTP 200 with `idempotentReplay: true` and **zero second credit**. |
| 7 | **Concurrent Confirms (`Promise.all`)** | `streak.e2e.test.js` | 3 simultaneous confirm requests result in **exactly ONE credit**; write conflicts map to `ALREADY_CLAIMED` or idempotent replay. |
| 8 | **Fake Reward / Amount Spoofing** | `streak.e2e.test.js` | Sending `{ amount: 99999, currency: 'USD' }` is stripped by Zod; credit amount is pulled strictly from database snapshot. |
| 9 | **Fake Day Mismatch** | `streak.e2e.test.js` | Sending `{ day: 7 }` while eligible for Day 2 is rejected with HTTP 400 `DAY_MISMATCH` and audited as `INVALID_CLAIM`. |
| 10 | **Fake Streak Count** | `streak.e2e.test.js` | Sending `{ streak: 100 }` has zero effect; server tracks streak strictly in MongoDB. |
| 11 | **Fake User ID** | `streak.e2e.test.js` | Sending arbitrary `userId` is stripped; user is derived solely from verified JWT signature. |
| 12 | **Cross-User Claim Attack** | `streak.e2e.test.js` | User B attempting to confirm User A's `claimId` returns HTTP 404 `NOT_FOUND` and is audited. |
| 13 | **Unauthenticated Access** | `streak.e2e.test.js` | Requests without Bearer token return HTTP 401 `UNAUTHENTICATED`. |
| 14 | **State Persistence (Refresh/Login)** | `streak.e2e.test.js` | Fresh logins and token refresh retrieve identical state from MongoDB. |
| 15 | **Missed-Day Reset** | `streak.e2e.test.js` | Advancing past `expiresAt` lazily terminates cycle as `BROKEN`, audits `STREAK_RESET`, resets streak to 0, and returns `resetNotice`. |
| 16 | **Full 7-Day Cycle Completion** | `streak.e2e.test.js` | Claiming Days 1 through 7 marks cycle `COMPLETED` and advances to next cycle while preserving cumulative streak. |

---

## 🕹️ 2. Manual Verification Guide (via Postman or Curl)

Import the provided files into Postman:
- Collection: `postman/veloop_rewards.postman_collection.json`
- Environment: `postman/veloop_rewards.postman_environment.json`

### Step 1: Login Demo User
- **Method**: `POST /api/auth/login`
- **Body**:
  ```json
  { "email": "demo@veloop.test", "password": "Demo@1234" }
  ```
- **Result**: Returns JWT token and user profile. Postman environment variable `token` is updated automatically. Initial balance: **120 VEs**.

### Step 2: Check Initial Streak State
- **Method**: `GET /api/daily-streak`
- **Result**: `currentDay: 1`, `canClaim: true`, `phase: "READY"`. Day 1 has status `AVAILABLE`.

### Step 3: Initiate Claim (Day 1)
- **Method**: `POST /api/daily-streak/claim`
- **Body**: `{ "day": 1 }`
- **Result**: Returns `claimId` and `demoDurationMs: 3000`.

### Step 4: Test Premature Confirmation
- Immediately send: `POST /api/daily-streak/claim/confirm` with `{ "claimId": "..." }`.
- **Result**: HTTP 400 `CLAIM_NOT_READY` with `retryAfterMs`.

### Step 5: Confirm After CPA Duration (3s)
- Wait 3 seconds, then send: `POST /api/daily-streak/claim/confirm`.
- **Result**: HTTP 200 with `day: 1`, `reward: { amount: 5, currency: "VES" }`, `wallet: { VES: 125, INR: 0 }`.

### Step 6: Verify Locked Day 2
- Send: `POST /api/daily-streak/claim` with `{ "day": 2 }`.
- **Result**: HTTP 400 `STILL_LOCKED` ("Your next reward is not available yet.").

### Step 7: Dev Time-Travel (Fast-Forward 24.5 Hours)
- Send: `POST /api/dev/time-travel` with `{ "advanceHours": 24.5 }`.
- **Result**: Active cycle timestamps rewound by 24.5h.
- Send: `GET /api/daily-streak/status`.
- **Result**: `canClaim: true`, `phase: "READY"`, `currentDay: 2`.

### Step 8: Test Missed Day Reset
- Send: `POST /api/dev/time-travel` with `{ "advanceHours": 55 }`.
- Send: `GET /api/daily-streak`.
- **Result**: Cycle marked `BROKEN`. New active cycle started at Day 1 (`currentDay: 1`, `currentStreak: 0`). `resetNotice` displayed.
- Dismiss banner: `POST /api/daily-streak/reset-notice/ack` returns `{ success: true, acknowledged: true }`.
