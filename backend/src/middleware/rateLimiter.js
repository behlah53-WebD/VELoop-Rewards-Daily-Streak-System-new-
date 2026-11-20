import rateLimit from 'express-rate-limit';

/**
 * Global rate limiter (Allows 300 requests per 15 minutes per IP)
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Please slow down and try again later.',
        requestId: req.id,
      },
    });
  },
});

/**
 * Strict rate limiter for sensitive operations (claim, confirm, login)
 * 30 requests per minute per IP
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests on this endpoint. Please wait a moment before trying again.',
        requestId: req.id,
      },
    });
  },
});

export default { globalLimiter, strictLimiter };
