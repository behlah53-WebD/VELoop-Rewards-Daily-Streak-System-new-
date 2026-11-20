# VELoop Rewards — Demo Video Script & Walkthrough

This script provides an exact 3-minute screen recording walkthrough to showcase all required features of the VELoop Daily Streak & Rewards Engine.

---

## 🎬 3-Minute Video Script

### Segment 1: Introduction & Authentication (0:00 - 0:40)
1. **Screen**: Open browser at `http://localhost:5173/login`.
2. **Action**:
   - Highlight the dark-violet-gold design matching the brand aesthetic.
   - Point out the "Evaluation Account" hint card displaying `demo@veloop.test / Demo@1234`.
   - Click "Quick Fill" button and hit "Sign In".
   - Notice the success toast: *"Welcome back to VELoop Rewards!"*.
   - Route redirects to `/daily-streak`.

### Segment 2: Layout & Initial Streak Exploration (0:40 - 1:15)
1. **Screen**: `/daily-streak` dashboard.
2. **Action**:
   - Highlight the sticky header showing circular back button, "Daily Streak 🔥", and gem pill with **120 VEs**.
   - Show the Hero Banner with calendar and gift box artwork.
   - Show the Stats row: `1 Day Streak`, `Total Rewards: 7`, `Checked In: 0 / 7`, and `Next Reward: +5 VEs`.
   - Show the Ultimate Reward banner with the glowing crown podium and ₹5 Amazon Gift Card.
   - Point out the 7-node Progress Rail and the 7-day reward grid.
   - Note that Day 1 is in `AVAILABLE` state with the golden "Claim Now ›" button, while Days 2–7 are locked.

### Segment 3: Two-Phase Claim Flow & CPA Verification (1:15 - 1:55)
1. **Action**:
   - Click "Claim Now" on Day 1 card.
   - Modal opens immediately with `CpaDemo`:
     - Displays *"Preparing your reward…"*, *"Reward Verification"*, and circular progress ring filling over 3 seconds.
     - Mention: *Zero rewards are granted during this phase; confirmation requires backend validation.*
   - At 3 seconds, confirmation executes:
     - Soft gold shimmer, confetti burst, and message: *"Reward Unlocked! +5 VEs added to your VELoop Wallet"*.
   - Click "Awesome!".
   - Modal closes and page updates from backend:
     - Header balance increases to **125 VEs**.
     - Day 1 transitions to `CLAIMED` (green border, checkmark).
     - Day 2 transitions to `TODAY` with **live monotonic countdown timer** (`23:59:xx`).

### Segment 4: Server Clock Authority & Dev Time-Travel (1:55 - 2:30)
1. **Action**:
   - Open browser DevTools or show Postman.
   - Demonstrate that changing device clock has zero impact on server state.
   - Execute Dev Time-Travel via Postman or terminal:
     `POST /api/dev/time-travel` with `{ "advanceHours": 24.5 }`.
   - Click "Sync Server" on the UI (or refresh tab):
     - Server confirms cooldown ended.
     - Day 2 card immediately unlocks to `AVAILABLE` with "Claim Now ›".

### Segment 5: Streak Calendar & Missed Day Reset (2:30 - 3:00)
1. **Action**:
   - Click "Streak Calendar ›" link to navigate to `/daily-streak/calendar`.
   - Show the recorded claim with timestamp, reward title (`+5 VEs`), transaction ID, and green `COMPLETED` badge.
   - Navigate back to `/daily-streak`.
   - Simulate a missed claim window:
     `POST /api/dev/time-travel` with `{ "advanceHours": 55 }`.
   - Refresh page:
     - Red-tinted `ResetBanner` appears: *"Streak Reset: Your claim window expired. Start again fresh from Day 1!"*.
     - Day 1 unlocks again.
     - Click "Got it" to dismiss the banner (persisted to backend via `/reset-notice/ack`).
2. **Closing**:
   - Emphasize zero-trust backend architecture, concurrency-safe transactions, and pixel-faithful responsive styling.
