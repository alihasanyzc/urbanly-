import { z } from 'zod';

/** Tutarlı hata gövdesi (bkz. CLAUDE.md §5.2 / §6). */
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
}

/** Sayfalı yanıt zarfı. */
export interface Paginated<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export const paginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
});
