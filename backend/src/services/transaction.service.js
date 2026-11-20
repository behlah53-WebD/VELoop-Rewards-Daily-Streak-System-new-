import { v4 as uuidv4 } from 'uuid';
import { WalletTransaction } from '../models/WalletTransaction.js';

/**
 * VELoop Rewards — Transaction Service
 * Manages immutable ledger records for all reward credits.
 */

export async function recordStreakTransaction({
  userId,
  currency,
  amount,
  streakDay,
  claimId,
  balanceBefore,
  balanceAfter,
  status = 'COMPLETED',
  session = null,
}) {
  const transactionId = uuidv4();
  // Unique human-readable reference ID format: STREAK-XXXXXXXX
  const randomSuffix = Math.random().toString(36).substring(2, 10).toUpperCase();
  const referenceId = `STREAK-${randomSuffix}`;

  const transaction = new WalletTransaction({
    transactionId,
    userId,
    currency,
    type: 'CREDIT',
    amount,
    source: 'DAILY_STREAK',
    streakDay,
    referenceId,
    claimId,
    balanceBefore,
    balanceAfter,
    status,
  });

  if (session) {
    await transaction.save({ session });
  } else {
    await transaction.save();
  }

  return transaction;
}

export async function getTransactionsByUserId(userId, limit = 10) {
  return await WalletTransaction.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
}

export default {
  recordStreakTransaction,
  getTransactionsByUserId,
};
