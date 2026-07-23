import { PrismaClient } from '@prisma/client';
import { isProd } from './env.js';

/**
 * Tekil Prisma istemcisi. Repository katmanı bunu kullanır;
 * DB erişimi bu katmanda izole edilir (bkz. CLAUDE.md §2.1).
 */
export const prisma = new PrismaClient({
  log: isProd ? ['warn', 'error'] : ['query', 'warn', 'error'],
});
