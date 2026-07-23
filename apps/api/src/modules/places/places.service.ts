import type { Paginated, Place, PlaceQuery } from '@urbanly/shared';
import type { Prisma } from '@prisma/client';
import { HttpError } from '../../utils/http-error.js';
import { toPublicPlace } from './places.mapper.js';
import { placesRepository } from './places.repository.js';

export const placesService = {
  async list(query: PlaceQuery): Promise<Paginated<Place>> {
    const where: Prisma.PlaceWhereInput = {};
    if (query.category) where.category = query.category;

    // NOT: Konum yarıçapı (radiusKm) filtrelemesi PostGIS ile yapılacak
    // (ST_DWithin). MVP'de kategori + sayfalama yeterli; geo sorgu sonraki iş.

    const skip = (query.page - 1) * query.limit;
    const [rows, total] = await Promise.all([
      placesRepository.findMany({ where, skip, take: query.limit }),
      placesRepository.count(where),
    ]);

    return {
      data: rows.map(toPublicPlace),
      meta: { total, page: query.page, limit: query.limit },
    };
  },

  async getById(id: string): Promise<Place> {
    const place = await placesRepository.findById(id);
    if (!place) throw HttpError.notFound('Mekân bulunamadı');
    return toPublicPlace(place);
  },
};
