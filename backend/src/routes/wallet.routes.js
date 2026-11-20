import { Router } from 'express';
import { getWallet } from '../controllers/wallet.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/wallet', authenticateToken, getWallet);

export default router;
