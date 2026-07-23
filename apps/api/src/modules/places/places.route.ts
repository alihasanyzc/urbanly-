import { Router } from 'express';
import { placeQuerySchema } from '@urbanly/shared';
import { validate } from '../../middlewares/validate.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { placesController } from './places.controller.js';

export const placesRouter = Router();

placesRouter.get('/', validate(placeQuerySchema, 'query'), asyncHandler(placesController.list));
placesRouter.get('/:id', asyncHandler(placesController.getById));
