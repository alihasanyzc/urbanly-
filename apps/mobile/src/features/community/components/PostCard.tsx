import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { CommunityPost } from '../types';
import { formatRelativeTime } from '../utils/time';
import { theme } from '../../../theme';

interface Props {
  post: CommunityPost;
  /** Paylaşım bir mekâna bağlıysa o mekânın adı (rozet için); yoksa rozet gizlenir. */
  placeName?: string;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onPressComment: (postId: string) => void;
  onPressPlace: (placeId: string) => void;
}

/** Akıştaki tek paylaşım kartı — modern kart: beğen, yorum, kaydet + mekân köprüsü. */
export function PostCard({
  post,
  placeName,
  onToggleLike,
  onToggleSave,
  onPressComment,
  onPressPlace,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.author} numberOfLines={1}>
            {post.author.name}
          </Text>
          <View style={styles.subRow}>
            <Ionicons name="location-outline" size={12} color={theme.colors.muted} />
            <Text style={styles.sub} numberOfLines={1}>
              {post.location.district} · {formatRelativeTime(post.createdAt)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.text}>{post.text}</Text>

      {post.placeId && placeName && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${placeName} mekânını aç`}
          onPress={() => onPressPlace(post.placeId as string)}
          style={({ pressed }) => [styles.placeChip, pressed && styles.pressed]}
        >
          <Ionicons name="location" size={14} color={theme.colors.primary} />
          <Text style={styles.placeName} numberOfLines={1}>
            {placeName}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={theme.colors.primary} />
        </Pressable>
      )}

      <View style={styles.divider} />

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={post.liked ? 'Beğeniyi kaldır' : 'Beğen'}
          accessibilityState={{ selected: post.liked }}
          hitSlop={8}
          onPress={() => onToggleLike(post.id)}
          style={styles.actionBtn}
        >
          <Ionicons
            name={post.liked ? 'heart' : 'heart-outline'}
            size={22}
            color={post.liked ? theme.colors.danger : theme.colors.muted}
          />
          <Text style={[styles.actionLabel, post.liked && styles.likeActive]}>
            {post.likeCount}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Yorumları aç"
          hitSlop={8}
          onPress={() => onPressComment(post.id)}
          style={styles.actionBtn}
        >
          <Ionicons name="chatbubble-outline" size={20} color={theme.colors.muted} />
          <Text style={styles.actionLabel}>{post.comments.length}</Text>
        </Pressable>

        <View style={styles.actionsSpacer} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={post.saved ? 'Kaydı kaldır' : 'Kaydet'}
          accessibilityState={{ selected: post.saved }}
          hitSlop={8}
          onPress={() => onToggleSave(post.id)}
          style={styles.actionBtn}
        >
          <Ionicons
            name={post.saved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={post.saved ? theme.colors.primary : theme.colors.muted}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: theme.spacing(4),
    padding: theme.spacing(4),
    borderRadius: 18,
    backgroundColor: theme.colors.bg,
    // Sert kenarlık yerine yumuşak gölge — daha modern, hafif yükseltilmiş his.
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: theme.spacing(3),
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing(3) },
  avatar: { width: 44, height: 44, borderRadius: 999, backgroundColor: '#f3f4f6' },
  headerText: { flex: 1 },
  author: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  sub: { fontSize: 12, color: theme.colors.muted },
  text: { fontSize: 15.5, lineHeight: 23, color: theme.colors.text },
  placeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(2),
    paddingVertical: theme.spacing(2),
    borderRadius: 999,
    backgroundColor: '#eff6ff',
  },
  pressed: { opacity: 0.8 },
  placeName: { fontSize: 13, fontWeight: '700', color: theme.colors.primary, maxWidth: 200 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.border },
  actions: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing(4) },
  actionsSpacer: { flex: 1 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 },
  actionLabel: { fontSize: 14, fontWeight: '700', color: theme.colors.muted },
  likeActive: { color: theme.colors.danger },
});
