import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/http-error.js';
import { verifyAccessToken } from '../utils/jwt.js';

/** Express Request'e kimliği doğrulanmış kullanıcıyı ekler. */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/** Bearer access token doğrular; geçersizse 401 döner. */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(HttpError.unauthorized());
    return;
  }

  const token = header.slice('Bearer '.length);
  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    next();
  } catch {
    next(HttpError.unauthorized('Geçersiz veya süresi dolmuş token'));
  }
}
