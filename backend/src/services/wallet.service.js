import { Wallet } from '../models/Wallet.js';

/**
 * VELoop Rewards — Wallet Service
 * Handles atomic credits to user wallets.
 */

export async function getOrCreateWallet(userId, session = null) {
  let query = Wallet.findOne({ userId });
  if (session) query = query.session(session);
  let wallet = await query;

  if (!wallet) {
    try {
      wallet = new Wallet({
        userId,
        balances: { VES: 0, INR: 0 },
      });
      if (session) {
        await wallet.save({ session });
      } else {
        await wallet.save();
      }
    } catch (err) {
      if (err.code === 11000) {
        let retryQuery = Wallet.findOne({ userId });
        if (session) retryQuery = retryQuery.session(session);
        wallet = await retryQuery;
        if (wallet) return wallet;
      }
      throw err;
    }
  }

  return wallet;
}

/**
 * Performs an atomic credit to the specified currency balance.
 * Returns { balanceBefore, balanceAfter }
 */
export async function creditBalance({ userId, currency, amount, session = null }) {
  if (amount <= 0) {
    throw new Error('Credit amount must be greater than zero');
  }

  const incField = `balances.${currency}`;

  // Find existing wallet to capture balanceBefore
  let findQuery = Wallet.findOne({ userId });
  if (session) findQuery = findQuery.session(session);
  let wallet = await findQuery;

  if (!wallet) {
    wallet = await getOrCreateWallet(userId, session);
  }

  const balanceBefore = wallet.balances[currency] || 0;

  // Atomic update
  const options = { new: true, runValidators: true };
  if (session) options.session = session;

  const updatedWallet = await Wallet.findOneAndUpdate(
    { userId },
    { $inc: { [incField]: amount } },
    options
  );

  const balanceAfter = updatedWallet.balances[currency];

  return {
    balanceBefore,
    balanceAfter,
    wallet: updatedWallet,
  };
}

export default {
  getOrCreateWallet,
  creditBalance,
};
