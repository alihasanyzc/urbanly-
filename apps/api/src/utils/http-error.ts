/**
 * İş mantığı katmanının fırlattığı tipli HTTP hatası.
 * errorHandler middleware bunu tutarlı gövdeye çevirir (bkz. CLAUDE.md §6).
 */
export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown[],
  ) {
    super(message);
    this.name = 'HttpError';
  }

  static badRequest(message: string, details?: unknown[]) {
    return new HttpError(400, 'BAD_REQUEST', message, details);
  }

  static unauthorized(message = 'Kimlik doğrulama gerekli') {
    return new HttpError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'Bu işlem için yetkiniz yok') {
    return new HttpError(403, 'FORBIDDEN', message);
  }

  static notFound(message = 'Kayıt bulunamadı') {
    return new HttpError(404, 'NOT_FOUND', message);
  }

  static conflict(message: string) {
    return new HttpError(409, 'CONFLICT', message);
  }
}
