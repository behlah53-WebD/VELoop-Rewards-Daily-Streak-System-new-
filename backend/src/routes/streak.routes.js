import { Router } from 'express';
import {
  getStreak,
  getStatus,
  claim,
  confirm,
  acknowledgeReset,
  getHistory,
} from '../controllers/streak.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import {
  initiateClaimSchema,
  confirmClaimSchema,
  historyQuerySchema,
} from '../validators/streak.validator.js';
import { strictLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/daily-streak', authenticateToken, getStreak);
router.get('/daily-streak/status', authenticateToken, getStatus);
router.post('/daily-streak/claim', authenticateToken, strictLimiter, validateBody(initiateClaimSchema), claim);
router.post('/daily-streak/claim/confirm', authenticateToken, strictLimiter, validateBody(confirmClaimSchema), confirm);
router.post('/daily-streak/reset-notice/ack', authenticateToken, acknowledgeReset);
router.get('/daily-streak/history', authenticateToken, validateQuery(historyQuerySchema), getHistory);

export default router;
