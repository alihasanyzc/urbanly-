import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { usersController } from './users.controller.js';

export const usersRouter = Router();

usersRouter.get('/me', requireAuth, asyncHandler(usersController.me));
