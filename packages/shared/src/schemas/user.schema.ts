import { z } from 'zod';

/** Herkese açık kullanıcı gösterimi — şifre gibi alanlar ASLA yer almaz. */
export const publicUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  createdAt: z.string(), // ISO 8601 (bkz. CLAUDE.md §6)
});

export type PublicUser = z.infer<typeof publicUserSchema>;
