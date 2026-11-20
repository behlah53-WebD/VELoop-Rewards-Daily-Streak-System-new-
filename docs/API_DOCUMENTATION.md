# VELoop Rewards — Comprehensive API Documentation

All API endpoints are prefixed with `/api` unless otherwise noted (such as `/health`). Protected routes require a valid Bearer token in the `Authorization` header (`Authorization: Bearer <token>`).

---

## 🟢 Base & System Endpoints

### `GET /health`
- **Auth**: Public
- **Description**: Keep-warm and health monitoring endpoint for cloud providers.
- **Response**:
```json
{
  "success": true,
  "status": "UP",
  "serverTime": "2026-11-20T12:00:00.000Z",
  "uptime": 120,
  "database": "CONNECTED"
}
```

### `GET /api`
- **Auth**: Public
- **Description**: API root status and version information.

---

## 🔐 Authentication Endpoints

### `POST /api/auth/register`
- **Auth**: Public (Strict Rate Limited: 30 req/min)
- **Body**:
```json
{
  "name": "Demo User",
  "email": "demo@veloop.test",
  "password": "Password123!"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": "673f4e2a8c1d5b3a9e7f1234",
    "name": "Demo User",
    "email": "demo@veloop.test",
    "role": "USER",
    "status": "ACTIVE"
  },
  "wallet": {
    "VES": 0,
    "INR": 0
  }
}
```

### `POST /api/auth/login`
- **Auth**: Public (Strict Rate Limited: 30 req/min)
- **Body**:
```json
{
  "email": "demo@veloop.test",
  "password": "Demo@1234"
}
```
- **Response (200 OK)**: Returns JWT token, user object, and wallet balances.

### `GET /api/auth/me`
- **Auth**: Protected (`Bearer <token>`)
- **Response**: Returns authenticated user profile and current wallet balances.

---

## 📅 Daily Streak Endpoints

### `GET /api/daily-streak`
- **Auth**: Protected
- **Description**: Returns the comprehensive state of the active streak, 7-day reward list, countdowns, and reset banners.
- **Response**:
```json
{
  "success": true,
  "serverTime": "2026-09-05T12:00:00.000Z",
  "streak": {
    "status": "ACTIVE",
    "phase": "WAITING",
    "currentStreak": 1,
    "currentDay": 2,
    "checkedIn": 1,
    "totalRewards": 7,
    "nextClaimAt": "2026-09-06T12:00:00.000Z",
    "expiresAt": "2026-09-07T12:00:00.000Z",
    "canClaim": false,
    "longestStreak": 1,
    "nextReward": {
      "day": 2,
      "type": "VES",
      "amount": 10,
      "currency": "VES",
      "title": "+10 VEs"
    },
    "ultimateReward": {
      "day": 7,
      "amount": 5,
      "currency": "INR",
      "title": "₹5 Amazon Gift Card",
      "unlockDay": 7
    },
    "resetNotice": null
  },
  "rewards": [
    {
      "day": 1,
      "status": "CLAIMED",
      "badge": null,
      "assetType": "coin",
      "isUltimate": false,
      "nextClaimAt": null,
      "reward": {
        "type": "VES",
        "amount": 5,
        "currency": "VES",
        "title": "+5 VEs"
      }
    },
    {
      "day": 2,
      "status": "TODAY",
      "badge": null,
      "assetType": "coin",
      "isUltimate": false,
      "nextClaimAt": "2026-09-06T12:00:00.000Z",
      "reward": {
        "type": "VES",
        "amount": 10,
        "currency": "VES",
        "title": "+10 VEs"
      }
    }
  ],
  "wallet": {
    "VES": 125,
    "INR": 0
  }
}
```

### `GET /api/daily-streak/status`
- **Auth**: Protected
- **Description**: Lightweight synchronization endpoint polled by the monotonic countdown timer when hitting zero.
- **Response**:
```json
{
  "success": true,
  "serverTime": "2026-09-06T12:00:00.050Z",
  "phase": "READY",
  "currentDay": 2,
  "nextClaimAt": "2026-09-06T12:00:00.000Z",
  "canClaim": true,
  "streakCount": 1,
  "wallet": { "VES": 125, "INR": 0 }
}
```

### `POST /api/daily-streak/claim`
- **Auth**: Protected (Strict Rate Limited)
- **Description**: Phase 1 of claim flow. Discards client-sent amounts/streaks; derives eligibility strictly on the server and initiates a `PENDING` claim.
- **Body**: `{ "day": 1 }` (optional hint; rejected if it mismatches server current day)
- **Response (200 OK)**:
```json
{
  "success": true,
  "claimId": "f7d3a2b1-5e4c-4991-87ab-123456789abc",
  "demoDurationMs": 3000,
  "serverTime": "2026-09-05T12:00:00.000Z"
}
```

### `POST /api/daily-streak/claim/confirm`
- **Auth**: Protected (Strict Rate Limited)
- **Headers**: `Idempotency-Key: <unique-id>`
- **Body**: `{ "claimId": "f7d3a2b1-5e4c-4991-87ab-123456789abc" }`
- **Description**: Phase 2 of claim flow. Verifies CPA demo completion delay (`now >= demoReadyAt`), executes inside a MongoDB transaction, advances cycle, credits wallet, and writes ledger entry.
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Reward claimed successfully!",
  "claimId": "f7d3a2b1-5e4c-4991-87ab-123456789abc",
  "day": 1,
  "reward": {
    "type": "VES",
    "currency": "VES",
    "amount": 5,
    "title": "+5 VEs"
  },
  "wallet": {
    "VES": 125,
    "INR": 0
  },
  "transaction": {
    "transactionId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "referenceId": "STREAK-9X8K2M1Q",
    "status": "COMPLETED"
  }
}
```

### `POST /api/daily-streak/reset-notice/ack`
- **Auth**: Protected
- **Description**: Acknowledges and dismisses the streak reset banner for the active cycle.

### `GET /api/daily-streak/history`
- **Auth**: Protected
- **Query**: `?page=1&limit=20`
- **Description**: Paginated claim records powering the Streak Calendar.

---

## 💰 Wallet Endpoints

### `GET /api/wallet`
- **Auth**: Protected
- **Description**: Returns wallet balances and up to 20 recent double-entry ledger transactions.

---

## 🛠️ Developer Tools Endpoints
*Only enabled when `ENABLE_DEV_TOOLS=true` and `NODE_ENV !== 'production'`.*

### `POST /api/dev/time-travel`
- **Auth**: Protected
- **Body**: `{ "advanceHours": 24.5 }`
- **Description**: Rewinds the user's stored timestamps by N hours, simulating time advancement for testing cooldowns and missed-day resets. Audited under `DEV_TIME_TRAVEL`.

### `POST /api/dev/reset-user`
- **Auth**: Protected
- **Description**: Resets the authenticated user's cycles, claims, and wallet balance back to initial 120 VEs for evaluation re-runs.
