import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';
import type { ProfileComment } from './mock-profile';

interface Props {
  comment: ProfileComment;
}

/** Profil sahibine başka bir kullanıcıdan gelen, salt okunur yorum. */
export function ProfileCommentCard({ comment }: Props) {
  return (
    <View
      accessibilityLabel={`${comment.author.displayName} tarafından yazılan yorum`}
      style={styles.card}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: comment.author.avatarUrl }}
          accessibilityLabel={`${comment.author.displayName} profil fotoğrafı`}
          style={styles.avatar}
        />

        <View style={styles.authorInfo}>
          <Text selectable numberOfLines={1} style={styles.authorName}>
            {comment.author.displayName}
          </Text>
          <Text numberOfLines={1} style={styles.authorMeta}>
            @{comment.author.username} · {comment.publishedAt}
          </Text>
        </View>
      </View>

      <Text selectable style={styles.body}>
        {comment.body}
      </Text>

      <View style={styles.postcardReference}>
        <Ionicons name="chatbubble-ellipses-outline" size={15} color={theme.colors.primary} />
        <Text numberOfLines={1} style={styles.postcardReferenceText}>
          {comment.postcardTitle}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing(3),
    padding: theme.spacing(4),
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
  },
  authorInfo: { flex: 1, minWidth: 0, gap: 2 },
  authorName: { fontSize: 14, fontWeight: '800', color: theme.colors.text },
  authorMeta: { fontSize: 11, color: theme.colors.muted },
  body: { fontSize: 14, lineHeight: 21, color: theme.colors.text },
  postcardReference: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingHorizontal: theme.spacing(3),
    borderRadius: 12,
    backgroundColor: '#eff6ff',
  },
  postcardReferenceText: {
    flex: 1,
    minWidth: 0,
    fontSize: 11,
    fontWeight: '700',
    color: '#1e3a8a',
  },
});
