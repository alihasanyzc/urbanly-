import type { PlaceQuery } from '@urbanly/shared';
import { useQuery } from '@tanstack/react-query';
import { fetchPlaces } from '../../api/places.api';

/** Mekân listesi sorgusu — sunucu durumu TanStack Query ile yönetilir. */
export function usePlaces(query: Partial<PlaceQuery> = {}) {
  return useQuery({
    queryKey: ['places', query],
    queryFn: () => fetchPlaces(query),
  });
}
