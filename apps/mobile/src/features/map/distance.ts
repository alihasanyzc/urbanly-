import type { GeoPoint } from '@urbanly/shared';

/** İki koordinat arası kuş uçuşu mesafe (km) — Haversine. */
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371; // Dünya yarıçapı (km)
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Mesafeyi insan-okur biçime çevirir: <1 km ise metre. */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
