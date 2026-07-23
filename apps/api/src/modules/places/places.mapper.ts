import type { Place as DbPlace } from '@prisma/client';
import type { Place, PlaceCategory } from '@urbanly/shared';

export function toPublicPlace(place: DbPlace): Place {
  return {
    id: place.id,
    name: place.name,
    category: place.category as PlaceCategory,
    // Aşağıdaki alanlar henüz DB şemasında yok — frontend fazı varsayılanları.
    // Prisma şeması genişletilince buradan doldurulacak.
    tags: [],
    description: place.description,
    location: { lat: place.lat, lng: place.lng },
    imageUrl: place.imageUrl,
    images: place.imageUrl ? [place.imageUrl] : [],
    rating: null,
    ratingCount: 0,
    address: null,
    phone: null,
    website: null,
    priceLevel: null,
    openHours: null,
    amenities: [],
    createdAt: place.createdAt.toISOString(),
  };
}
