import env from '../config/env.js';

/**
 * Standard error codes:
 * UNAUTHENTICATED, VALIDATION_ERROR, ALREADY_CLAIMED, STILL_LOCKED,
 * DAY_MISMATCH, STREAK_RESET, CLAIM_NOT_READY, CLAIM_EXPIRED,
 * ACCOUNT_NOT_ELIGIBLE, RATE_LIMITED, NOT_FOUND, FORBIDDEN, SERVER_ERROR
 */
export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || (err.status && typeof err.status === 'number' ? err.status : 500);
  let errorCode = err.code || 'SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred. Please try again.';

  // Handle specific known error types safely
  if (err.name === 'ValidationError') {
    // Mongoose or Zod
    errorCode = 'VALIDATION_ERROR';
    message = err.message || 'Invalid input data.';
  } else if (err.name === 'CastError') {
    errorCode = 'VALIDATION_ERROR';
    message = 'Invalid resource identifier format.';
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    errorCode = 'UNAUTHENTICATED';
    message = 'Invalid or expired session token. Please log in again.';
  } else if (err.code === 11000) {
    errorCode = 'DUPLICATE_ENTRY';
    if (err.keyPattern?.email || (err.message && err.message.includes('email'))) {
      message = 'An account with this email address already exists.';
    } else {
      message = 'A duplicate entry was detected.';
    }
  }

  // Never leak internal stack traces or MongoServerError details
  if (statusCode === 500 && env.NODE_ENV === 'production') {
    errorCode = 'SERVER_ERROR';
    message = 'An unexpected server error occurred. Please try again.';
  }

  // Log server errors for internal monitoring
  if (statusCode >= 500) {
    console.error(`[Error] [Request ID: ${req.id || 'N/A'}]`, err);
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      requestId: req.id,
      ...(err.details ? { details: err.details } : {}),
      ...(err.retryAfterMs ? { retryAfterMs: err.retryAfterMs } : {}),
    },
  });
}

export default errorHandler;
