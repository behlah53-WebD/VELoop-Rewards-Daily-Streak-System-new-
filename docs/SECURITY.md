# VELoop Rewards — Comprehensive Security & Threat Model

This document outlines the security architecture, threat model, and anti-abuse safeguards enforced in the VELoop Rewards engine.

---

## 🛡️ Core Security Architecture

### 1. Zero Client Trust Principle
- React never owns or dictates:
  - Streak counts, current day, eligibility, countdown durations, reward amounts, or wallet balances.
- Any client attempt to send forged fields (`reward`, `amount`, `currency`, `streak`, `userId`, `currentDay`) is automatically stripped by Zod schema validators using `.strip()`.
- User identity is derived exclusively from cryptographically verified JSON Web Tokens (`jwt.verify`).

### 2. Temporal Authority & Device Clock Isolation
- All time-dependent calculations (`nextClaimAt`, `expiresAt`, `demoReadyAt`, `pendingExpiresAt`) evaluate exclusively against server time (`clock.js`).
- Tampering with the client device clock has zero impact on server eligibility. A client timer reaching zero triggers a server verification request (`GET /api/daily-streak/status`), and the UI flips only if the server confirms `canClaim: true`.

### 3. Two-Phase Claim Protocol & CPA Verification Delay
- Claims require a two-phase handshake:
  1. `POST /api/daily-streak/claim`: Checks eligibility and initiates a `PENDING` claim with `demoReadyAt = now + cpaDemoSeconds * 1000`. No currency or voucher is granted.
  2. `POST /api/daily-streak/claim/confirm`: Enforces `now >= demoReadyAt`. Premature confirmation requests return `CLAIM_NOT_READY` with `retryAfterMs`.

### 4. Idempotency & Concurrency Safety
- Every claim confirmation uses an `Idempotency-Key` and executes within an atomic MongoDB transaction.
- If two simultaneous requests hit `/claim/confirm` in parallel:
  - The first winning transaction commits the updates and credits the wallet.
  - The second concurrent request hits a write conflict or status check, safely aborts, and returns the original success payload with `idempotentReplay: true` and **zero second credit**.
- Double-clicks and multiple open browser tabs are completely safe against duplicate rewards.

### 5. Multi-Tenant Cross-User Attack Defense
- Confirmations query the claim record using both `claimId` AND the authenticated user's `userId`:
  ```javascript
  const claim = await StreakClaim.findOne({ claimId, userId });
  ```
- If User B attempts to confirm User A's `claimId`, the query returns `null`, resulting in HTTP 404 `NOT_FOUND` and an `INVALID_CLAIM` audit log.

### 6. Information Leakage Prevention
- Centralized error middleware intercepts all exceptions.
- Internal database details (`MongoServerError`, `CastError`, `E11000`, stack traces) are masked in all responses.
- Responses conform strictly to safe structured error envelopes:
  ```json
  {
    "success": false,
    "error": {
      "code": "STILL_LOCKED",
      "message": "Your next reward is not available yet.",
      "requestId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
    }
  }
  ```

### 7. Denial of Service & Abuse Mitigation
- **Helmet:** Sets modern security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy`).
- **Strict CORS:** Limits browser origins to the configured `CLIENT_ORIGIN`.
- **Payload Limits:** Limits body parsing to `10kb` to prevent memory flooding.
- **NoSQL Injection:** Sanitizes inputs with `express-mongo-sanitize`.
- **Tiered Rate Limiting:**
  - Global limiter: 300 requests / 15 minutes.
  - Strict limiter: 30 requests / minute on `/claim`, `/confirm`, `/login`, `/register`.
- **Audit Logging:** Every claim request, success, rejection, duplicate attempt, and dev tool usage is recorded in `AuditLog`.
