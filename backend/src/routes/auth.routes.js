import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { strictLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/auth/register', strictLimiter, validateBody(registerSchema), register);
router.post('/auth/login', strictLimiter, validateBody(loginSchema), login);
router.get('/auth/me', authenticateToken, getMe);

export default router;
