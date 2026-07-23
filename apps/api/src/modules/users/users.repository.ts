import type { Prisma, User } from '@prisma/client';
import { prisma } from '../../config/db.js';

/** Kullanıcı DB erişimi — sorgular yalnızca bu katmanda (bkz. CLAUDE.md §2.1). */
export const usersRepository = {
  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  },
};
