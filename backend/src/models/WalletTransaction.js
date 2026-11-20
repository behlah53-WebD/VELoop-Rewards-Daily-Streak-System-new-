import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema(
  {
    transactionId: {
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
    currency: {
      type: String,
      enum: ['VES', 'INR'],
      required: true,
    },
    type: {
      type: String,
      enum: ['CREDIT'],
      default: 'CREDIT',
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    source: {
      type: String,
      enum: ['DAILY_STREAK', 'ADMIN', 'BONUS'],
      default: 'DAILY_STREAK',
    },
    streakDay: {
      type: Number,
      required: true,
    },
    referenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    claimId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['COMPLETED', 'PENDING_FULFILLMENT', 'FAILED'],
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const WalletTransaction = mongoose.model('WalletTransaction', walletTransactionSchema);
export default WalletTransaction;
