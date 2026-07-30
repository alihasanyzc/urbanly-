/**
 * "Benimle Gez" domain tipleri — kullanıcı ilanları (kalkış → varış).
 *
 * Şimdilik yalnızca UI'ı besler (mock). Backend hazır olunca `packages/shared`'e taşınıp
 * Zod şemasıyla paylaşılacak (bkz. CLAUDE.md §5.2). Alan adları API sözleşmesine uygun tutulur.
 */

/**
 * İlan kategorisi:
 * - `buddy`: birlikte gezmek isteyen (gezi arkadaşı) — rota boyunca eşlik.
 * - `passenger`: taksi gibi götürülmek isteyen yolcu — kalkıştan varışa taşınma.
 */
export type TripCategory = 'buddy' | 'passenger';

export interface TripAuthor {
  id: string;
  name: string;
  avatarUrl: string;
  /** Kullanıcının puanı (0–5) — güven göstergesi. */
  rating: number;
}

export interface TripListing {
  id: string;
  author: TripAuthor;
  category: TripCategory;
  /** Kalkış bölgesi (ör. "Beşiktaş"). */
  from: string;
  /** Varış bölgesi (ör. "Kadıköy"). */
  to: string;
  /** Planlanan kalkış zamanı — ISO 8601 (UTC), bkz. CLAUDE.md §6. */
  departAt: string;
  /** Serbest açıklama (plan, tercih, bütçe vb.). */
  note: string;
  createdAt: string;
}
