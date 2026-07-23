import type { Request, Response } from 'express';
import type { LoginInput, RefreshInput, RegisterInput } from '@urbanly/shared';
import { authService } from './auth.service.js';

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body as RegisterInput);
    res.status(201).json({ data: result });
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body as LoginInput);
    res.json({ data: result });
  },

  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body as RefreshInput;
    const tokens = await authService.refresh(refreshToken);
    res.json({ data: tokens });
  },

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.body as RefreshInput;
    await authService.logout(refreshToken);
    res.status(204).send();
  },
};
