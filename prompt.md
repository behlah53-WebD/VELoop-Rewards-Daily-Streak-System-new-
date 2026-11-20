# VELoop Rewards — Daily Streak System: Master Build Prompt

You are a senior full-stack engineer (MERN, security-minded) and a senior product designer. Build the **complete, production-quality VELoop Rewards Daily Streak & Rewards system**: a secure backend-driven streak engine plus a premium, pixel-faithful, fully responsive React UI.

**The fundamental rule: React controls the presentation. The backend controls the streak.**

---

## 0. How to work

- Read this whole prompt before writing code. Do not ask me questions. Where the brief leaves a choice open, decide, then record the decision in the README under "Design decisions".
- Work in the phases of Section 8. After each phase: run lint and tests, fix problems, and give me a 5-line summary of what exists and what comes next.
- JavaScript only (ES modules, `.jsx` for React). No TypeScript, no unrelated backend tech.
- Never commit secrets. Provide `.env.example` files only.
- I will place the design images (desktop + mobile) and the supplied asset folder in the repo/workspace. Use the supplied assets (coins, gift box, crown, calendar, Amazon gift card, icons, VELoop logo) from `frontend/src/assets/`. If a file is missing or named differently, map it sensibly in one central file `frontend/src/assets/index.js`; where an asset is truly missing, draw a clean inline-SVG stand-in so nothing breaks, and list the missing ones in the README.
- Treat the attached desktop and mobile design images as the visual source of truth. My written description of them below is only a guide.

---

## 1. Product summary

An authenticated user opens `/daily-streak`, sees a 7-day reward streak, and claims one reward per day.

- Claim → backend validates → polished **CPA advertisement demo state** (placeholder only, grants nothing) → backend confirms → wallet credited → transaction recorded → day becomes **Claimed** → next day is locked behind a **server-controlled countdown** → countdown ends → frontend asks backend for fresh status → next day unlocks.
- Miss the claim window → backend resets the streak → Day 1 is available again, with a friendly reset message.

Rewards (these live in the database, never hardcoded in React):

| Day | Reward | Type | Asset id | Badge |
|---|---|---|---|---|
| 1 | +5 VEs | VES | coin | — |
| 2 | +10 VEs | VES | coin | — |
| 3 | +15 VEs | VES | coin | — |
| 4 | ₹1 Amazon Gift Card | GIFT_CARD (INR) | gift-box | — |
| 5 | ₹2 Amazon Gift Card | GIFT_CARD (INR) | gift-card | Gift Card |
| 6 | +30 VEs | VES | coin | Coin |
| 7 | ₹5 Amazon Gift Card (**Ultimate Reward**) | GIFT_CARD (INR) | crown | VIP |

---

## 2. Non-negotiable rules (violating any of these = project rejected)

1. React never owns: current streak, current day, claim status, previous-day status, reward value/type/currency, countdown/unlock time, missed-day detection, reset, eligibility, user identity, wallet balance, transactions. No `setStreak(streak+1)`, no `setVEs(v => v+10)`, no `localStorage` streak, no hardcoded `const reward = 20`.
2. Backend ignores client-sent `streak`, `reward`, `amount`, `currency`, `userId`, `currentDay`. User identity comes only from the JWT.
3. A client-sent `day` is at most a *hint*; the backend derives the real day from stored state and rejects mismatches (`day: 7` while eligible for Day 2 → rejected, audited).
4. All time decisions use **server time**. Frontend countdown is cosmetic.
5. Claim is **idempotent**, **double-click safe**, and **concurrency safe** (two simultaneous requests → reward granted once).
6. Refresh, logout/login, second tab → same state, always loaded from MongoDB.
7. No production credentials anywhere. Use my own MongoDB Atlas dev DB via env vars.
8. Never leak `MongoServerError`, `CastError`, `AxiosError`, stack traces, or raw error objects to the UI.

---

## 3. Stack and repository layout

**Mandatory:** MongoDB (Mongoose), Express.js, React (Vite), Node.js, **Bootstrap**, **CSS Modules**.
**Allowed/used:** JWT, bcrypt, React Router, Axios, Lucide React (+ React Icons where needed), Framer Motion, zod (validation), helmet, cors, express-rate-limit, express-mongo-sanitize, Jest + supertest + mongodb-memory-server (replica-set mode).

```
veloop-daily-streak/
├── frontend/
│   ├── src/
│   │   ├── components/        # shared: Button, Toast, Modal, IconPill, AnimatedAsset...
│   │   ├── pages/
│   │   │   ├── Login/ Register/
│   │   │   └── DailyStreak/   # DailyStreakPage.jsx, DailyStreak.module.css + all section components
│   │   ├── services/          # api.js (axios instance), authApi.js, streakApi.js, walletApi.js
│   │   ├── hooks/             # useDailyStreak, useServerCountdown, useClaimFlow, useMediaQuery
│   │   ├── context/           # AuthContext, ToastContext
│   │   ├── assets/            # supplied assets + index.js map
│   │   ├── styles/            # tokens.css (CSS variables ONLY), global reset
│   │   └── utils/
│   ├── .env.example           # VITE_API_URL=
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/ controllers/ middleware/ models/ routes/ services/ validators/ utils/
│   │   └── app.js, server.js
│   ├── seed/                  # seeds StreakConfig, 7 StreakRewards, demo user + wallet
│   ├── tests/
│   ├── .env.example           # PORT= MONGO_URI= JWT_SECRET= CLIENT_ORIGIN= ENABLE_DEV_TOOLS=
│   └── package.json
├── docs/                      # API_DOCUMENTATION.md, DATABASE.md, SECURITY.md, TESTING.md
├── postman/                   # collection + environment
├── README.md
└── .gitignore
```

---

## 4. Backend specification

### 4.1 Models (Mongoose, with indexes)

- **User**: name, email (unique, lowercase), passwordHash (bcrypt), role, `status` (`ACTIVE|SUSPENDED` — suspended users cannot claim), createdAt.
- **Wallet**: `userId` (unique), `balances: { VES: Number, INR: Number }` (integers, never negative), updatedAt. One wallet per user, created at registration.
- **StreakConfig** (single active doc): `cycleLength` (7), `claimIntervalHours` (24 — time after a claim before the next day unlocks), `claimWindowHours` (24 — how long the next day stays claimable once unlocked before the streak is considered missed), `resetOnMiss` (true), `pendingClaimTtlSeconds` (120), `cpaDemoSeconds` (3–4), `active`. **No `86400000` constants anywhere in logic** — always derive from this config.
- **StreakReward**: `day`, `rewardType`, `currency` (`VES|INR`), `amount`, `title`, `subtitle`, `description`, `assetType` (`coin|gift-box|gift-card|crown`), `badge`, `isUltimate`, `active`, `metadata`. Unique on `(configKey, day)`.
- **StreakCycle**: `userId`, `cycleNumber`, `status` (`ACTIVE|COMPLETED|BROKEN`), `currentDay` (the next day to claim), `claimedDays`, `lastClaimAt`, `nextClaimAt` (unlock time), `expiresAt` (missed deadline), `streakCount` (consecutive days, may continue across completed cycles), `longestStreak`, `startedAt`, `endedAt`, `endReason`, `resetNoticeAcknowledged`. **Partial unique index: only one ACTIVE cycle per user.**
- **StreakClaim** (also serves as streak history): `claimId` (uuid), `userId`, `cycleId`, `day`, `rewardId`, `rewardSnapshot {type,currency,amount,title}`, `status` (`PENDING|COMPLETED|EXPIRED|REJECTED|MISSED`), `idempotencyKey`, `pendingExpiresAt`, `demoReadyAt`, `claimedAt`, `transactionId`, `createdAt`. **Unique index on `(userId, cycleId, day)`.** An expired `PENDING` claim is reused/refreshed in place, never duplicated.
- **WalletTransaction**: `transactionId` (uuid), `userId`, `currency`, `type` (`CREDIT`), `amount`, `source` (`DAILY_STREAK`), `streakDay`, `referenceId` (`STREAK-XXXXXXXX`, unique), `claimId` (unique), `balanceBefore`, `balanceAfter`, `status` (`COMPLETED` for VES; `PENDING_FULFILLMENT` for gift cards, since VELoop fulfils them later), `createdAt`.
- **AuditLog**: `userId`, `event` (`STREAK_CLAIM_REQUEST|STREAK_CLAIM_SUCCESS|STREAK_CLAIM_REJECTED|STREAK_RESET|DUPLICATE_CLAIM|INVALID_CLAIM|DEV_TIME_TRAVEL`), `requestId`, `ip`, `userAgent`, `details`, `createdAt`.

The chain must be traceable in MongoDB: `StreakClaim → StreakReward → WalletTransaction → Wallet balance`.

### 4.2 Services (no business logic inside routes/controllers)

```
services/
├── streak.service.js       getStreakStatus(), calculateCurrentDay(), checkEligibility(), checkMissedDay(), initiateClaim(), confirmClaim(), resetStreak()
├── streak.rules.js         PURE functions: computeStreakState(cycle, config, now) — fully unit-testable
├── reward.service.js       reads StreakReward config
├── wallet.service.js       atomic credit
├── transaction.service.js  creates ledger entries
├── audit.service.js
└── clock.js                single source of "now" (server time)
```

### 4.3 Time and streak rules (server authority)

- `nextClaimAt = lastClaimAt + claimIntervalHours`; `expiresAt = nextClaimAt + claimWindowHours` (both from `StreakConfig`).
- State for the active cycle at `now`:
  - **No claim yet** → Day 1 `AVAILABLE`.
  - `now < nextClaimAt` → **WAITING**: target day is `TODAY` (highlighted, countdown, not claimable).
  - `nextClaimAt ≤ now ≤ expiresAt` → **READY**: target day is `AVAILABLE` (claimable).
  - `now > expiresAt` → **MISSED**: lazily (on any GET/claim) mark the cycle `BROKEN`, write `STREAK_RESET` audit, mark unclaimed days `MISSED` in history, create a new cycle at Day 1 (immediately `AVAILABLE`), and return a `resetNotice`.
- Completing Day 7 → cycle `COMPLETED`; next cycle starts at Day 1 and unlocks at `lastClaimAt + claimIntervalHours` (documented choice; keep `streakCount` going).
- Closing the browser never resets anything; only server rules do.
- Per-day status values returned to the client: `CLAIMED | AVAILABLE | TODAY | LOCKED | MISSED`. Document the mapping in the README.

### 4.4 Claim flow (two-phase so the CPA demo cannot grant anything)

1. **`POST /api/daily-streak/claim`** (initiate). Validate in this order and reject with a stable error `code`: authenticated → account ACTIVE → active cycle exists (lazy reset first) → READY phase → previous day claimed → requested `day` (if sent) equals the server-derived current day → not already claimed. On success create/reuse a `PENDING` StreakClaim (`demoReadyAt = now + cpaDemoSeconds`, `pendingExpiresAt = now + pendingClaimTtlSeconds`) and return `{ claimId, demoDurationMs, serverTime }`. Calling it twice returns the same pending claim (idempotent). Nothing is granted here.
2. Frontend shows the **CPA demo state**.
3. **`POST /api/daily-streak/claim/confirm`** with `{ claimId }` and an `Idempotency-Key` header. The backend loads the claim by `claimId` **and** authenticated `userId` (cross-user attack → 404/403), checks it is `PENDING`, not expired, and that `now ≥ demoReadyAt` (otherwise `CLAIM_NOT_READY` with `retryAfterMs`). Then, **inside a MongoDB transaction**:
   - conditional `findOneAndUpdate` on the StreakCycle with filter `{_id, status:'ACTIVE', currentDay: claim.day, nextClaimAt: {$lte: now}, expiresAt: {$gte: now}}` — advance `currentDay`, `claimedDays`, `streakCount`, `lastClaimAt`, `nextClaimAt`, `expiresAt` (or complete the cycle on the last day);
   - conditional update `StreakClaim PENDING → COMPLETED`;
   - atomic `$inc` on the Wallet (returning before/after balance);
   - insert WalletTransaction with `balanceBefore/After`, `referenceId`, `source: DAILY_STREAK`, `streakDay`;
   - write audit `STREAK_CLAIM_SUCCESS`.
   Reward **amount/currency/type always come from StreakReward** (snapshotted at initiate time), never from the request.
4. Replaying a confirm for an already-completed claim returns the original success payload with `idempotentReplay: true` and **no second credit**. Unique-index violations are mapped to `ALREADY_CLAIMED`.
5. Every rejected attempt writes an audit event (`STREAK_CLAIM_REJECTED`, `DUPLICATE_CLAIM`, `INVALID_CLAIM`).

### 4.5 API

All routes under `/api`, all `daily-streak` and `wallet` routes protected by JWT middleware.

| Method | Route | Purpose |
|---|---|---|
| POST | `/auth/register`, `/auth/login` | JWT auth (bcrypt, validation, rate limited) |
| GET | `/auth/me` | current user |
| GET | `/daily-streak` | full page state (below) |
| GET | `/daily-streak/status` | lightweight: `serverTime`, `phase`, `currentDay`, `nextClaimAt`, `canClaim`, wallet |
| POST | `/daily-streak/claim` | initiate claim |
| POST | `/daily-streak/claim/confirm` | confirm claim |
| POST | `/daily-streak/reset-notice/ack` | dismiss the reset banner (persisted) |
| GET | `/daily-streak/history` | paginated claim history (powers the "Streak Calendar") |
| GET | `/wallet` | balances + recent transactions |
| GET | `/health` | for uptime/keep-warm |
| POST | `/dev/time-travel`, `/dev/reset-user` | **only when `ENABLE_DEV_TOOLS=true` and `NODE_ENV !== 'production'`**; rewinds the *authenticated user's* stored timestamps by N hours (equivalent to advancing time) so evaluators can test unlock and missed-day without waiting; every use is audited |

`GET /daily-streak` response shape (adapt as needed, but keep these ideas):

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
    { "day": 2, "status": "TODAY", "nextClaimAt": "...", "assetType": "coin", "reward": { "...": "..." } }
  ],
  "wallet": { "VES": 120, "INR": 0 }
}
```

Errors always return `{ success:false, error:{ code, message } }` with codes such as `UNAUTHENTICATED, VALIDATION_ERROR, ALREADY_CLAIMED, STILL_LOCKED, DAY_MISMATCH, STREAK_RESET, CLAIM_NOT_READY, CLAIM_EXPIRED, ACCOUNT_NOT_ELIGIBLE, RATE_LIMITED, SERVER_ERROR`. A central error handler converts every Mongo/Mongoose/JWT error into one of these safe codes.

### 4.6 Security checklist (implement all, document in `docs/SECURITY.md`)

helmet, strict CORS allow-list from env, JWT verified on every protected route (id from token only), bcrypt, zod schemas that **strip unknown fields** (so `reward`, `amount`, `streak`, `userId` are never even read), `express-mongo-sanitize`, global rate limit + a stricter limiter on claim/confirm/login, request-id on every request, audit logging, body size limit, no stack traces in responses, graceful handling of invalid ObjectIds.

### 4.7 Seed

`npm run seed` is idempotent: creates StreakConfig, the 7 StreakRewards from the table in Section 1, and a demo user `demo@veloop.test / Demo@1234` with a wallet of **120 VEs** (matches the header gem balance in the design).

### 4.8 Tests (Jest + supertest + mongodb-memory-server as a replica set)

Automated tests for: normal claim (Day 1 → Day 2); already claimed; locked day; timer (cannot claim before `nextClaimAt` even if the client "changes its clock"); missed day → reset to Day 1 (use the dev time-travel service/injected clock); duplicate confirm → one credit; **concurrent confirms with `Promise.all` → exactly one credit**; fake reward amount ignored; fake day (7 while on Day 2) rejected; fake streak ignored; fake `userId` ignored; cross-user `claimId` rejected; unauthenticated → 401; refresh/relogin state persistence; full 7-day cycle completion → new cycle. Put manual steps in `docs/TESTING.md` and a Postman collection in `/postman` (login, get streak, get status, claim Day 1, confirm, get updated streak, claim Day 2, history, plus all negative tests).

---

## 5. Frontend specification

### 5.1 Setup

Vite + React, React Router (`/login`, `/register`, `/daily-streak`, `/daily-streak/calendar`; `/` redirects), Bootstrap (grid, utilities, reset only — it must **not** look like a Bootstrap dashboard: restyle everything through CSS Modules), CSS Modules per component (`StreakHeader.module.css`, etc.), one small `tokens.css` containing CSS variables only, Lucide React icons (consistent 1.75–2px stroke, sized from tokens), Framer Motion for motion, Axios in a single centralized `services/` layer. **No API calls inside components** — components use hooks, hooks use services.

### 5.2 Design system (derive exact values from the attached images; these are my defaults)

- **Mood:** dark + purple/violet + gold highlights + green success. Premium, trustworthy, rewarding. Avoid neon overload, random gradients, excessive glow, crypto/casino styling, children's-game styling.
- **Tokens:** background `#07050F → #0D0720` with soft radial violet glows; surface `#120B24`, raised `#1A1033`; border `rgba(139,92,246,.28)`; primary violet `#7C3AED / #8B5CF6`, soft violet text `#A78BFA`; gold `#FFC83D → #F5A300` gradient; success green `#22C55E`; text `#F5F3FF`, muted `#A79FC2`. Radii 14/18/24px. Glow levels: `--glow-sm/md/lg` (kept subtle). Spacing scale 4/8/12/16/24/32/48.
- **Typography:** Sora (headings/numbers) + Inter (body) via Google Fonts with system fallbacks. Use `clamp()` for fluid sizes; the big reward numerals (`+10`, `₹5`) are the hero of each card.
- **Details:** 1px gradient borders on cards, inner highlights, soft shadows, subtle noise/aurora in the page background, consistent icon sizes, pill buttons for badges, gold gradient "Claim Now" button with chevron.

### 5.3 Layout (build three real layouts, not one shrunk layout)

**Mobile (≤575px) — match the mobile image:**
1. Sticky header: circular back button · "Daily Streak 🔥" · gem-balance pill (violet gem + balance from backend).
2. Hero banner: "Login Daily & Earn **Bigger Rewards!**" (gold emphasis), subtext "Maintain your streak and unlock *exciting rewards* every day.", calendar+coins art on the left, gift box on the right.
3. Main panel: flame "N Day Streak" pill + "Streak Calendar ›" link; three stat tiles (Total Rewards · Checked In · Next Reward with gold `+10 VEs`); **Ultimate Reward** banner (crown on a glowing purple podium, big `₹5`, Amazon Gift Card chip, lock + "Unlock on **Day 7**").
4. Divider ribbon "✦ Come back tomorrow for more rewards! ✦".
5. Reward grid: row 1 = Days 1–4 (four compact cards), row 2 = Days 5–7 (three wider cards, Day 7 with gold border/glow and VIP badge). Use a 12-column grid (3+3+3+3 / 4+4+4). Below 360px fall back to 2 columns with Day 7 full width. Touch targets ≥44px.
6. "Why Maintain Your Streak?" four benefit columns (Stay Active, Bigger Streak, Exclusive Rewards, Don't Miss Out).
7. Trust strip: shield "VR" mark, "Official rewards only on **VeloopRewards.in** · Stay active, stay rewarded!" with chevron.

**Tablet (768 / 820 / 834 / 1024px):** an intentionally designed in-between layout: centered container (~720–960px), hero banner with larger art, stats + Ultimate Reward side by side, reward grid 4 + 3 with roomier cards (or a 7-step progress rail above the cards), benefits in one row of four. It must not look like a stretched mobile or a squeezed desktop.

**Desktop (≥1100px) — follow the attached desktop image closely:** wide, centered container (max ≈1320px) with the streak badge ("N Day Streak · Keep it going!"), Ultimate Reward panel (₹5, Amazon Gift Card, Unlock on Day 7), seven reward cards in a single row with the Day 7 VIP crown card emphasized in gold, the "Don't Miss Out — come back every day & unlock all rewards!" panel, the benefits section and the trust footer. On ≥1920px keep the content centered with a capped width and let the background glow extend.

Test at 320, 360, 375, 390, 414, 480, 768, 820, 834, 1024, 1280, 1366, 1440, 1920+. **No horizontal overflow at any width.**

### 5.4 Components (inside `pages/DailyStreak/`)

`DailyStreakPage`, `StreakHeader`, `HeroBanner`, `StreakStats`, `UltimateReward`, `ProgressRail` (my addition: thin 7-node progress rail with the current node pulsing gently), `RewardGrid`, `RewardCard`, `ClaimModal`, `CpaDemo`, `StreakLoader`, `StreakSkeleton`, `ResetBanner`, `ErrorState`, `WhyStreak`, `TrustFooter`, plus the Streak Calendar (history) page. The page composes components only; all logic lives in hooks.

### 5.5 States and copy

- **RewardCard states (from backend `status`):** `CLAIMED` (green border, ✓ badge, green "Claimed" pill, not clickable) · `AVAILABLE` ("Today" gold tab + gold "Claim Now ›" button) · `TODAY` (gold outline, **live countdown** `HH:MM:SS` instead of a button, "Next reward") · `LOCKED` (lock icon, muted "Locked") · `MISSED` (muted red-tinted, "Missed", shown in calendar/history and in the reset moment). Card shows day pill, optional badge (Gift Card / Coin / VIP from backend), reward artwork from `assetType`, "Daily Reward" (Day 7: "Ultimate Reward"), big value, sub-label. Rewards are rendered from API data: 7 cards today, but the grid must tolerate a different count.
- **Header streak** reads the backend `currentStreak` ("1 Day Streak", "7 Day Streak"). 0/reset state shows "Start your streak".
- **Initial load:** VELoop-branded loader (logo/reward icon + "Loading your streak…") → **themed skeletons** for header, hero, stats, ultimate reward, cards and info section (dark violet shimmer — never plain gray rectangles) → content. Never a blank page.
- **Claim flow UI:** click → button disables → `POST /claim` → open `ClaimModal` with **`CpaDemo`** ("Preparing your reward…", "Advertisement / Reward Verification", "Please wait…", elegant progress ring/bar timed to `demoDurationMs`) → `POST /claim/confirm` → success reveal (soft gold shimmer, reward title, "Added to your wallet") → modal closes → `GET /daily-streak` → whole UI refreshes from the response (cards, stats, streak, header balance, countdown). Do not patch React state by hand. Add `// TODO(VELoop): replace CpaDemo with the real CPA/ad integration` and keep the component interface (`durationMs`, `onVerified`) stable so VELoop can swap it. Do **not** integrate any real ad network, SDK, credentials or tracking.
- **Error copy** (map from backend `code`, never show raw errors): Already claimed → "This reward has already been claimed." · Locked → "Your next reward is not available yet." · Reset → "Your streak has been reset. Start again from Day 1." · Auth → "Please log in to continue." · Server → "Unable to process your reward. Please try again." Errors surface via themed toasts and a full-page `ErrorState` with Retry when the initial load fails.
- **Reset state:** `ResetBanner` explains what happened (previous streak, restart at Day 1) with a dismiss that calls the ack endpoint.

### 5.6 Data layer, countdown and sync

- `useDailyStreak()` fetches `GET /daily-streak`, exposes `{data, status, error, refresh}`.
- **`useServerCountdown(serverTime, nextClaimAt)`**: on each fetch, store `offset = serverTime - Date.now()` **and** `perfAtFetch = performance.now()`. Remaining time = `nextClaimAt - (serverTime + (performance.now() - perfAtFetch))`. This is monotonic and immune to device-clock changes. When it reaches ~0, call `GET /daily-streak/status` (with small retry/backoff if the server says not yet) and only then flip the UI. Never assume `timer = 0 → claim allowed`.
- Refetch on window focus/visibility change, and use `BroadcastChannel` so a claim in Tab A refreshes Tab B immediately. If Tab B still tries to claim, the backend rejects with `ALREADY_CLAIMED` and the UI refreshes with a friendly message.
- Axios instance: base URL `VITE_API_URL`, Bearer token interceptor, response interceptor that normalizes errors and redirects to `/login` on 401. Provide demo-credentials hint on the login page.
- Header gem balance comes from the backend wallet in the same response/refresh.

### 5.7 Motion (premium, restrained)

Soft floating on the crown, gift and hero art; slow shine sweep on the Day 7 card border; gentle glow pulse on the active card; smooth state transitions (Framer Motion `layout`/`AnimatePresence`); a tasteful count-up on balance change; staggered card entrance. **Respect `prefers-reduced-motion`** (disable all non-essential motion). Avoid shaking, flashing, particle explosions and casino effects. For static PNG assets, build an `AnimatedAsset` component that applies CSS/Framer float/shine/rotate and also accepts an optional pre-animated `.webp/.webm` (I may create these with Google Flow) with the static image as fallback. Animate only individual assets, never the whole page.

### 5.8 Quality bar

Pixel-level attention to the design: spacing, typography hierarchy, borders, glows, icon sizes, button shapes. Semantic HTML, ARIA (live region for countdown/claim results, `aria-disabled` on locked buttons, labelled modal with focus trap, ESC disabled while a claim is processing), visible focus states, WCAG AA contrast on text, no layout shift (explicit image sizes), lazy-load below-the-fold images, WebP where possible, code-split routes. Login/Register pages must match the same dark-violet-gold theme so the whole journey feels like one product.

---

## 6. Documentation deliverables

- **README.md:** overview, MERN architecture diagram, installation, env setup, database schema, streak logic, claim logic, timer architecture, reset logic, reward system, wallet integration, security, API endpoints, testing, deployment (Vercel/Netlify + Render/Railway + MongoDB Atlas), known limitations, "Design decisions" (two-phase claim, status mapping, interval/window config, gift-card fulfilment status, dev time-travel).
- **docs/API_DOCUMENTATION.md, DATABASE.md, SECURITY.md, TESTING.md**, `.env.example` in both apps, Postman collection + environment.
- `TESTING.md` must document: normal claim, already claimed, locked reward, timer, missed day, reset, duplicate request, concurrent request, fake reward, fake day, fake user, changed device time, unauthorized request, refresh, logout/login, multiple tabs — and exactly how the missed-day test was performed.

---

## 7. Things to avoid

Hardcoded streak/reward values in React · browser-time-only timers · trusting the client for day/reward/user · one giant global CSS file · generic Bootstrap look · replacing supplied assets with stock images · using a screenshot as the UI · exposing raw errors · committing secrets · real ad/CPA integration.

---

## 8. Build phases (do them in order; report after each)

1. **Scaffold:** repo, both apps, linting, env examples, MongoDB connection, health route.
2. **Backend core:** models + indexes, seed, auth, clock + pure rules engine, streak/reward/wallet/transaction/audit services, endpoints, error handler, security middleware, dev tools.
3. **Backend proof:** automated tests (including concurrency, idempotency, fake-payload, missed-day), Postman collection, API/DB/Security/Testing docs.
4. **Frontend foundation:** tokens, fonts, router, auth pages, API layer, hooks (`useDailyStreak`, `useServerCountdown`, `useClaimFlow`), toast system, asset map, `AnimatedAsset`.
5. **Daily Streak UI:** loader, skeleton, header, hero, stats, ultimate reward, reward grid/cards, all card states, claim modal + CPA demo, reset banner, error state, why-streak, trust footer, calendar/history page.
6. **Responsive + polish:** mobile (match image), tablet (custom), desktop (match image), breakpoint sweep from 320 to 1920+, motion, accessibility, performance.
7. **Final audit:** run the checklist below, fix everything that fails, finish README, and give me a deployment guide.

---

## 9. Definition of done (self-audit before you finish)

Answer each honestly and prove it with a test or manual step:

- Can I change my streak/day/claim status with DevTools or React DevTools and gain anything? **Must be NO.**
- Can I send a fake reward/amount/currency/streak/userId? **NO — ignored/rejected.**
- Can I change my device clock and claim early? **NO.**
- Can I request Day 7 while eligible for Day 2? **NO — rejected and audited.**
- Can I claim the same day twice, or via two simultaneous requests, or from two tabs? **NO — exactly one credit.**
- Does a genuinely missed streak reset to Day 1 and show the reset message? **YES.**
- Does a refresh / logout-login show identical state from MongoDB? **YES.**
- Can I trace StreakClaim → Reward → WalletTransaction → Wallet balance in MongoDB? **YES.**
- Does the timer come from backend `serverTime`/`nextClaimAt` and re-verify with the backend at zero? **YES.**
- Do loader, skeleton, error, locked, claimed, countdown, reset and CPA-demo states all exist? **YES.**
- Does it look extremely close to the supplied mobile and desktop designs, with a proper tablet layout, with zero horizontal overflow from 320px up? **YES.**
- Are all items in the final submission checklist present (GitHub repo, live frontend/backend, Atlas dev DB, README, API/DB/Security/Testing docs, Postman collection, `.env.example`, demo credentials, demo-video script)? **YES.**

Now start with Phase 1.