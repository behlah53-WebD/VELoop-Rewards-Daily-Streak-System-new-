# VELoop Rewards — API Documentation

All API endpoints are prefixed with `/api` unless otherwise noted (such as `/health`). Protected routes require a Bearer token in the `Authorization` header (`Authorization: Bearer <token>`).

## Base Endpoints

### `GET /health`
- **Auth**: Public
- **Description**: Health check and server status endpoint.
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

---

## Authentication Endpoints

### `POST /api/auth/register`
- **Auth**: Public
- **Body**: `{ "name": "Demo User", "email": "demo@veloop.test", "password": "Password123!" }`
- **Response**: `{ "success": true, "token": "...", "user": { "id": "...", "name": "...", "email": "..." } }`

### `POST /api/auth/login`
- **Auth**: Public
- **Body**: `{ "email": "demo@veloop.test", "password": "Password123!" }`
- **Response**: `{ "success": true, "token": "...", "user": { "id": "...", "name": "...", "email": "..." } }`

### `GET /api/auth/me`
- **Auth**: Protected
- **Response**: `{ "success": true, "user": { "id": "...", "name": "...", "email": "...", "status": "ACTIVE" } }`

---

## Daily Streak Endpoints

### `GET /api/daily-streak`
- **Auth**: Protected
- **Description**: Returns the full state of the active 7-day streak, rewards configuration, wallet, and reset notices.
- **Response Shape**:
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
    "nextReward": { "day": 2, "type": "VES", "amount": 10, "currency": "VES", "title": "+10 VEs" },
    "ultimateReward": { "day": 7, "amount": 5, "currency": "INR", "title": "Amazon Gift Card", "unlockDay": 7 },
    "resetNotice": null
  },
  "rewards": [
    { "day": 1, "status": "CLAIMED", "badge": null, "assetType": "coin", "reward": { "type": "VES", "amount": 5, "currency": "VES", "title": "5 VEs" } },
    { "day": 2, "status": "TODAY", "nextClaimAt": "...", "assetType": "coin", "reward": { "type": "VES", "amount": 10, "currency": "VES", "title": "10 VEs" } }
  ],
  "wallet": { "VES": 120, "INR": 0 }
}
```

### `GET /api/daily-streak/status`
- **Auth**: Protected
- **Description**: Lightweight synchronization endpoint used by the countdown timer when reaching zero.

### `POST /api/daily-streak/claim`
- **Auth**: Protected
- **Description**: Phase 1 of claim. Validates server-derived eligibility and initializes a PENDING claim.
- **Body**: `{ "day": 2 }` (optional hint; ignored or verified against server state)
- **Response**:
```json
{
  "success": true,
  "claimId": "c4b3161a-9ab4-4b0f-b3cb-0740eeacc675",
  "demoDurationMs": 3000,
  "serverTime": "2026-09-05T12:00:00.000Z"
}
```

### `POST /api/daily-streak/claim/confirm`
- **Auth**: Protected
- **Headers**: `Idempotency-Key: <unique-uuid>`
- **Body**: `{ "claimId": "c4b3161a-9ab4-4b0f-b3cb-0740eeacc675" }`
- **Description**: Phase 2 of claim. Verifies demo readiness, executes atomic transaction, updates cycle, credits wallet, inserts transaction, and audits event.

### `POST /api/daily-streak/reset-notice/ack`
- **Auth**: Protected
- **Description**: Dismisses and acknowledges the streak reset banner for the active cycle.

### `GET /api/daily-streak/history`
- **Auth**: Protected
- **Query**: `?page=1&limit=20`
- **Description**: Paginated claim history powering the Streak Calendar.

---

## Wallet Endpoints

### `GET /api/wallet`
- **Auth**: Protected
- **Description**: Returns balances and recent transactions.

---

## Developer Time-Travel Endpoints

### `POST /api/dev/time-travel`
- **Auth**: Protected (Enabled only if `ENABLE_DEV_TOOLS=true` and `NODE_ENV !== 'production'`)
- **Body**: `{ "advanceHours": 24 }`
- **Description**: Rewinds stored timestamps by N hours, simulating the passage of time for testing countdowns and expirations.

### `POST /api/dev/reset-user`
- **Auth**: Protected (Enabled only if `ENABLE_DEV_TOOLS=true` and `NODE_ENV !== 'production'`)
- **Description**: Resets the authenticated user's streak and claims for evaluation testing.
