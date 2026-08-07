export interface TravelReview {
  id: string;
  reviewer: {
    id: string;
    displayName: string;
    avatarUrl: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface TravelPlan {
  id: string;
  traveler: {
    id: string;
    displayName: string;
    username: string;
    avatarUrl: string;
    age: number;
    verified: boolean;
    bio: string;
  };
  origin: string;
  destination: string;
  departureAt: string;
  returnAt?: string;
  transportPreference: string;
  description: string;
  interests: string[];
  maxCompanions: number;
  joinedCount: number;
  completedTripCount: number;
  reviews: TravelReview[];
  rating: number;
  reviewCount: number;
}

type TravelPlanSource = Omit<TravelPlan, 'rating' | 'reviewCount'>;

function calculateRating(reviews: TravelReview[]): number {
  if (reviews.length === 0) {
    return 0;
  }

  const totalRating = reviews.reduce((total, review) => total + review.rating, 0);
  return Math.round((totalRating / reviews.length) * 10) / 10;
}

function createTravelPlan(source: TravelPlanSource): TravelPlan {
  return {
    ...source,
    rating: calculateRating(source.reviews),
    reviewCount: source.reviews.length,
  };
}

export const MOCK_TRAVEL_PLANS: TravelPlan[] = [
  createTravelPlan({
    id: 'travel-istanbul-goreme',
    traveler: {
      id: 'traveler-elif',
      displayName: 'Elif Aksoy',
      username: 'elifrotada',
      avatarUrl: 'https://i.pravatar.cc/200?u=urbanly-travel-elif',
      age: 27,
      verified: true,
      bio: 'Müzeleri, yerel sofraları ve gün doğumunda yürümeyi seven bir şehir plancısıyım.',
    },
    origin: 'İstanbul',
    destination: 'Kapadokya (Göreme), Nevşehir',
    departureAt: '2026-08-28T19:30:00.000Z',
    returnAt: '2026-08-31T16:00:00.000Z',
    transportPreference: 'Gece otobüsü + yerel servis',
    description:
      'Üç günlük Kapadokya gezisinde gün doğumu yürüyüşü, açık hava müzesi ve küçük yerel lokantalar için sakin tempolu bir yol arkadaşı arıyorum.',
    interests: ['Fotoğraf', 'Tarih', 'Yerel lezzetler'],
    maxCompanions: 2,
    joinedCount: 1,
    completedTripCount: 8,
    reviews: [
      {
        id: 'review-elif-1',
        reviewer: {
          id: 'reviewer-mert',
          displayName: 'Mert Şahin',
          avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-review-mert',
        },
        rating: 5,
        comment:
          'Programı birlikte şekillendirdi ve herkesin temposuna saygı gösterdi. Çok keyifli bir Safranbolu gezisiydi.',
        createdAt: '2026-06-18T17:20:00.000Z',
      },
      {
        id: 'review-elif-2',
        reviewer: {
          id: 'reviewer-derya',
          displayName: 'Derya Tunç',
          avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-review-derya',
        },
        rating: 5,
        comment: 'İletişimi çok açık, planı düzenli ve seyahat boyunca oldukça düşünceliydi.',
        createdAt: '2026-04-27T12:10:00.000Z',
      },
      {
        id: 'review-elif-3',
        reviewer: {
          id: 'reviewer-onur',
          displayName: 'Onur Eren',
          avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-review-onur',
        },
        rating: 4,
        comment:
          'Rota seçimleri çok iyiydi. Yoğun günlerde biraz daha fazla mola vermek güzel olabilirdi.',
        createdAt: '2026-02-12T09:45:00.000Z',
      },
    ],
  }),
  createTravelPlan({
    id: 'travel-ankara-kas',
    traveler: {
      id: 'traveler-bora',
      displayName: 'Bora Demir',
      username: 'boraylagez',
      avatarUrl: 'https://i.pravatar.cc/200?u=urbanly-travel-bora',
      age: 31,
      verified: true,
      bio: 'Uzaktan çalışan, deniz rotalarında yüzme ve kısa doğa yürüyüşlerini kaçırmayan bir gezginim.',
    },
    origin: 'Ankara',
    destination: 'Kaş, Antalya',
    departureAt: '2026-09-04T04:10:00.000Z',
    returnAt: '2026-09-09T15:30:00.000Z',
    transportPreference: 'Uçak + tarifeli otobüs',
    description:
      'Kaş merkezde konaklayıp koyları, Patara’yı ve bir gün de Kekova’yı görmek istiyorum. Erken kalkmayı seven, planlı ama esnek bir arkadaş arıyorum.',
    interests: ['Yüzme', 'Doğa', 'Antik kentler'],
    maxCompanions: 3,
    joinedCount: 2,
    completedTripCount: 5,
    reviews: [
      {
        id: 'review-bora-1',
        reviewer: {
          id: 'reviewer-selin',
          displayName: 'Selin Koç',
          avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-travel-selin',
        },
        rating: 5,
        comment:
          'Likya rotasında hem güvenilir hem de neşeli bir yol arkadaşıydı. Plan değişikliklerini çok iyi yönetti.',
        createdAt: '2026-07-03T18:05:00.000Z',
      },
      {
        id: 'review-bora-2',
        reviewer: {
          id: 'reviewer-cem',
          displayName: 'Cem Arı',
          avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-review-cem',
        },
        rating: 4,
        comment:
          'Aktivite önerileri başarılıydı ve masrafları baştan net konuştu. Genel olarak güzel bir geziydi.',
        createdAt: '2026-05-14T10:30:00.000Z',
      },
      {
        id: 'review-bora-3',
        reviewer: {
          id: 'reviewer-asli',
          displayName: 'Aslı Uçar',
          avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-review-asli',
        },
        rating: 5,
        comment: 'Buluşma saatlerine sadıktı ve herkesin görmek istediği yerlere zaman ayırdı.',
        createdAt: '2026-03-22T14:00:00.000Z',
      },
    ],
  }),
  createTravelPlan({
    id: 'travel-izmir-bozcaada',
    traveler: {
      id: 'traveler-deniz',
      displayName: 'Deniz Yalçın',
      username: 'denizgezgin',
      avatarUrl: 'https://i.pravatar.cc/200?u=urbanly-travel-deniz',
      age: 24,
      verified: false,
      bio: 'Analog fotoğraf, bisiklet ve küçük sahil kasabaları peşinde gezen bir tasarım öğrencisiyim.',
    },
    origin: 'İzmir',
    destination: 'Bozcaada, Çanakkale',
    departureAt: '2026-09-12T03:45:00.000Z',
    returnAt: '2026-09-14T14:00:00.000Z',
    transportPreference: 'Otobüs + feribot',
    description:
      'Hafta sonu ada sokaklarını bisikletle dolaşmak, gün batımını izlemek ve bolca fotoğraf çekmek istiyorum. Telaşsız gezen biriyle eşleşmek isterim.',
    interests: ['Bisiklet', 'Analog fotoğraf', 'Gün batımı'],
    maxCompanions: 1,
    joinedCount: 0,
    completedTripCount: 4,
    reviews: [
      {
        id: 'review-deniz-1',
        reviewer: {
          id: 'reviewer-ece',
          displayName: 'Ece Aydın',
          avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-ece',
        },
        rating: 5,
        comment:
          'Fotoğraf molaları ve sakin gezi temposu tam konuştuğumuz gibiydi. Çok uyumlu bir yol arkadaşı.',
        createdAt: '2026-06-08T16:40:00.000Z',
      },
      {
        id: 'review-deniz-2',
        reviewer: {
          id: 'reviewer-kaan',
          displayName: 'Kaan Erdem',
          avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-review-kaan',
        },
        rating: 5,
        comment: 'Ada rotasını çok iyi araştırmıştı. Sakin, saygılı ve iletişimi güçlü biri.',
        createdAt: '2026-04-19T11:25:00.000Z',
      },
    ],
  }),
  createTravelPlan({
    id: 'travel-istanbul-eskisehir',
    traveler: {
      id: 'traveler-selin',
      displayName: 'Selin Koç',
      username: 'selinyolda',
      avatarUrl: 'https://i.pravatar.cc/200?u=urbanly-travel-selin',
      age: 29,
      verified: true,
      bio: 'Hafta sonlarını yeni müzeler, iyi kahve ve uzun şehir yürüyüşleriyle değerlendiren bir editörüm.',
    },
    origin: 'İstanbul',
    destination: 'Eskişehir',
    departureAt: '2026-08-22T04:15:00.000Z',
    returnAt: '2026-08-23T17:20:00.000Z',
    transportPreference: 'Yüksek hızlı tren',
    description:
      'Odunpazarı evleri, OMM ve Porsuk çevresini kapsayan kısa bir hafta sonu planım var. Yürümeyi ve müze gezmeyi seven bir arkadaş arıyorum.',
    interests: ['Müzeler', 'Mimari', 'Kahve'],
    maxCompanions: 2,
    joinedCount: 0,
    completedTripCount: 7,
    reviews: [
      {
        id: 'review-selin-1',
        reviewer: {
          id: 'reviewer-bora',
          displayName: 'Bora Demir',
          avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-travel-bora',
        },
        rating: 4,
        comment:
          'Detaylı hazırlığı sayesinde hiçbir yeri aceleye getirmedik. Yoğun ama çok verimli bir programdı.',
        createdAt: '2026-07-04T09:15:00.000Z',
      },
      {
        id: 'review-selin-2',
        reviewer: {
          id: 'reviewer-naz',
          displayName: 'Naz Çelik',
          avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-review-naz',
        },
        rating: 5,
        comment:
          'Konaklama ve rota konusunda çok düzenliydi. Ortak karar almaya önem vermesi harikaydı.',
        createdAt: '2026-05-29T20:10:00.000Z',
      },
      {
        id: 'review-selin-3',
        reviewer: {
          id: 'reviewer-irem',
          displayName: 'İrem Ay',
          avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-review-irem',
        },
        rating: 4,
        comment: 'İletişimi ve zamanlaması iyiydi. Bir sonraki şehir gezisinde yine eşleşebilirim.',
        createdAt: '2026-01-31T13:50:00.000Z',
      },
    ],
  }),
  createTravelPlan({
    id: 'travel-antalya-fethiye',
    traveler: {
      id: 'traveler-arda',
      displayName: 'Arda Keskin',
      username: 'ardadogaya',
      avatarUrl: 'https://i.pravatar.cc/200?u=urbanly-travel-arda',
      age: 33,
      verified: false,
      bio: 'Kamp deneyimi olan, kıyı yürüyüşlerini ve sessiz koyları seven bir yazılım geliştiricisiyim.',
    },
    origin: 'Antalya',
    destination: 'Fethiye, Muğla',
    departureAt: '2026-09-19T05:00:00.000Z',
    transportPreference: 'Şehirlerarası otobüs',
    description:
      'Fethiye’den başlayıp Kabak ve Faralya çevresinde dört günlük doğa ağırlıklı bir rota düşünüyorum. Temel kamp deneyimi olan bir yol arkadaşı arıyorum.',
    interests: ['Kamp', 'Doğa yürüyüşü', 'Sessiz koylar'],
    maxCompanions: 2,
    joinedCount: 1,
    completedTripCount: 3,
    reviews: [
      {
        id: 'review-arda-1',
        reviewer: {
          id: 'reviewer-ayse',
          displayName: 'Ayşe Karaca',
          avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-review-ayse',
        },
        rating: 5,
        comment:
          'Kamp konusunda deneyimli ve sorumluluk sahibiydi. Rota boyunca kendimi güvende hissettim.',
        createdAt: '2026-06-25T15:35:00.000Z',
      },
      {
        id: 'review-arda-2',
        reviewer: {
          id: 'reviewer-emre',
          displayName: 'Emre Şen',
          avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-review-emre',
        },
        rating: 4,
        comment:
          'Parkur bilgisini paylaşması çok faydalıydı. Tempoyu ekipçe ayarladık ve güzel anılar biriktirdik.',
        createdAt: '2026-03-16T08:30:00.000Z',
      },
    ],
  }),
  createTravelPlan({
    id: 'travel-trabzon-ayder',
    traveler: {
      id: 'traveler-zeynep',
      displayName: 'Zeynep Yıldız',
      username: 'zeynepyaylada',
      avatarUrl: 'https://i.pravatar.cc/200?u=urbanly-travel-zeynep',
      age: 36,
      verified: true,
      bio: 'Karadeniz kültürüne, yerel mutfağa ve sisli yayla yürüyüşlerine meraklı bir öğretmenim.',
    },
    origin: 'Trabzon',
    destination: 'Ayder Yaylası, Rize',
    departureAt: '2026-10-02T06:00:00.000Z',
    returnAt: '2026-10-04T14:30:00.000Z',
    transportPreference: 'Otobüs + yerel minibüs',
    description:
      'Ayder’i merkez alıp çevre yaylalarda kısa yürüyüşler yapmak ve yöresel yemekleri denemek istiyorum. Yağmura hazırlıklı, sohbeti seven biriyle gezmek güzel olur.',
    interests: ['Yayla yürüyüşü', 'Yerel mutfak', 'Kültür'],
    maxCompanions: 3,
    joinedCount: 1,
    completedTripCount: 6,
    reviews: [
      {
        id: 'review-zeynep-1',
        reviewer: {
          id: 'reviewer-pelin',
          displayName: 'Pelin Acar',
          avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-review-pelin',
        },
        rating: 5,
        comment:
          'Yöreyi çok iyi araştırmıştı; hem kültürü anlattı hem de grubun rahatlığına özen gösterdi.',
        createdAt: '2026-07-11T19:00:00.000Z',
      },
      {
        id: 'review-zeynep-2',
        reviewer: {
          id: 'reviewer-tolga',
          displayName: 'Tolga Öz',
          avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-review-tolga',
        },
        rating: 5,
        comment:
          'Her ayrıntıyı önceden paylaştı ve hava değişince hızlıca güzel bir alternatif plan hazırladı.',
        createdAt: '2026-05-06T16:25:00.000Z',
      },
      {
        id: 'review-zeynep-3',
        reviewer: {
          id: 'reviewer-gizem',
          displayName: 'Gizem Akın',
          avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-review-gizem',
        },
        rating: 5,
        comment:
          'Sakin, paylaşımcı ve güvenilir bir yol arkadaşı. Yeniden birlikte seyahat etmek isterim.',
        createdAt: '2026-02-21T10:10:00.000Z',
      },
    ],
  }),
];

export function getTravelPlanById(planId: string): TravelPlan | undefined {
  return MOCK_TRAVEL_PLANS.find((plan) => plan.id === planId);
}
