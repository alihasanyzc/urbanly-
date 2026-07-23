import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { loginSchema, refreshSchema, registerSchema } from '@urbanly/shared';
import { validate } from '../../middlewares/validate.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { authController } from './auth.controller.js';

export const authRouter = Router();

// Auth uçlarında rate limiting zorunlu (bkz. CLAUDE.md §5.3).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

authRouter.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  asyncHandler(authController.register),
);
authRouter.post('/login', authLimiter, validate(loginSchema), asyncHandler(authController.login));
authRouter.post('/refresh', validate(refreshSchema), asyncHandler(authController.refresh));
authRouter.post('/logout', validate(refreshSchema), asyncHandler(authController.logout));
