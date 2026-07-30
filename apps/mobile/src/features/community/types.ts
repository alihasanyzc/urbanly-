/**
 * Topluluk akışının domain tipleri.
 *
 * Şimdilik yalnızca UI'ı besler (mock). Backend hazır olunca bu tipler
 * `packages/shared`'e taşınıp Zod şemasıyla frontend & backend arasında paylaşılacak
 * (bkz. CLAUDE.md §5.2). O yüzden alan adları API sözleşmesine uygun tutulur.
 */

export interface CommunityAuthor {
  id: string;
  name: string;
  avatarUrl: string;
}

/** Topluluk akışının sekmeleri — Twitter benzeri: tüm akış / takip edilenler. */
export type CommunityTab = 'feed' | 'following';

/** Paylaşımın konumu — il/ilçe (kartta bağlam olarak gösterilir). */
export interface CommunityLocation {
  city: string; // il
  district: string; // ilçe
}

export interface CommunityComment {
  id: string;
  author: CommunityAuthor;
  text: string;
  /** ISO 8601 (UTC). */
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  author: CommunityAuthor;
  /** Kullanıcının paylaştığı serbest metin. */
  text: string;
  /** ISO 8601 (UTC) — bkz. CLAUDE.md §6. */
  createdAt: string;
  /** Paylaşımın il/ilçesi — filtreleme bu alana bakar. */
  location: CommunityLocation;
  likeCount: number;
  /** Aktif kullanıcının bu paylaşımı beğenip beğenmediği. */
  liked: boolean;
  /** Aktif kullanıcının bu paylaşımı kaydedip kaydetmediği (social graph — kaydet). */
  saved: boolean;
  /** Paylaşıma yapılan yorumlar (adet karttaki yorum ikonunda gösterilir). */
  comments: CommunityComment[];
  /** Opsiyonel: paylaşım bir mekâna bağlıysa o mekânın id'si (detaya köprü). */
  placeId?: string;
}
