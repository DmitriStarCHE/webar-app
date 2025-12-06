import { z } from 'zod';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from root .env file
dotenv.config({ path: resolve(__dirname, '../../../.env') });

// Environment schema validation
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),

  // API Settings
  API_PORT: z.string().transform(Number).default('3000'),
  API_HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // CORS
  ALLOWED_ORIGINS: z.string().transform((str) => str.split(',')),

  // File Upload Limits (in MB)
  MAX_FILE_SIZE_MB: z.string().transform(Number).default('50'),
  MAX_TRIGGER_IMAGE_SIZE_MB: z.string().transform(Number).default('5'),
  MAX_AUDIO_SIZE_MB: z.string().transform(Number).default('10'),

  // Cloudflare R2 (optional for local development)
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  R2_PUBLIC_URL: z.string().url().optional(),

  // URLs
  ADMIN_URL: z.string().url(),
  VIEWER_URL: z.string().url(),

  // Rate Limiting
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  RATE_LIMIT_WINDOW: z.string().default('15m'),
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;

export type Env = z.infer<typeof envSchema>;
