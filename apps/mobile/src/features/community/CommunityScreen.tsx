import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { matchesSearchQuery } from '../../lib/search';
import type { RootStackParamList, TabParamList } from '../../navigation/RootNavigator';
import { TAB_BAR_SPACE } from '../../navigation/tabBarLayout';
import { useSocialStore } from '../../store/social-store';
import { theme } from '../../theme';
import { CommunityPostCard } from './community-post-card';
import { COMMUNITY_FEED_ITEMS, type CommunityFeedItem } from './mock-community';

type CommunityTab = 'feed' | 'following';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Topluluk'>,
  NativeStackScreenProps<RootStackParamList>
>;

const TABS: ReadonlyArray<{ id: CommunityTab; label: string }> = [
  { id: 'feed', label: 'Akış' },
  { id: 'following', label: 'Takip Ettiklerin' },
];

/** Topluluk — genel keşif akışı ve takip edilen kullanıcıların paylaşımları. */
export function CommunityScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<CommunityTab>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPostIds, setLikedPostIds] = useState<ReadonlySet<string>>(() => new Set());
  const [savedPostIds, setSavedPostIds] = useState<ReadonlySet<string>>(() => new Set());
  const followedUserIds = useSocialStore((state) => state.followedUserIds);

  const posts = useMemo(() => {
    return COMMUNITY_FEED_ITEMS.filter((post) => {
      if (activeTab === 'following' && !followedUserIds.has(post.author.id)) return false;
      return matchesSearchQuery(
        [
          post.body,
          post.author.displayName,
          post.author.username,
          `@${post.author.username}`,
          post.place.name,
        ],
        searchQuery,
      );
    });
  }, [activeTab, followedUserIds, searchQuery]);

  const togglePost = (
    postId: string,
    setPostIds: React.Dispatch<React.SetStateAction<ReadonlySet<string>>>,
  ) => {
    setPostIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (nextIds.has(postId)) nextIds.delete(postId);
      else nextIds.add(postId);
      return nextIds;
    });
  };

  const renderPost = ({ item }: { item: CommunityFeedItem }) => (
    <CommunityPostCard
      item={item}
      isAuthorFollowed={followedUserIds.has(item.author.id)}
      isLiked={likedPostIds.has(item.id)}
      isSaved={savedPostIds.has(item.id)}
      onToggleLike={() => togglePost(item.id, setLikedPostIds)}
      onToggleSave={() => togglePost(item.id, setSavedPostIds)}
      onOpenComments={() => navigation.navigate('PostComments', { postId: item.id })}
    />
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={theme.colors.muted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Toplulukta ara"
            placeholder="Toplulukta ara"
            placeholderTextColor={theme.colors.muted}
            returnKeyType="search"
            autoCapitalize="none"
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Aramayı temizle"
              onPress={() => setSearchQuery('')}
              hitSlop={8}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={19} color={theme.colors.muted} />
            </Pressable>
          )}
        </View>
      </View>

      <View accessibilityRole="tablist" style={styles.tabs}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              accessibilityRole="tab"
              accessibilityLabel={`${tab.label} sekmesi`}
              accessibilityState={{ selected: isActive }}
              onPress={() => setActiveTab(tab.id)}
              style={styles.tab}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
              {isActive && <View style={styles.activeIndicator} />}
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={posts}
        keyExtractor={(post) => post.id}
        renderItem={renderPost}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + TAB_BAR_SPACE + theme.spacing(3) },
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name={searchQuery ? 'search-outline' : 'people-outline'}
              size={34}
              color={theme.colors.muted}
            />
            <Text selectable style={styles.emptyTitle}>
              {searchQuery ? 'Sonuç bulunamadı' : 'Henüz paylaşım yok'}
            </Text>
            <Text selectable style={styles.emptyText}>
              {searchQuery
                ? `“${searchQuery}” aramasıyla eşleşen paylaşım yok.`
                : 'Takip ettiğin kişilerin yeni keşifleri burada görünür.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },
  searchSection: {
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(2),
    backgroundColor: theme.colors.bg,
  },
  searchBox: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingHorizontal: theme.spacing(3),
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
  },
  searchInput: {
    flex: 1,
    minHeight: 46,
    paddingVertical: 0,
    fontSize: 15,
    color: theme.colors.text,
  },
  clearButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    minHeight: 52,
    flexDirection: 'row',
    backgroundColor: theme.colors.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing(2),
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.muted,
    textAlign: 'center',
  },
  tabLabelActive: { color: theme.colors.text, fontWeight: '700' },
  activeIndicator: {
    position: 'absolute',
    right: theme.spacing(4),
    bottom: 0,
    left: theme.spacing(4),
    height: 3,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  content: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    paddingHorizontal: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  separator: { height: theme.spacing(3) },
  emptyState: {
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    paddingHorizontal: theme.spacing(8),
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: theme.colors.text },
  emptyText: { fontSize: 14, lineHeight: 20, color: theme.colors.muted, textAlign: 'center' },
});
