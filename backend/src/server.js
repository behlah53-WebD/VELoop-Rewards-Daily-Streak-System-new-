import app from './app.js';
import env from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

const PORT = env.PORT || 5000;

async function startServer() {
  try {
    console.log(`[Server] Starting in ${env.NODE_ENV} mode...`);
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`[Server] VELoop Rewards backend listening on port ${PORT}`);
      console.log(`[Server] Health check available at http://localhost:${PORT}/health`);
    });

    const shutdown = async (signal) => {
      console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        console.log('[Server] Process terminated.');
        process.exit(0);
      });

      // Force close if graceful shutdown takes too long
      setTimeout(() => {
        console.error('[Server] Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error(`[Server] Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
