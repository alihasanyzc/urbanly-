import 'dotenv/config';
import { z } from 'zod';

/**
 * Ortam değişkenleri Zod ile doğrulanır. Eksik/hatalı env, uygulama
 * başlamadan erken yakalanır (bkz. CLAUDE.md §3.2).
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGINS: z
    .string()
    .default('')
    .transform((val) => val.split(',').map((s) => s.trim()).filter(Boolean)),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET en az 16 karakter olmalı'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET en az 16 karakter olmalı'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('30d'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Sır değerleri loglamıyoruz; sadece hangi alanların hatalı olduğunu yazıyoruz.
  console.error('❌ Geçersiz ortam değişkenleri:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
