# VELoop Rewards — Database Schema & Data Integrity

MongoDB is the single source of truth for all streak, claim, and reward state.

## Collections & Indexes

### 1. `User`
- `_id`: ObjectId
- `name`: String
- `email`: String (lowercase, unique index)
- `passwordHash`: String (bcrypt hash)
- `role`: String ('USER' | 'ADMIN')
- `status`: String ('ACTIVE' | 'SUSPENDED') — suspended accounts cannot claim
- `createdAt`, `updatedAt`: Date

### 2. `Wallet`
- `_id`: ObjectId
- `userId`: ObjectId (unique index, references User)
- `balances`: `{ VES: Number, INR: Number }` (strictly non-negative integers)
- `updatedAt`: Date

### 3. `StreakConfig`
- `cycleLength`: Number (default: 7)
- `claimIntervalHours`: Number (default: 24)
- `claimWindowHours`: Number (default: 24)
- `resetOnMiss`: Boolean (default: true)
- `pendingClaimTtlSeconds`: Number (default: 120)
- `cpaDemoSeconds`: Number (default: 3)
- `active`: Boolean

### 4. `StreakReward`
- `day`: Number (1 through 7)
- `rewardType`: String ('VES' | 'GIFT_CARD')
- `currency`: String ('VES' | 'INR')
- `amount`: Number
- `title`: String
- `subtitle`: String
- `description`: String
- `assetType`: String ('coin' | 'gift-box' | 'gift-card' | 'crown')
- `badge`: String (optional, e.g. 'Gift Card', 'Coin', 'VIP')
- `isUltimate`: Boolean
- `active`: Boolean
- **Index**: Unique compound index on `(day, active)`

### 5. `StreakCycle`
- `userId`: ObjectId (references User)
- `cycleNumber`: Number
- `status`: String ('ACTIVE' | 'COMPLETED' | 'BROKEN')
- `currentDay`: Number (next day eligible to claim)
- `claimedDays`: Array of Numbers
- `lastClaimAt`: Date
- `nextClaimAt`: Date (unlock time)
- `expiresAt`: Date (missed-claim deadline)
- `streakCount`: Number
- `longestStreak`: Number
- `startedAt`, `endedAt`: Date
- `endReason`: String ('COMPLETED' | 'MISSED' | 'ADMIN')
- `resetNoticeAcknowledged`: Boolean
- **Index**: Partial unique index on `userId` where `status: 'ACTIVE'` (guarantees at most one active cycle per user)

### 6. `StreakClaim`
- `claimId`: UUID (unique)
- `userId`: ObjectId
- `cycleId`: ObjectId (references StreakCycle)
- `day`: Number
- `rewardId`: ObjectId (references StreakReward)
- `rewardSnapshot`: `{ type, currency, amount, title }`
- `status`: String ('PENDING' | 'COMPLETED' | 'EXPIRED' | 'REJECTED' | 'MISSED')
- `idempotencyKey`: String
- `pendingExpiresAt`: Date
- `demoReadyAt`: Date
- `claimedAt`: Date
- `transactionId`: UUID
- **Index**: Unique compound index on `(userId, cycleId, day)`

### 7. `WalletTransaction`
- `transactionId`: UUID (unique)
- `userId`: ObjectId
- `currency`: String ('VES' | 'INR')
- `type`: String ('CREDIT')
- `amount`: Number
- `source`: String ('DAILY_STREAK')
- `streakDay`: Number
- `referenceId`: String ('STREAK-XXXXXXXX', unique)
- `claimId`: UUID (unique)
- `balanceBefore`: Number
- `balanceAfter`: Number
- `status`: String ('COMPLETED' | 'PENDING_FULFILLMENT')
- `createdAt`: Date

### 8. `AuditLog`
- `userId`: ObjectId
- `event`: String ('STREAK_CLAIM_REQUEST' | 'STREAK_CLAIM_SUCCESS' | 'STREAK_CLAIM_REJECTED' | 'STREAK_RESET' | 'DUPLICATE_CLAIM' | 'INVALID_CLAIM' | 'DEV_TIME_TRAVEL')
- `requestId`: String
- `ip`: String
- `userAgent`: String
- `details`: Object
- `createdAt`: Date

---

## Audit Traceability Chain
`StreakClaim` → `StreakReward` → `WalletTransaction` → `Wallet balance`
Each claim transaction references its parent `claimId` and `referenceId`, with exact balance snapshots before and after the credit.
