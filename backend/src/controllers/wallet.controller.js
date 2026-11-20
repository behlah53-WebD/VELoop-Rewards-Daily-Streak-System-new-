import walletService from '../services/wallet.service.js';
import transactionService from '../services/transaction.service.js';

export async function getWallet(req, res, next) {
  try {
    const wallet = await walletService.getOrCreateWallet(req.user._id);
    const transactions = await transactionService.getTransactionsByUserId(req.user._id, 20);

    res.status(200).json({
      success: true,
      wallet: wallet.balances,
      transactions,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getWallet,
};
