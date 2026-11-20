# VELoop Rewards — Security & Concurrency Architecture

## Non-Negotiable Security Principles

1. **Zero Client Trust:**
   - Client-sent `streak`, `reward`, `amount`, `currency`, `userId`, `currentDay` are discarded.
   - Validation schemas (built with Zod) use `.strip()` to discard unexpected parameters.
   - User identity is extracted solely from verified JWT signatures.

2. **Server Time Authority:**
   - All temporal computations (`nextClaimAt`, `expiresAt`, `demoReadyAt`, `pendingExpiresAt`) evaluate exclusively against the server clock.
   - Device clock changes on the frontend have zero influence on backend eligibility.

3. **Two-Phase Claim Verification:**
   - Rewards cannot be claimed directly via a single call.
   - Phase 1 initiates a `PENDING` claim with `demoReadyAt = now + cpaDemoSeconds`.
   - Phase 2 validates `now >= demoReadyAt`. Premature confirmations are rejected with `CLAIM_NOT_READY`.

4. **Concurrency & Race Condition Prevention:**
   - Confirmation is executed inside a MongoDB atomic transaction (or atomic conditional `findOneAndUpdate`).
   - The conditional query checks:
     `{ _id: cycleId, status: 'ACTIVE', currentDay: claim.day, nextClaimAt: { $lte: now }, expiresAt: { $gte: now } }`
   - Simultaneous requests from the same user or multiple tabs fail atomically, ensuring exactly one credit.

5. **Rate Limiting & Abuse Prevention:**
   - Global rate limiter on `/api` routes.
   - Strict rate limiter on `/api/daily-streak/claim`, `/api/daily-streak/claim/confirm`, and `/api/auth/login`.

6. **Information Disclosure Prevention:**
   - Stack traces, Mongoose `CastError`, and raw database errors are intercepted by a centralized error handler.
   - Responses always conform to `{ success: false, error: { code, message } }`.
