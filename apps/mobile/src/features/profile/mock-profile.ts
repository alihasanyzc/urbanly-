export interface ProfileCommentAuthor {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
}

export interface ProfileComment {
  id: string;
  author: ProfileCommentAuthor;
  body: string;
  publishedAt: string;
  postcardTitle: string;
}

/** Profil sahibinin kartpostallarına diğer kullanıcıların bıraktığı örnek yorumlar. */
export const PROFILE_COMMENTS = [
  {
    id: 'profile-comment-defne',
    author: {
      id: 'u-defne',
      displayName: 'Defne Kaya',
      username: 'defnekesfeder',
      avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-defne',
    },
    body: 'Sabah ışığı önerini denedim; Balat’ı kalabalık başlamadan gezmek gerçekten bambaşkaymış.',
    publishedAt: '3 gün önce',
    postcardTitle: 'Balat’ta sabah ışığı',
  },
  {
    id: 'profile-comment-mert',
    author: {
      id: 'u-mert',
      displayName: 'Mert Yılmaz',
      username: 'mertsehirde',
      avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-mert',
    },
    body: 'Kısa ama çok işe yarayan rota notları olmuş. Özellikle gün batımı saatini belirtmen planımı kolaylaştırdı.',
    publishedAt: '5 gün önce',
    postcardTitle: 'Haliç üzerinde gün batımı',
  },
  {
    id: 'profile-comment-ece',
    author: {
      id: 'u-ece',
      displayName: 'Ece Aydın',
      username: 'eceyleistanbul',
      avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-ece',
    },
    body: 'Paylaştığın sakin şehir rotalarını kaydediyorum. Fotoğrafların kadar mekân detayların da çok özenli.',
    publishedAt: '1 hafta önce',
    postcardTitle: 'Profil yorumu',
  },
] as const satisfies ReadonlyArray<ProfileComment>;
