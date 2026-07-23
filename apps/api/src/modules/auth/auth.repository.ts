import type { RefreshToken } from '@prisma/client';
import { prisma } from '../../config/db.js';

/** Refresh token DB erişimi (rotasyon için). */
export const authRepository = {
  storeRefreshToken(data: { tokenHash: string; userId: string; expiresAt: Date }): Promise<RefreshToken> {
    return prisma.refreshToken.create({ data });
  },

  findActiveByHash(tokenHash: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
    });
  },

  revoke(id: string): Promise<RefreshToken> {
    return prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  },
};
