import { Router } from 'express';
import { timeTravel, resetUser } from '../controllers/dev.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { timeTravelSchema } from '../validators/dev.validator.js';

const router = Router();

router.post('/dev/time-travel', authenticateToken, validateBody(timeTravelSchema), timeTravel);
router.post('/dev/reset-user', authenticateToken, resetUser);

export default router;
