import type { Place } from '@urbanly/shared';
import { MOCK_PLACES } from '../map/data/mockPlaces';

export interface CommunityUser {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  bio: string;
  followerCount: number;
  mutualFriendCount: number;
  isFollowedByViewer: boolean;
}

export interface CommunityCommentAuthor {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  author: CommunityCommentAuthor;
  body: string;
  createdAt: string;
}

const COMMUNITY_USERS_BY_KEY = {
  defne: {
    id: 'u-defne',
    displayName: 'Defne Kaya',
    username: 'defnekesfeder',
    avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-defne',
    bio: 'İstanbul’un fotojenik sokaklarını ve sakin sabah rotalarını keşfediyorum.',
    followerCount: 1240,
    mutualFriendCount: 8,
    isFollowedByViewer: true,
  },
  mert: {
    id: 'u-mert',
    displayName: 'Mert Yılmaz',
    username: 'mertsehirde',
    avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-mert',
    bio: 'Çalışma dostu kafeler, iyi kahve ve şehirde verimli mola noktaları.',
    followerCount: 860,
    mutualFriendCount: 3,
    isFollowedByViewer: false,
  },
  ece: {
    id: 'u-ece',
    displayName: 'Ece Aydın',
    username: 'eceyleistanbul',
    avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-ece',
    bio: 'Parklar, yürüyüş rotaları ve şehirde nefes alacak yeşil alanlar.',
    followerCount: 2140,
    mutualFriendCount: 12,
    isFollowedByViewer: true,
  },
  can: {
    id: 'u-can',
    displayName: 'Can Acar',
    username: 'sokakarasicann',
    avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-can',
    bio: 'Sokak sanatı, muraller ve ara sokaklarda saklı kalmış hikâyeler.',
    followerCount: 675,
    mutualFriendCount: 5,
    isFollowedByViewer: false,
  },
} as const satisfies Record<string, CommunityUser>;

type CommunityUserKey = keyof typeof COMMUNITY_USERS_BY_KEY;

export const COMMUNITY_USERS: CommunityUser[] = Object.values(COMMUNITY_USERS_BY_KEY);

export const CURRENT_USER: CommunityCommentAuthor = {
  id: 'u-current',
  displayName: 'Sen',
  username: 'urbanly_user',
  avatarUrl: 'https://i.pravatar.cc/160?u=urbanly-current',
};

export const INITIAL_FOLLOWED_USER_IDS: string[] = COMMUNITY_USERS.filter(
  (user) => user.isFollowedByViewer,
).map((user) => user.id);

interface CommunityPost {
  id: string;
  authorKey: CommunityUserKey;
  placeId: string;
  body: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

const COMMUNITY_POSTS = [
  {
    id: 'post-balat-sabah',
    authorKey: 'defne',
    placeId: 'p6',
    body: 'Balat Renkli Evler’e sabah 08.00’de geldim. Sokaklar sakinken fotoğraf çekmek çok daha keyifli; ışık da tam cephelere vuruyor.',
    createdAt: '2026-08-07T10:40:00.000Z',
    likeCount: 84,
    commentCount: 12,
  },
  {
    id: 'post-karakoy-calisma',
    authorKey: 'mert',
    placeId: 'p1',
    body: 'Karaköy Kahvecisi bugün çalışma durağım oldu. Wi-Fi hızlı, priz bulmak kolay; öğleden önce ortam oldukça sakin.',
    createdAt: '2026-08-07T08:15:00.000Z',
    likeCount: 46,
    commentCount: 7,
  },
  {
    id: 'post-gulhane-yuruyus',
    authorKey: 'ece',
    placeId: 'p4',
    body: 'Gülhane Parkı’nda akşamüstü yürüyüşü için saray duvarı tarafındaki gölgeli yolu seçin. Şehrin ortasında kısa bir mola gibi.',
    createdAt: '2026-08-06T16:30:00.000Z',
    likeCount: 121,
    commentCount: 18,
  },
  {
    id: 'post-yeldegirmeni-mural',
    authorKey: 'can',
    placeId: 'p5',
    body: 'Yeldeğirmeni Muralleri rotasına Karakolhane Caddesi’nden başladım. Yeni işler eskileriyle yan yana; her köşede başka bir detay var.',
    createdAt: '2026-08-06T12:05:00.000Z',
    likeCount: 63,
    commentCount: 9,
  },
] as const satisfies ReadonlyArray<CommunityPost>;

export interface CommunityFeedItem extends CommunityPost {
  author: CommunityUser;
  place: Place;
}

const placesById = new Map(MOCK_PLACES.map((place) => [place.id, place]));

/** Mock ilişkilerini tek yerde çözer; bozuk user/place referansı uygulama açılırken görünür olur. */
function resolvePost(post: CommunityPost): CommunityFeedItem {
  const author = COMMUNITY_USERS_BY_KEY[post.authorKey];
  const place = placesById.get(post.placeId);

  if (!place) {
    throw new Error(`Topluluk mock verisinde mekân bulunamadı: ${post.placeId}`);
  }

  return { ...post, author, place };
}

export const COMMUNITY_FEED_ITEMS: CommunityFeedItem[] = COMMUNITY_POSTS.map(resolvePost);

export const MOCK_COMMENTS_BY_POST_ID: Readonly<Record<string, ReadonlyArray<CommunityComment>>> = {
  'post-balat-sabah': [
    {
      id: 'comment-balat-1',
      postId: 'post-balat-sabah',
      author: COMMUNITY_USERS_BY_KEY.mert,
      body: 'Sabah ışığı için harika öneri. Hafta sonu daha da erken gitmek gerekiyor.',
      createdAt: '2026-08-07T11:05:00.000Z',
    },
    {
      id: 'comment-balat-2',
      postId: 'post-balat-sabah',
      author: COMMUNITY_USERS_BY_KEY.ece,
      body: 'Renkli evlerden sonra sahile yürümek de çok güzel oluyor.',
      createdAt: '2026-08-07T11:22:00.000Z',
    },
  ],
  'post-karakoy-calisma': [
    {
      id: 'comment-karakoy-1',
      postId: 'post-karakoy-calisma',
      author: COMMUNITY_USERS_BY_KEY.defne,
      body: 'Pencere kenarındaki masalar sabah gerçekten çok sakin.',
      createdAt: '2026-08-07T09:10:00.000Z',
    },
  ],
  'post-gulhane-yuruyus': [
    {
      id: 'comment-gulhane-1',
      postId: 'post-gulhane-yuruyus',
      author: COMMUNITY_USERS_BY_KEY.can,
      body: 'Hafta içi akşamüstü rotası için kaydettim.',
      createdAt: '2026-08-06T17:15:00.000Z',
    },
  ],
  'post-yeldegirmeni-mural': [
    {
      id: 'comment-yeldegirmeni-1',
      postId: 'post-yeldegirmeni-mural',
      author: COMMUNITY_USERS_BY_KEY.defne,
      body: 'Yeni murallerin konumlarını da listeye ekleyebilir misin?',
      createdAt: '2026-08-06T13:20:00.000Z',
    },
  ],
};
