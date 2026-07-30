import type { TripAuthor, TripListing } from '../types';

/**
 * Frontend geliştirme için sahte ilan verisi.
 * Backend hazır olunca `fetchListings` / `createListing` ile değiştirilecek.
 */

/** İlan verirken kullanılan aktif kullanıcı (mock — auth bağlanınca gerçeğiyle değişir). */
export const MOCK_CURRENT_USER: TripAuthor = {
  id: 'u_me',
  name: 'Sen',
  avatarUrl: 'https://i.pravatar.cc/150?img=12',
  rating: 4.9,
};

export const MOCK_LISTINGS: TripListing[] = [
  {
    id: 'trip1',
    author: { id: 'u1', name: 'Elif Kaya', avatarUrl: 'https://i.pravatar.cc/150?img=45', rating: 4.8 },
    category: 'buddy',
    from: 'Beşiktaş',
    to: 'Sarıyer',
    departAt: '2026-07-31T10:00:00.000Z',
    note: 'Sahil boyu yürüyüş + kahvaltı planlıyorum. Sakin tempoda eşlik edecek biri olsa süper.',
    createdAt: '2026-07-30T08:00:00.000Z',
  },
  {
    id: 'trip2',
    author: { id: 'u2', name: 'Mert Demir', avatarUrl: 'https://i.pravatar.cc/150?img=15', rating: 4.6 },
    category: 'passenger',
    from: 'Kadıköy',
    to: 'Beyoğlu',
    departAt: '2026-07-30T18:30:00.000Z',
    note: 'Akşam 18:30 Kadıköy’den Beyoğlu’na geçiyorum, aracımda 2 boş koltuk var. Masraf paylaşımlı.',
    createdAt: '2026-07-30T09:10:00.000Z',
  },
  {
    id: 'trip3',
    author: { id: 'u3', name: 'Zeynep Ateş', avatarUrl: 'https://i.pravatar.cc/150?img=32', rating: 5.0 },
    category: 'buddy',
    from: 'Fatih',
    to: 'Eyüpsultan',
    departAt: '2026-08-01T09:00:00.000Z',
    note: 'Tarihi yarımada + Pierre Loti rotası. Fotoğraf çekmeyi seven biri olursa keyifli olur.',
    createdAt: '2026-07-30T07:30:00.000Z',
  },
  {
    id: 'trip4',
    author: { id: 'u4', name: 'Can Yılmaz', avatarUrl: 'https://i.pravatar.cc/150?img=8', rating: 4.3 },
    category: 'passenger',
    from: 'Üsküdar',
    to: 'Maltepe',
    departAt: '2026-07-31T07:45:00.000Z',
    note: 'Her sabah Üsküdar–Maltepe güzergâhındayım, konforlu araç, 1 boş koltuk. Düzenli yolcu olabilir.',
    createdAt: '2026-07-29T20:00:00.000Z',
  },
  {
    id: 'trip5',
    author: { id: 'u5', name: 'Derya Şahin', avatarUrl: 'https://i.pravatar.cc/150?img=20', rating: 4.7 },
    category: 'buddy',
    from: 'Beşiktaş',
    to: 'Kadıköy',
    departAt: '2026-08-02T12:00:00.000Z',
    note: 'Vapurla karşıya geçip Moda’da gezelim. Yeni tanışmalara açığım.',
    createdAt: '2026-07-30T10:15:00.000Z',
  },
];
