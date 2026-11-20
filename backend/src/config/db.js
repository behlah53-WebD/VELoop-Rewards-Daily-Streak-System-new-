import mongoose from 'mongoose';
import env from './env.js';

let isConnected = false;

/**
 * Normalizes the database name in the connection string to match the exact casing
 * existing on the MongoDB cluster, avoiding MongoServerError: DatabaseDifferCase (code 13297).
 */
export async function normalizeDatabaseCase(uri) {
  if (!uri || typeof uri !== 'string') return uri;

  // Fast-path replacement for veloops1 -> VEloops1
  let normalizedUri = uri.replace(/\/veloops1(\?|$)/i, (match, suffix) => `/VEloops1${suffix}`);

  if (env.NODE_ENV === 'test') {
    return normalizedUri;
  }

  // Dynamic discovery for any other cluster database casing discrepancies
  const uriMatch = normalizedUri.match(/^(mongodb(?:\+srv)?:\/\/[^\/]+\/)([^?\/]+)(\??.*)$/i);
  if (!uriMatch) return normalizedUri;

  const [, prefix, requestedDb, suffix] = uriMatch;
  if (!requestedDb || requestedDb === 'admin' || requestedDb === 'test') {
    return normalizedUri;
  }

  try {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(normalizedUri, { serverSelectionTimeoutMS: 2500 });
    await client.connect();
    try {
      const admin = client.db().admin();
      const { databases } = await admin.listDatabases();
      const existing = databases.find(
        (d) => d.name.toLowerCase() === requestedDb.toLowerCase()
      );
      if (existing && existing.name !== requestedDb) {
        console.log(`[Database] Normalized database case from '${requestedDb}' to '${existing.name}'`);
        normalizedUri = `${prefix}${existing.name}${suffix}`;
      }
    } finally {
      await client.close();
    }
  } catch {
    // If cluster listDatabases check fails or is restricted, proceed with normalizedUri
  }

  return normalizedUri;
}

export async function connectDB(rawUri = env.MONGO_URI) {
  if (isConnected || mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const uri = await normalizeDatabaseCase(rawUri);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });

    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
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
