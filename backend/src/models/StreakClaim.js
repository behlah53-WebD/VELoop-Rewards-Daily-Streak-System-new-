import mongoose from 'mongoose';

const streakClaimSchema = new mongoose.Schema(
  {
    claimId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    cycleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StreakCycle',
      required: true,
      index: true,
    },
    day: {
      type: Number,
      required: true,
      min: 1,
    },
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StreakReward',
      required: true,
    },
    rewardSnapshot: {
      type: {
        type: String,
        required: true,
      },
      currency: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'EXPIRED', 'REJECTED', 'MISSED'],
      default: 'PENDING',
      index: true,
    },
    idempotencyKey: {
      type: String,
      default: null,
      index: true,
    },
    pendingExpiresAt: {
      type: Date,
      required: true,
    },
    demoReadyAt: {
      type: Date,
      required: true,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
    transactionId: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique index: Exactly one claim record per day in any given cycle for a user
streakClaimSchema.index({ userId: 1, cycleId: 1, day: 1 }, { unique: true });

export const StreakClaim = mongoose.model('StreakClaim', streakClaimSchema);
export default StreakClaim;
