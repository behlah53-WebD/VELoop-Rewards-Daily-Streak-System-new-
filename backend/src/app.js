import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import env from './config/env.js';
import requestIdMiddleware from './middleware/requestId.js';
import errorHandler from './middleware/errorHandler.js';
import healthRoutes from './routes/health.routes.js';

const app = express();

// Security headers
app.use(helmet());

// Cross-Origin Resource Sharing
const allowedOrigins = env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server) or matching allowed list
      if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === 'test') {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
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

// API routes prefix placeholder
app.get('/api', (req, res) => {
  res.json({
    success: true,
    name: 'VELoop Rewards API',
    version: '1.0.0',
    serverTime: new Date().toISOString(),
  });
});

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
