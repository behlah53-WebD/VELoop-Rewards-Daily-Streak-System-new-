import mongoose from 'mongoose';

const streakRewardSchema = new mongoose.Schema(
  {
    configKey: {
      type: String,
      default: 'default',
    },
    day: {
      type: Number,
      required: true,
      min: 1,
    },
    rewardType: {
      type: String,
      enum: ['VES', 'GIFT_CARD'],
      required: true,
    },
    currency: {
      type: String,
      enum: ['VES', 'INR'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    assetType: {
      type: String,
      enum: ['coin', 'gift-box', 'gift-card', 'crown'],
      default: 'coin',
    },
    badge: {
      type: String,
      default: null,
    },
    isUltimate: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

streakRewardSchema.index({ configKey: 1, day: 1, active: 1 }, { unique: true });

export const StreakReward = mongoose.model('StreakReward', streakRewardSchema);
export default StreakReward;
