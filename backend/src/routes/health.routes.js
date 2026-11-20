import { Router } from 'express';
import { getDatabaseState } from '../config/db.js';

const router = Router();

/**
 * GET /health
 * Keep-warm & uptime monitoring endpoint
 */
router.get('/health', (req, res) => {
  const dbState = getDatabaseState();
  res.status(200).json({
    success: true,
    status: 'UP',
    serverTime: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: dbState,
  });
});

export default router;
