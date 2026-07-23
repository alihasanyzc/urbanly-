import type { PlaceAmenity, PlaceCategory, PlaceTag } from '@urbanly/shared';
import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

/**
 * Harita özelliğinin görsel sözlüğü.
 *
 * Kategori/etiket/olanak gibi domain enum'larını (packages/shared) tek bir yerden
 * ikon + etiket + renk'e eşler. Böylece bir kategori eklendiğinde/rengi değiştiğinde
 * yalnızca bu dosya güncellenir; bileşenler serbest kalır (tek doğruluk kaynağı).
 */

/** `@expo/vector-icons` Ionicons ikon adlarının tip-güvenli birleşimi. */
type IoniconName = ComponentProps<typeof Ionicons>['name'];

/** Harita marker'ı ve filtre çipi için kategori görselleştirmesi (Ionicons outline). */
export interface CategoryMeta {
  icon: IoniconName;
  label: string;
  color: string; // marker + rozet rengi
}

export const CATEGORY_META: Record<PlaceCategory, CategoryMeta> = {
  cafe: { icon: 'cafe-outline', label: 'Kafeler', color: '#b45309' },
  restaurant: { icon: 'restaurant-outline', label: 'Restoranlar', color: '#dc2626' },
  photo_spot: { icon: 'camera-outline', label: 'Fotoğraf Spotları', color: '#7c3aed' },
  historic: { icon: 'library-outline', label: 'Tarihi Yerler', color: '#92400e' },
  viewpoint: { icon: 'telescope-outline', label: 'Manzara Noktaları', color: '#ea580c' },
  park: { icon: 'leaf-outline', label: 'Park & Doğa', color: '#16a34a' },
  hidden_gem: { icon: 'diamond-outline', label: 'Gizli Keşifler', color: '#ca8a04' },
  art: { icon: 'color-palette-outline', label: 'Sanat & Sokak Sanatı', color: '#db2777' },
  other: { icon: 'location-outline', label: 'Diğer', color: '#6b7280' },
};

/** Kategoriden bağımsız özellik etiketleri (Ionicons outline). */
export interface TagMeta {
  icon: IoniconName;
  label: string;
}

export const TAG_META: Record<PlaceTag, TagMeta> = {
  photogenic: { icon: 'camera-outline', label: 'Fotoğrafı güzel' },
  work_friendly: { icon: 'laptop-outline', label: 'Çalışmaya uygun' },
};

/** Filtre çubuğunda gösterilecek sıralı kategori listesi ('other' hariç). */
export const CATEGORY_ORDER: PlaceCategory[] = [
  'cafe',
  'restaurant',
  'photo_spot',
  'historic',
  'viewpoint',
  'park',
  'hidden_gem',
  'art',
];

export const TAG_ORDER: PlaceTag[] = ['photogenic', 'work_friendly'];

/** Detay ekranı "özellikler" bloğu — Ionicons outline ikonları. */
export interface AmenityMeta {
  icon: IoniconName;
  label: string;
}

export const AMENITY_META: Record<PlaceAmenity, AmenityMeta> = {
  wifi: { icon: 'wifi-outline', label: 'Wi-Fi' },
  power_outlet: { icon: 'flash-outline', label: 'Priz' },
  outdoor: { icon: 'leaf-outline', label: 'Açık hava' },
  pet_friendly: { icon: 'paw-outline', label: 'Evcil dostu' },
  card_payment: { icon: 'card-outline', label: 'Kart geçer' },
  reservation: { icon: 'calendar-outline', label: 'Rezervasyon' },
  free_entry: { icon: 'pricetag-outline', label: 'Ücretsiz giriş' },
  ticket: { icon: 'ticket-outline', label: 'Biletli giriş' },
  parking: { icon: 'car-outline', label: 'Otopark' },
  family_friendly: { icon: 'people-outline', label: 'Aile dostu' },
};
