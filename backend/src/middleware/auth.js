import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { User } from '../models/User.js';

/**
 * Authentication Middleware
 * Extracts and verifies JWT from Bearer Authorization header.
 * Discards any client-sent identity; user identity is derived strictly from the verified JWT.
 */
export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Authentication token is required. Please log in.',
        requestId: req.id,
      },
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Invalid session token payload.',
          requestId: req.id,
        },
      });
    }

    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHENTICATED',
          message: 'User account associated with token was not found.',
          requestId: req.id,
        },
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_NOT_ELIGIBLE',
          message: 'This account has been suspended and cannot claim rewards.',
          requestId: req.id,
        },
      });
    }

    // Attach verified user to request
    req.user = user;
    next();
  } catch (error) {
    const isExpired = error.name === 'TokenExpiredError';
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHENTICATED',
        message: isExpired ? 'Your session has expired. Please log in again.' : 'Invalid session token.',
        requestId: req.id,
      },
    });
  }
}

export default authenticateToken;
