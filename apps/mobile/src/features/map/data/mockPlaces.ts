import type { GeoPoint, Place } from '@urbanly/shared';

/**
 * Frontend geliştirme için sahte mekân verisi (İstanbul).
 *
 * Her mekânın detay alanları (saat, fiyat, olanak, etiket) kategorisine uygun tutulur —
 * ör. tarihi yerde "ücretsiz giriş", parkta fiyat yok, kafede "wifi + priz".
 * Backend hazır olunca bu dosya `fetchPlaces` ile değiştirilecek; şimdilik yalnızca UI'ı besler.
 */

/** Konum izni yokken mesafe/merkez hesabı için başlangıç noktası (Sultanahmet). */
export const MOCK_ORIGIN: GeoPoint = { lat: 41.0082, lng: 28.9784 };

/** Bir mekân için deterministik galeri üretir (bottom sheet ve detayda kaydırılır). */
function gallery(seed: string, n = 3): string[] {
  return Array.from({ length: n }, (_, i) => `https://picsum.photos/seed/${seed}${i}/900/600`);
}

export const MOCK_PLACES: Place[] = [
  // ☕ KAFE — çalışma dostu; wifi/priz, uzun saatler, orta fiyat.
  {
    id: 'p1',
    name: 'Karaköy Kahvecisi',
    category: 'cafe',
    tags: ['work_friendly'],
    description:
      'Sabahları sakin, gün boyu çalışmaya uygun; Boğaz esintili küçük bir üçüncü nesil kahveci.',
    location: { lat: 41.0256, lng: 28.9741 },
    imageUrl: 'https://picsum.photos/seed/cafe0/900/600',
    images: gallery('cafe'),
    rating: 4.6,
    ratingCount: 128,
    address: 'Kemankeş Karamustafa Paşa Mah., Karaköy, Beyoğlu',
    phone: '+90 212 000 00 01',
    website: 'https://example.com/karakoykahve',
    priceLevel: 2,
    openHours: '07:00 – 23:00',
    amenities: ['wifi', 'power_outlet', 'card_payment'],
    createdAt: '2026-01-10T08:00:00.000Z',
  },
  // 🏛️ TARİHİ — ücretsiz giriş, ziyaret saatleri, aile dostu; wifi/priz YOK.
  {
    id: 'p2',
    name: 'Ayasofya-i Kebir Camii',
    category: 'historic',
    tags: ['photogenic'],
    description:
      'Bin beş yüz yıllık yapı; kubbesi, mozaikleri ve katmanlı tarihiyle şehrin simgesi. Ziyaret ücretsiz.',
    location: { lat: 41.0086, lng: 28.9802 },
    imageUrl: 'https://picsum.photos/seed/hist0/900/600',
    images: gallery('hist'),
    rating: 4.9,
    ratingCount: 542,
    address: 'Sultan Ahmet Mah., Ayasofya Meydanı, Fatih',
    phone: '+90 212 000 00 02',
    website: 'https://example.com/ayasofya',
    priceLevel: null,
    openHours: 'Ziyaret: 09:00 – 19:00 (namaz saatleri hariç)',
    amenities: ['free_entry', 'family_friendly'],
    createdAt: '2026-01-05T08:00:00.000Z',
  },
  // 🌅 MANZARA — açık hava, gün batımı, çay bahçesi (uygun fiyat), otopark.
  {
    id: 'p3',
    name: 'Pierre Loti Tepesi',
    category: 'viewpoint',
    tags: ['photogenic'],
    description:
      'Haliç manzarasının en güzel göründüğü tepe. Teleferikle çıkılır; çay bahçesinde gün batımı kaçmaz.',
    location: { lat: 41.0533, lng: 28.9333 },
    imageUrl: 'https://picsum.photos/seed/view0/900/600',
    images: gallery('view'),
    rating: 4.7,
    ratingCount: 301,
    address: 'Merkez Efendi Mah., Eyüpsultan',
    phone: null,
    website: null,
    priceLevel: 1,
    openHours: '08:00 – 00:00',
    amenities: ['outdoor', 'free_entry', 'card_payment', 'parking'],
    createdAt: '2026-02-01T08:00:00.000Z',
  },
  // 🌳 PARK — ücretsiz, açık hava, evcil & aile dostu; fiyat yok.
  {
    id: 'p4',
    name: 'Gülhane Parkı',
    category: 'park',
    tags: ['photogenic'],
    description:
      'Sarayburnu’nun eteğinde geniş, gölgeli, huzurlu tarihi park. Lale mevsiminde ayrı güzel.',
    location: { lat: 41.0134, lng: 28.9812 },
    imageUrl: 'https://picsum.photos/seed/park0/900/600',
    images: gallery('park'),
    rating: 4.5,
    ratingCount: 210,
    address: 'Cankurtaran Mah., Gülhane, Fatih',
    phone: null,
    website: null,
    priceLevel: null,
    openHours: '06:00 – 22:30',
    amenities: ['outdoor', 'free_entry', 'pet_friendly', 'family_friendly'],
    createdAt: '2026-02-11T08:00:00.000Z',
  },
  // 🎨 SANAT — sokakta, her zaman açık, ücretsiz; saat/fiyat yok.
  {
    id: 'p5',
    name: 'Yeldeğirmeni Muralleri',
    category: 'art',
    tags: ['photogenic'],
    description:
      'Sokak sanatının kalbi; dev muraller ve dükkan cepheleriyle açık hava galerisi. Gündüz ışığı ideal.',
    location: { lat: 40.9971, lng: 29.0269 },
    imageUrl: 'https://picsum.photos/seed/art0/900/600',
    images: gallery('art'),
    rating: 4.4,
    ratingCount: 87,
    address: 'Rasimpaşa Mah., Yeldeğirmeni, Kadıköy',
    phone: null,
    website: null,
    priceLevel: null,
    openHours: 'Her zaman açık',
    amenities: ['outdoor', 'free_entry', 'family_friendly'],
    createdAt: '2026-03-01T08:00:00.000Z',
  },
  // 📷 FOTOĞRAF SPOTU — dış mekan, ücretsiz, ışık saatleri; telefon/web yok.
  {
    id: 'p6',
    name: 'Balat Renkli Evler',
    category: 'photo_spot',
    tags: ['photogenic'],
    description:
      'Rengârenk cepheler ve dik dar sokaklar. En iyi kareler sabah erken, kalabalık toplanmadan çıkar.',
    location: { lat: 41.0295, lng: 28.9486 },
    imageUrl: 'https://picsum.photos/seed/photo0/900/600',
    images: gallery('photo'),
    rating: 4.8,
    ratingCount: 176,
    address: 'Balat Mah., Kiremit Cad., Fatih',
    phone: null,
    website: null,
    priceLevel: null,
    openHours: 'Her zaman açık',
    amenities: ['outdoor', 'free_entry'],
    createdAt: '2026-03-14T08:00:00.000Z',
  },
  // 🍽️ RESTORAN — rezervasyon, kart, otopark; akşam saatleri, yüksek fiyat.
  {
    id: 'p7',
    name: 'Mikla',
    category: 'restaurant',
    tags: ['photogenic'],
    description:
      'Modern Anadolu mutfağı; çatı katından şehir ve Haliç manzarası eşliğinde tadım menüsü. Rezervasyon önerilir.',
    location: { lat: 41.0311, lng: 28.9757 },
    imageUrl: 'https://picsum.photos/seed/rest0/900/600',
    images: gallery('rest'),
    rating: 4.7,
    ratingCount: 264,
    address: 'Meşrutiyet Cad. No:15, The Marmara Pera, Beyoğlu',
    phone: '+90 212 000 00 07',
    website: 'https://example.com/mikla',
    priceLevel: 4,
    openHours: '18:00 – 01:00',
    amenities: ['reservation', 'card_payment', 'parking'],
    createdAt: '2026-03-20T08:00:00.000Z',
  },
  // ⭐ GİZLİ KEŞİF — bilinmeyen köşe; gündüz sakin (çalışmaya uygun), wifi/kart.
  {
    id: 'p8',
    name: 'Kadife Sokak Köşesi',
    category: 'hidden_gem',
    tags: ['work_friendly'],
    description:
      'Barlar sokağının sakin ara köşesi. Akşam hareketli, gündüzleri kahveyle çalışmak için birebir.',
    location: { lat: 40.9899, lng: 29.0277 },
    imageUrl: 'https://picsum.photos/seed/gem0/900/600',
    images: gallery('gem'),
    rating: 4.3,
    ratingCount: 64,
    address: 'Caferağa Mah., Kadife Sok., Kadıköy',
    phone: null,
    website: null,
    priceLevel: 2,
    openHours: '10:00 – 02:00',
    amenities: ['wifi', 'outdoor', 'card_payment'],
    createdAt: '2026-04-02T08:00:00.000Z',
  },
];
