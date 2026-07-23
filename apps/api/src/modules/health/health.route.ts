import { Router } from 'express';

export const healthRouter = Router();

// Basit sağlık kontrolü — deploy/monitoring için.
healthRouter.get('/', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});
