import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Urbanly API çalışıyor: http://localhost:${env.PORT}/api/v1`);
});

// Zarif kapanış — açık bağlantıları bekler.
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    logger.info(`${signal} alındı, kapanılıyor...`);
    server.close(() => process.exit(0));
  });
}
