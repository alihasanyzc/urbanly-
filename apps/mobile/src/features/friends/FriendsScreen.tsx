import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COMMUNITY_USERS, type CommunityUser } from '../community/mock-community';
import { matchesSearchQuery } from '../../lib/search';
import { TAB_BAR_SPACE } from '../../navigation/tabBarLayout';
import { useSocialStore } from '../../store/social-store';
import { theme } from '../../theme';

/** Twitter benzeri kişi arama, kullanıcı keşfetme ve takip yönetimi. */
export function FriendsScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const followedUserIds = useSocialStore((state) => state.followedUserIds);
  const toggleFollow = useSocialStore((state) => state.toggleFollow);

  const users = useMemo(() => {
    return COMMUNITY_USERS.filter((user) =>
      matchesSearchQuery(
        [user.displayName, user.username, `@${user.username}`, user.bio],
        searchQuery,
      ),
    );
  }, [searchQuery]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={theme.colors.muted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Arkadaş ara"
            placeholder="Ad veya kullanıcı adı ara"
            placeholderTextColor={theme.colors.muted}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
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

      <FlatList
        data={users}
        keyExtractor={(user) => user.id}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_SPACE }}
        ListHeaderComponent={
          <View style={styles.listTitleRow}>
            <Text style={styles.listTitle}>
              {searchQuery ? 'Arama sonuçları' : 'Önerilen kişiler'}
            </Text>
            <Text style={styles.resultCount}>{users.length}</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <UserResultRow
            user={item}
            isFollowing={followedUserIds.has(item.id)}
            onToggleFollow={() => toggleFollow(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="person-outline" size={36} color={theme.colors.muted} />
            <Text selectable style={styles.emptyTitle}>
              Kişi bulunamadı
            </Text>
            <Text selectable style={styles.emptyText}>
              “{searchQuery}” aramasıyla eşleşen bir kullanıcı yok.
            </Text>
          </View>
        }
      />
    </View>
  );
}

function UserResultRow({
  user,
  isFollowing,
  onToggleFollow,
}: {
  user: CommunityUser;
  isFollowing: boolean;
  onToggleFollow: () => void;
}) {
  return (
    <View style={styles.userRow}>
      <Image
        source={{ uri: user.avatarUrl }}
        accessibilityLabel={`${user.displayName} profil fotoğrafı`}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <View style={styles.userTopRow}>
          <View style={styles.identity}>
            <Text selectable style={styles.displayName} numberOfLines={1}>
              {user.displayName}
            </Text>
            <Text style={styles.username} numberOfLines={1}>
              @{user.username}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isFollowing
                ? `${user.displayName} takibini bırak`
                : `${user.displayName} kullanıcısını takip et`
            }
            accessibilityState={{ selected: isFollowing }}
            onPress={onToggleFollow}
            style={({ pressed }) => [
              styles.followButton,
              isFollowing && styles.followingButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
              {isFollowing ? 'Takiptesin' : 'Takip et'}
            </Text>
          </Pressable>
        </View>
        <Text selectable style={styles.bio}>
          {user.bio}
        </Text>
        <Text style={styles.socialProof}>
          {formatCount(user.followerCount)} takipçi · {user.mutualFriendCount} ortak arkadaş
        </Text>
      </View>
    </View>
  );
}

function formatCount(count: number): string {
  if (count < 1000) return String(count);
  const compactCount = Math.round(count / 100) / 10;
  return `${String(compactCount).replace('.', ',')} B`;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  header: {
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(2),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
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
  clearButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  listTitleRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingHorizontal: theme.spacing(4),
  },
  listTitle: { fontSize: 17, fontWeight: '800', color: theme.colors.text },
  resultCount: {
    minWidth: 24,
    paddingHorizontal: 7,
    paddingVertical: 3,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: '#eff6ff',
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 82,
    backgroundColor: theme.colors.border,
  },
  userRow: {
    minHeight: 138,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing(3),
    paddingHorizontal: theme.spacing(4),
    paddingVertical: theme.spacing(3),
  },
  avatar: { width: 54, height: 54, borderRadius: 999, backgroundColor: theme.colors.border },
  userInfo: { flex: 1, minWidth: 0, gap: theme.spacing(2) },
  userTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing(2) },
  identity: { flex: 1, minWidth: 0 },
  displayName: { fontSize: 15, fontWeight: '800', color: theme.colors.text },
  username: { paddingTop: 2, fontSize: 13, color: theme.colors.muted },
  followButton: {
    minWidth: 88,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing(3),
    borderRadius: 999,
    backgroundColor: theme.colors.text,
  },
  followingButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  followButtonText: { fontSize: 13, fontWeight: '800', color: '#ffffff' },
  followingButtonText: { color: theme.colors.text },
  buttonPressed: { opacity: 0.75 },
  bio: { fontSize: 14, lineHeight: 19, color: theme.colors.text },
  socialProof: { fontSize: 12, color: theme.colors.muted, fontVariant: ['tabular-nums'] },
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
