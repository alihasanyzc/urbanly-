import type { NextFunction, Request, Response } from 'express';
import type { ApiError } from '@urbanly/shared';
import { logger } from '../config/logger.js';
import { HttpError } from '../utils/http-error.js';

/** 404 — eşleşmeyen rota. */
export function notFoundHandler(_req: Request, res: Response) {
  const body: ApiError = {
    error: { code: 'NOT_FOUND', message: 'Kaynak bulunamadı' },
  };
  res.status(404).json(body);
}

/**
 * Merkezi hata işleyici — tüm hatalar tek tutarlı gövdeye dönüşür.
 * Beklenmeyen hatalar loglanır; istemciye iç detay sızdırılmaz.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    const body: ApiError = {
      error: { code: err.code, message: err.message, details: err.details },
    };
    res.status(err.statusCode).json(body);
    return;
  }

  logger.error({ err }, 'Beklenmeyen hata');
  const body: ApiError = {
    error: { code: 'INTERNAL_ERROR', message: 'Beklenmeyen bir hata oluştu' },
  };
  res.status(500).json(body);
}
