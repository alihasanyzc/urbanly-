import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList, TabParamList } from '../../../navigation/RootNavigator';
import { TAB_BAR_SPACE } from '../../../navigation/tabBarLayout';
import { MOCK_PLACES } from '../../map';
import { theme } from '../../../theme';
import { CommentsSheet } from '../components/CommentsSheet';
import { CommunitySearchBar } from '../components/CommunitySearchBar';
import { CommunityTabs } from '../components/CommunityTabs';
import { PostCard } from '../components/PostCard';
import { PostComposer } from '../components/PostComposer';
import { DEFAULT_CITY, DEFAULT_USER_DISTRICT } from '../data/locations';
import { MOCK_CURRENT_USER, MOCK_FOLLOWING_IDS, MOCK_POSTS } from '../data/mockPosts';
import type { CommunityComment, CommunityPost, CommunityTab } from '../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Topluluk'>,
  NativeStackScreenProps<RootStackParamList>
>;

const FOLLOWING = new Set(MOCK_FOLLOWING_IDS);

/**
 * Topluluk sekmesi — Twitter benzeri: "Akış" (tüm paylaşımlar) ve "Takip Ettiklerin"
 * (takip edilen yazarlar + kendi paylaşımların) sekmeleri. Üstteki arama kutusu aktif
 * sekmeyi kelimeye göre daraltır. Sağ üstten yazı paylaşılır, her posta yorum/beğeni/kaydet.
 *
 * Backend yok: paylaşım/beğeni/yorum yerel state'te tutulur (bkz. CLAUDE.md §1.2 — içerik mock).
 */
export function CommunityScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_POSTS);
  const [composerOpen, setComposerOpen] = useState(false);
  const [tab, setTab] = useState<CommunityTab>('feed');
  const [query, setQuery] = useState('');
  const [commentPostId, setCommentPostId] = useState<string | null>(null);

  // placeId → mekân adı: kart rozeti + aramada mekân eşleşmesi için.
  const placeNameById = useMemo(
    () => new Map(MOCK_PLACES.map((p) => [p.id, p.name])),
    [],
  );

  // Görünen akış: sekme (takip filtresi) + arama sorgusu birlikte uygulanır.
  const visiblePosts = useMemo(() => {
    const base =
      tab === 'following'
        ? posts.filter((p) => FOLLOWING.has(p.author.id) || p.author.id === MOCK_CURRENT_USER.id)
        : posts;

    const q = query.trim().toLocaleLowerCase('tr');
    if (!q) return base;

    return base.filter((p) => {
      const placeName = p.placeId ? placeNameById.get(p.placeId) ?? '' : '';
      const haystack = `${p.text} ${p.author.name} ${p.location.district} ${placeName}`.toLocaleLowerCase('tr');
      return haystack.includes(q);
    });
  }, [posts, tab, query, placeNameById]);

  const commentPost = commentPostId
    ? posts.find((p) => p.id === commentPostId) ?? null
    : null;

  const openPlace = useCallback(
    (placeId: string) => navigation.navigate('PlaceDetail', { placeId }),
    [navigation],
  );

  const toggleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likeCount: p.likeCount + (p.liked ? -1 : 1) }
          : p,
      ),
    );
  }, []);

  const toggleSave = useCallback((postId: string) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, saved: !p.saved } : p)));
  }, []);

  const addComment = useCallback((postId: string, text: string) => {
    const comment: CommunityComment = {
      id: `c_${Date.now()}`,
      author: MOCK_CURRENT_USER,
      text,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, comment] } : p)),
    );
  }, []);

  const addPost = useCallback((text: string) => {
    const post: CommunityPost = {
      id: `post_${Date.now()}`,
      author: MOCK_CURRENT_USER,
      text,
      createdAt: new Date().toISOString(),
      location: { city: DEFAULT_CITY, district: DEFAULT_USER_DISTRICT },
      likeCount: 0,
      liked: false,
      saved: false,
      comments: [],
    };
    setPosts((prev) => [post, ...prev]);
    setComposerOpen(false);
  }, []);

  const emptyMessage = query.trim()
    ? `“${query.trim()}” ile eşleşen paylaşım yok.`
    : tab === 'following'
      ? 'Takip ettiklerinden henüz paylaşım yok.'
      : 'Henüz paylaşım yok.';

  return (
    <>
      <FlatList
        style={styles.root}
        data={visiblePosts}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ paddingBottom: TAB_BAR_SPACE }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: insets.top + theme.spacing(2) }]}>
            {/* Başlık solda, Paylaş aksiyonu sağ üstte. */}
            <View style={styles.titleRow}>
              <Text style={styles.title}>Topluluk</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={composerOpen ? 'Paylaşımı kapat' : 'Paylaş'}
                accessibilityState={{ expanded: composerOpen }}
                onPress={() => setComposerOpen((v) => !v)}
                style={({ pressed }) => [styles.shareBtn, pressed && styles.shareBtnPressed]}
              >
                <Ionicons
                  name={composerOpen ? 'close' : 'create-outline'}
                  size={16}
                  color="#ffffff"
                />
                <Text style={styles.shareBtnText}>{composerOpen ? 'Kapat' : 'Paylaş'}</Text>
              </Pressable>
            </View>

            {composerOpen && <PostComposer onSubmit={addPost} autoFocus />}

            <CommunitySearchBar value={query} onChangeText={setQuery} />
            <CommunityTabs value={tab} onChange={setTab} />
          </View>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            placeName={item.placeId ? placeNameById.get(item.placeId) : undefined}
            onToggleLike={toggleLike}
            onToggleSave={toggleSave}
            onPressComment={setCommentPostId}
            onPressPlace={openPlace}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={40} color={theme.colors.muted} />
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <CommentsSheet
        post={commentPost}
        onClose={() => setCommentPostId(null)}
        onSubmit={addComment}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  header: { gap: theme.spacing(3), paddingBottom: theme.spacing(3) },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing(4),
  },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.text },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
    paddingHorizontal: theme.spacing(4),
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  shareBtnPressed: { opacity: 0.85 },
  shareBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  separator: { height: theme.spacing(3) },
  empty: {
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(12),
    paddingHorizontal: theme.spacing(6),
  },
  emptyText: { fontSize: 15, fontWeight: '600', color: theme.colors.text, textAlign: 'center' },
});
