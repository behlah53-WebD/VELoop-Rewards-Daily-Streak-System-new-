import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import env from './config/env.js';
import requestIdMiddleware from './middleware/requestId.js';
import errorHandler from './middleware/errorHandler.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import healthRoutes from './routes/health.routes.js';
import apiRoutes from './routes/index.js';

const app = express();

// Security headers
app.use(helmet());

// Cross-Origin Resource Sharing
const rawOrigins = env.CLIENT_ORIGIN || 'http://localhost:5173';
const allowedOrigins = rawOrigins.split(',').map((o) => o.trim().replace(/\/$/, ''));
const isWildcard = allowedOrigins.includes('*');

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server, or Vite proxy) or in test mode
      if (!origin || env.NODE_ENV === 'test' || isWildcard) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, '');

      // Check allowed list exact match
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      // Automatically allow localhost and 127.0.0.1 on any port in development
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)) {
        return callback(null, true);
      }

      // Automatically allow common cloud hosting previews
      try {
        const host = new URL(origin).hostname;
        if (host.endsWith('.vercel.app') || host.endsWith('.netlify.app') || host.endsWith('.onrender.com')) {
          return callback(null, true);
        }
      } catch {
        // invalid URL format
      }

      // Reject politely without throwing a 500 error
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key', 'X-Request-Id'],
  })
);

// Body parser with strict size limit to prevent payload flooding
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Sanitize MongoDB queries to prevent NoSQL injection
app.use(mongoSanitize());

// Attach unique request ID
app.use(requestIdMiddleware);

// Health check route mounted directly at root
app.use(healthRoutes);

// Apply rate limiting to all /api routes
app.use('/api', globalLimiter);

// API routes mounted at /api
app.use('/api', apiRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist.`,
      requestId: req.id,
    },
  });
});

// Central Error Handler
app.use(errorHandler);

export default app;
