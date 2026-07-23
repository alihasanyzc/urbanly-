import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { apiRouter } from './routes.js';

export function createApp() {
  const app = express();

  // Güvenlik başlıkları (bkz. CLAUDE.md §5.3).
  app.use(helmet());

  // CORS — yalnızca beyaz listedeki origin'ler.
  app.use(
    cors({
      origin: env.CORS_ORIGINS.length > 0 ? env.CORS_ORIGINS : false,
      credentials: true,
    }),
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(pinoHttp({ logger }));

  app.use('/api/v1', apiRouter);

  // 404 + merkezi hata işleyici en sonda.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
