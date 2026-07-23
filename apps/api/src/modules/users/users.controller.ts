import type { Request, Response } from 'express';
import { HttpError } from '../../utils/http-error.js';
import { usersService } from './users.service.js';

export const usersController = {
  // GET /users/me — requireAuth middleware userId'yi doldurur.
  async me(req: Request, res: Response) {
    if (!req.userId) throw HttpError.unauthorized();
    const user = await usersService.getPublicById(req.userId);
    res.json({ data: user });
  },
};
