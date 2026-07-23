import type { Place, Prisma } from '@prisma/client';
import { prisma } from '../../config/db.js';

export const placesRepository = {
  findMany(args: {
    where: Prisma.PlaceWhereInput;
    skip: number;
    take: number;
  }): Promise<Place[]> {
    return prisma.place.findMany({
      where: args.where,
      skip: args.skip,
      take: args.take,
      orderBy: { createdAt: 'desc' },
    });
  },

  count(where: Prisma.PlaceWhereInput): Promise<number> {
    return prisma.place.count({ where });
  },

  findById(id: string): Promise<Place | null> {
    return prisma.place.findUnique({ where: { id } });
  },
};
