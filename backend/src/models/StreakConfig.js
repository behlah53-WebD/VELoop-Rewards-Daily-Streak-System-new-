import mongoose from 'mongoose';

const streakConfigSchema = new mongoose.Schema(
  {
    configKey: {
      type: String,
      default: 'default',
      unique: true,
    },
    cycleLength: {
      type: Number,
      default: 7,
      min: 1,
    },
    claimIntervalHours: {
      type: Number,
      default: 24,
      min: 0,
    },
    claimWindowHours: {
      type: Number,
      default: 24,
      min: 1,
    },
    resetOnMiss: {
      type: Boolean,
      default: true,
    },
    pendingClaimTtlSeconds: {
      type: Number,
      default: 120,
      min: 30,
    },
    cpaDemoSeconds: {
      type: Number,
      default: 3,
      min: 1,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const StreakConfig = mongoose.model('StreakConfig', streakConfigSchema);
export default StreakConfig;
