import type { NextFunction, Request, Response } from 'express';
import { ZodError, type ZodTypeAny } from 'zod';
import { HttpError } from '../utils/http-error.js';

type Source = 'body' | 'query' | 'params';

/**
 * İstek girdisini Zod ile doğrular ve doğrulanmış/parse edilmiş değeri
 * geri yazar. Doğrulanmamış girdi service'e ASLA geçmez (bkz. CLAUDE.md §5.1).
 */
export const validate =
  (schema: ZodTypeAny, source: Source = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      // query/params salt-okunur olabildiği için ayrı bir alana yazıyoruz.
      if (source === 'body') {
        req.body = parsed;
      } else {
        res.locals[source] = parsed;
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(HttpError.badRequest('Doğrulama hatası', err.issues));
        return;
      }
      next(err);
    }
  };
