import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCommunityStore } from '../../store/community-store';
import { theme } from '../../theme';
import type { CommunityFeedItem } from './mock-community';

interface Props {
  item: CommunityFeedItem;
  isAuthorFollowed: boolean;
  isLiked: boolean;
  isSaved: boolean;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onOpenComments: () => void;
}

/** Topluluk akışındaki kullanıcı + mekân ilişkili paylaşım kartı. */
export function CommunityPostCard({
  item,
  isAuthorFollowed,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
  onOpenComments,
}: Props) {
  const { author, place } = item;
  const visibleLikeCount = item.likeCount + (isLiked ? 1 : 0);
  const addedCommentCount = useCommunityStore(
    (state) => state.addedCommentCountsByPostId[item.id] ?? 0,
  );
  const visibleCommentCount = item.commentCount + addedCommentCount;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{ uri: author.avatarUrl }}
          accessibilityLabel={`${author.displayName} profil fotoğrafı`}
          style={styles.avatar}
        />
        <View style={styles.authorInfo}>
          <View style={styles.nameRow}>
            <Text selectable style={styles.authorName} numberOfLines={1}>
              {author.displayName}
            </Text>
            {isAuthorFollowed && <View style={styles.followingDot} />}
          </View>
          <Text style={styles.metadata} numberOfLines={1}>
            @{author.username} · {formatRelativeTime(item.createdAt)}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${author.displayName} paylaşımı için seçenekler`}
          hitSlop={8}
          style={styles.moreButton}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.muted} />
        </Pressable>
      </View>

      <Text selectable style={styles.body}>
        {item.body}
      </Text>

      <View style={styles.placeRow}>
        <Ionicons name="location" size={16} color={theme.colors.primary} />
        <Text selectable style={styles.placeName} numberOfLines={1}>
          {place.name}
        </Text>
      </View>

      {place.imageUrl && (
        <Image
          source={{ uri: place.imageUrl }}
          accessibilityLabel={`${place.name} görseli`}
          resizeMode="cover"
          style={styles.placeImage}
        />
      )}

      <View style={styles.actions}>
        <ActionButton
          icon={isLiked ? 'heart' : 'heart-outline'}
          label={`${visibleLikeCount} beğeni`}
          isActive={isLiked}
          onPress={onToggleLike}
        />
        <ActionButton
          icon="chatbubble-outline"
          label={`${visibleCommentCount} yorum`}
          onPress={onOpenComments}
        />
        <View style={styles.actionSpacer} />
        <ActionButton
          icon={isSaved ? 'bookmark' : 'bookmark-outline'}
          label={isSaved ? 'Kaydedildi' : 'Kaydet'}
          isActive={isSaved}
          onPress={onToggleSave}
          iconOnly
        />
      </View>
    </View>
  );
}

interface ActionButtonProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  isActive?: boolean;
  onPress?: () => void;
  iconOnly?: boolean;
}

function ActionButton({
  icon,
  label,
  isActive = false,
  onPress,
  iconOnly = false,
}: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={isActive ? { selected: true } : undefined}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
    >
      <Ionicons
        name={icon}
        size={21}
        color={isActive ? theme.colors.primary : theme.colors.muted}
      />
      {!iconOnly && (
        <Text style={[styles.actionLabel, isActive && styles.actionLabelActive]}>{label}</Text>
      )}
    </Pressable>
  );
}

function formatRelativeTime(createdAt: string): string {
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - Date.parse(createdAt)) / 60_000));
  if (elapsedMinutes < 1) return 'Şimdi';
  if (elapsedMinutes < 60) return `${elapsedMinutes} dk`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} sa`;

  const elapsedDays = Math.floor(elapsedHours / 24);
  if (elapsedDays < 7) return `${elapsedDays} gün`;

  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short' }).format(
    new Date(createdAt),
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  header: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(3),
    paddingHorizontal: theme.spacing(4),
    paddingTop: theme.spacing(3),
  },
  avatar: { width: 42, height: 42, borderRadius: 999, backgroundColor: theme.colors.border },
  authorInfo: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  authorName: { flexShrink: 1, fontSize: 15, fontWeight: '700', color: theme.colors.text },
  followingDot: { width: 6, height: 6, borderRadius: 999, backgroundColor: theme.colors.primary },
  metadata: { paddingTop: 2, fontSize: 12, color: theme.colors.muted },
  moreButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  body: {
    paddingHorizontal: theme.spacing(4),
    paddingTop: theme.spacing(3),
    fontSize: 15,
    lineHeight: 21,
    color: theme.colors.text,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: theme.spacing(4),
    paddingVertical: theme.spacing(3),
  },
  placeName: { flex: 1, fontSize: 13, fontWeight: '700', color: theme.colors.primary },
  placeImage: { width: '100%', aspectRatio: 16 / 9, backgroundColor: theme.colors.border },
  actions: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingHorizontal: theme.spacing(3),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    minWidth: 44,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: theme.spacing(2),
  },
  actionButtonPressed: { backgroundColor: '#f1f5f9' },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.muted,
    fontVariant: ['tabular-nums'],
  },
  actionLabelActive: { color: theme.colors.primary },
  actionSpacer: { flex: 1 },
});
