import type { Request, Response } from 'express';
import type { PlaceQuery } from '@urbanly/shared';
import { placesService } from './places.service.js';

export const placesController = {
  // GET /places — doğrulanmış query res.locals.query'de (validate middleware).
  async list(_req: Request, res: Response) {
    const query = res.locals.query as PlaceQuery;
    const result = await placesService.list(query);
    res.json(result);
  },

  // GET /places/:id
  async getById(req: Request, res: Response) {
    const place = await placesService.getById(req.params.id as string);
    res.json({ data: place });
  },
};
