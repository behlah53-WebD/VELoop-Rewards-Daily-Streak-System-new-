import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { seedDatabase } from '../seed/seed.js';

let replSet = null;

export async function setupTestDB() {
  replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  });

  const uri = replSet.getUri();
  await mongoose.connect(uri);

  // Seed default configuration, 7 rewards, and demo user
  await seedDatabase({ exitOnComplete: false });
}

export async function teardownTestDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (replSet) {
    await replSet.stop();
  }
}

export default { setupTestDB, teardownTestDB };
