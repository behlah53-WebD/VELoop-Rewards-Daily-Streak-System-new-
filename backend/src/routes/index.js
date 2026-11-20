import { Router } from 'express';
import authRoutes from './auth.routes.js';
import streakRoutes from './streak.routes.js';
import walletRoutes from './wallet.routes.js';
import devRoutes from './dev.routes.js';

const router = Router();

// Base API info
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'VELoop Rewards API',
    version: '1.0.0',
    serverTime: new Date().toISOString(),
  });
});

router.use(authRoutes);
router.use(streakRoutes);
router.use(walletRoutes);
router.use(devRoutes);

export default router;
