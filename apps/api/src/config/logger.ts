import { pino } from 'pino';
import { env, isProd } from './env.js';

/**
 * Yapısal loglama (Pino). Geliştirmede okunabilir çıktı için pino-pretty.
 * Hassas veri (şifre, token) loglanmaz — bkz. CLAUDE.md §5.3.
 */
export const logger = pino({
  level: isProd ? 'info' : 'debug',
  redact: {
    paths: ['req.headers.authorization', 'password', 'passwordHash', '*.password'],
    remove: true,
  },
  transport: isProd
    ? undefined
    : {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:HH:MM:ss' },
      },
});

// env import edilmiş olması, env doğrulamasının erken çalışmasını da garanti eder.
void env;
