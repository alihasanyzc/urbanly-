import type { Paginated, Place, PlaceQuery } from '@urbanly/shared';
import { api } from './client';

export async function fetchPlaces(query: Partial<PlaceQuery> = {}): Promise<Paginated<Place>> {
  const res = await api.get<Paginated<Place>>('/places', { params: query });
  return res.data;
}

export async function fetchPlace(id: string): Promise<Place> {
  const res = await api.get<{ data: Place }>(`/places/${id}`);
  return res.data.data;
}
