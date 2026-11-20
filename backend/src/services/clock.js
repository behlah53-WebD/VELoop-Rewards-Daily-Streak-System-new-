/**
 * VELoop Rewards — Clock Service
 * Single source of truth for server time.
 * Provides deterministic time reference and supports time offset in test/dev modes.
 */

let timeOffsetMs = 0;

export const clock = {
  /**
   * Returns current server Date object (accounting for any dev/test simulated offset)
   */
  nowDate() {
    return new Date(Date.now() + timeOffsetMs);
  },

  /**
   * Returns current server timestamp in milliseconds
   */
  nowMs() {
    return Date.now() + timeOffsetMs;
  },

  /**
   * Returns current server ISO string
   */
  toISOString() {
    return this.nowDate().toISOString();
  },

  /**
   * In-memory time offset manipulator (Used strictly in automated tests or dev environment)
   */
  advanceTime(ms) {
    timeOffsetMs += ms;
  },

  resetOffset() {
    timeOffsetMs = 0;
  },

  getOffset() {
    return timeOffsetMs;
  },
};

export default clock;
