import type { User } from '@prisma/client';
import type { PublicUser } from '@urbanly/shared';

/** DB kullanıcısını herkese açık gösterime çevirir — passwordHash asla sızmaz. */
export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    createdAt: user.createdAt.toISOString(),
  };
}
