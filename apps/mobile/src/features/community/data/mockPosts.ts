import type { CommunityAuthor, CommunityPost } from '../types';

/**
 * Frontend geliştirme için sahte topluluk verisi.
 * Backend hazır olunca `fetchPosts` / `createPost` ile değiştirilecek; şimdilik akışı besler.
 */

/** Paylaşım yaparken kullanılan aktif kullanıcı (mock — auth bağlanınca gerçeğiyle değişir). */
export const MOCK_CURRENT_USER: CommunityAuthor = {
  id: 'u_me',
  name: 'Sen',
  avatarUrl: 'https://i.pravatar.cc/150?img=12',
};

/** Aktif kullanıcının takip ettiği yazar id'leri — "Takip Ettiklerin" sekmesini besler. */
export const MOCK_FOLLOWING_IDS: string[] = ['u2', 'u4'];

export const MOCK_POSTS: CommunityPost[] = [
  {
    id: 'post1',
    author: { id: 'u1', name: 'Elif Kaya', avatarUrl: 'https://i.pravatar.cc/150?img=45' },
    text: 'Karaköy Kahvecisi’nde bütün sabahı çalışarak geçirdim, priz ve wifi sorunsuz. Boğaz esintisi bonus. ☕',
    createdAt: '2026-07-29T07:20:00.000Z',
    location: { city: 'İstanbul', district: 'Beyoğlu' },
    likeCount: 24,
    liked: false,
    saved: false,
    placeId: 'p1',
    comments: [
      {
        id: 'c1',
        author: { id: 'u2', name: 'Mert Demir', avatarUrl: 'https://i.pravatar.cc/150?img=15' },
        text: 'Fiyatlar nasıl, öğrenci bütçesine uygun mu?',
        createdAt: '2026-07-29T08:00:00.000Z',
      },
    ],
  },
  {
    id: 'post2',
    author: { id: 'u2', name: 'Mert Demir', avatarUrl: 'https://i.pravatar.cc/150?img=15' },
    text: 'Gün batımını Pierre Loti’den izlemek gibisi yok. Teleferik kuyruğu için erken gidin derim.',
    createdAt: '2026-07-28T17:05:00.000Z',
    location: { city: 'İstanbul', district: 'Eyüpsultan' },
    likeCount: 41,
    liked: true,
    saved: false,
    placeId: 'p3',
    comments: [],
  },
  {
    id: 'post3',
    author: { id: 'u3', name: 'Zeynep Ateş', avatarUrl: 'https://i.pravatar.cc/150?img=32' },
    text: 'Hafta sonu için sakin, kalabalık olmayan bir kahvaltı mekânı önerisi olan? Kadıköy tarafı olsa harika.',
    createdAt: '2026-07-28T09:40:00.000Z',
    location: { city: 'İstanbul', district: 'Kadıköy' },
    likeCount: 8,
    liked: false,
    saved: false,
    comments: [
      {
        id: 'c2',
        author: { id: 'u4', name: 'Can Yılmaz', avatarUrl: 'https://i.pravatar.cc/150?img=8' },
        text: 'Moda sahiline yakın küçük bir yer biliyorum, DM atarım.',
        createdAt: '2026-07-28T10:10:00.000Z',
      },
      {
        id: 'c3',
        author: { id: 'u1', name: 'Elif Kaya', avatarUrl: 'https://i.pravatar.cc/150?img=45' },
        text: 'Yeldeğirmeni tarafı da çok keyifli oldu geçen hafta.',
        createdAt: '2026-07-28T11:30:00.000Z',
      },
    ],
  },
  {
    id: 'post4',
    author: { id: 'u4', name: 'Can Yılmaz', avatarUrl: 'https://i.pravatar.cc/150?img=8' },
    text: 'Balat’ın renkli sokaklarında sabah erken çektiğim kareler bambaşka oldu. Işık için 08:00 öncesi ideal.',
    createdAt: '2026-07-27T06:15:00.000Z',
    location: { city: 'İstanbul', district: 'Fatih' },
    likeCount: 57,
    liked: false,
    saved: false,
    placeId: 'p6',
    comments: [],
  },
];
