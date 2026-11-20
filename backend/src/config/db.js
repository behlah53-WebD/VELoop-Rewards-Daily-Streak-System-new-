import mongoose from 'mongoose';
import env from './env.js';

let isConnected = false;

export async function connectDB(uri = env.MONGO_URI) {
  if (isConnected || mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });

    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    console.error(`[Database] MongoDB Connection Error: ${error.message}`);
    if (env.NODE_ENV !== 'test') {
      // In production/dev, we log and rethrow or let caller handle
      throw error;
    }
  }
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[Database] MongoDB Disconnected');
  }
}

export function getDatabaseState() {
  const states = {
    0: 'DISCONNECTED',
    1: 'CONNECTED',
    2: 'CONNECTING',
    3: 'DISCONNECTING',
  };
  return states[mongoose.connection.readyState] || 'UNKNOWN';
}

export default { connectDB, disconnectDB, getDatabaseState };
