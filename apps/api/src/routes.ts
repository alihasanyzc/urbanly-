import { Router } from 'express';
import { authRouter } from './modules/auth/auth.route.js';
import { healthRouter } from './modules/health/health.route.js';
import { placesRouter } from './modules/places/places.route.js';
import { usersRouter } from './modules/users/users.route.js';

/** Tüm modül rotaları /api/v1 altında toplanır (bkz. CLAUDE.md §6). */
export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/places', placesRouter);
