import mongoose from 'mongoose';

const streakCycleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cycleNumber: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'BROKEN'],
      default: 'ACTIVE',
      index: true,
    },
    currentDay: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    claimedDays: {
      type: [Number],
      default: [],
    },
    lastClaimAt: {
      type: Date,
      default: null,
    },
    nextClaimAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    streakCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    endReason: {
      type: String,
      enum: ['COMPLETED', 'MISSED', 'ADMIN', null],
      default: null,
    },
    resetNoticeAcknowledged: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Partial unique index: Only one ACTIVE cycle per user
streakCycleSchema.index(
  { userId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'ACTIVE' },
  }
);

export const StreakCycle = mongoose.model('StreakCycle', streakCycleSchema);
export default StreakCycle;
