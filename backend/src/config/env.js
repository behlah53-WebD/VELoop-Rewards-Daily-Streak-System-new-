import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z
    .string()
    .default('mongodb://127.0.0.1:27017/veloop_rewards')
    .transform((val) => {
      // Reconcile database name casing without modifying .env (fixes MongoServerError: DatabaseDifferCase 13297)
      return val.replace(/\/veloops1(\?|$)/i, (match, suffix) => `/VEloops1${suffix}`);
    }),
  JWT_SECRET: z.string().min(16).default('development_jwt_secret_key_at_least_32_characters_long'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  ENABLE_DEV_TOOLS: z.coerce.boolean().default(false),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  if (process.env.NODE_ENV !== 'test') {
    process.exit(1);
  }
}

export const env = parsed.success ? parsed.data : envSchema.parse({});
export default env;
