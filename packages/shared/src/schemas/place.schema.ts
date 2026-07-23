import { z } from 'zod';

/** Mekân kategorileri — bir mekân tek kategoriye aittir. Haritada marker ikonunu belirler. */
export const placeCategorySchema = z.enum([
  'cafe', // ☕ Kafeler
  'restaurant', // 🍽️ Restoranlar
  'photo_spot', // 📷 Fotoğraf Spotları
  'historic', // 🏛️ Tarihi Yerler
  'viewpoint', // 🌅 Manzara Noktaları
  'park', // 🌳 Park & Doğa
  'hidden_gem', // ⭐ Gizli Keşifler
  'art', // 🎨 Sanat & Sokak Sanatı
  'other',
]);

/**
 * Mekân etiketleri — kategoriden bağımsız özellikler; bir mekânda birden çok olabilir.
 * Haritada filtre çipi olarak kullanılır (marker değil).
 */
export const placeTagSchema = z.enum([
  'photogenic', // 📷 Fotoğrafı güzel
  'work_friendly', // 💻 Çalışmaya uygun
]);

/** Mekân olanakları — detay ekranında "özellikler" bloğunda gösterilir. */
export const placeAmenitySchema = z.enum([
  'wifi', // Wi-Fi
  'power_outlet', // Priz
  'outdoor', // Açık hava
  'pet_friendly', // Evcil dostu
  'card_payment', // Kart geçer
  'reservation', // Rezervasyon
  'free_entry', // Ücretsiz giriş
  'ticket', // Biletli giriş
  'parking', // Otopark
  'family_friendly', // Aile dostu
]);

/** Coğrafi konum (WGS84). */
export const geoPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

/** Herkese açık mekân gösterimi. */
export const placeSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: placeCategorySchema,
  tags: z.array(placeTagSchema).default([]),
  description: z.string().nullable(),
  location: geoPointSchema,
  imageUrl: z.string().url().nullable(), // kapak görseli (geriye dönük uyumluluk)
  images: z.array(z.string().url()).default([]), // galeri — bottom sheet'te kaydırılır
  rating: z.number().min(0).max(5).nullable(), // ortalama puan
  ratingCount: z.number().int().nonnegative().default(0), // değerlendirme sayısı
  // Detay ekranı bilgi alanları (hepsi opsiyonel — kaynağa göre dolar):
  address: z.string().nullable().default(null),
  phone: z.string().nullable().default(null),
  website: z.string().url().nullable().default(null),
  priceLevel: z.number().int().min(1).max(4).nullable().default(null), // ₺ sayısı
  openHours: z.string().nullable().default(null), // ör. "09:00 – 22:00"
  amenities: z.array(placeAmenitySchema).default([]),
  createdAt: z.string(), // ISO 8601
});

/** Keşif/listeleme sorgu parametreleri (konum + kategori filtresi). */
export const placeQuerySchema = z.object({
  category: placeCategorySchema.optional(),
  tags: z.array(placeTagSchema).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radiusKm: z.coerce.number().positive().max(50).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export type PlaceCategory = z.infer<typeof placeCategorySchema>;
export type PlaceTag = z.infer<typeof placeTagSchema>;
export type PlaceAmenity = z.infer<typeof placeAmenitySchema>;
export type GeoPoint = z.infer<typeof geoPointSchema>;
export type Place = z.infer<typeof placeSchema>;
export type PlaceQuery = z.infer<typeof placeQuerySchema>;
