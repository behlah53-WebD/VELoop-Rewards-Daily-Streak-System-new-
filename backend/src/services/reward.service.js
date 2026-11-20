import { StreakReward } from '../models/StreakReward.js';
import { StreakConfig } from '../models/StreakConfig.js';

/**
 * VELoop Rewards — Reward Service
 * Central data access layer for StreakConfig and StreakRewards catalog.
 */

export async function getActiveConfig(session = null) {
  let query = StreakConfig.findOne({ active: true });
  if (session) query = query.session(session);
  let config = await query;

  if (!config) {
    // Fallback default config if not yet seeded
    config = {
      cycleLength: 7,
      claimIntervalHours: 24,
      claimWindowHours: 24,
      resetOnMiss: true,
      pendingClaimTtlSeconds: 120,
      cpaDemoSeconds: 3,
      active: true,
    };
  }

  return config;
}

export async function getRewardsCatalog(configKey = 'default', session = null) {
  let query = StreakReward.find({ configKey, active: true }).sort({ day: 1 });
  if (session) query = query.session(session);
  return await query;
}

export async function getRewardForDay(day, configKey = 'default', session = null) {
  let query = StreakReward.findOne({ day, configKey, active: true });
  if (session) query = query.session(session);
  return await query;
}

export default {
  getActiveConfig,
  getRewardsCatalog,
  getRewardForDay,
};
