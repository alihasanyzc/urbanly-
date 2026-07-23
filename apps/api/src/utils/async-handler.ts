import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Async controller'ları sarmalar; reddedilen promise'leri Express hata
 * zincirine iletir. Böylece her controller'da try-catch tekrarı olmaz.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
