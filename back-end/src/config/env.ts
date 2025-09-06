import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('8000'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('1h'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
});

export const config = envSchema.parse(process.env);
