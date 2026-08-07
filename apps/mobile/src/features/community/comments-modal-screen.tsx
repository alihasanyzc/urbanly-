import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { useCommunityStore } from '../../store/community-store';
import { theme } from '../../theme';
import { COMMUNITY_FEED_ITEMS, CURRENT_USER, type CommunityComment } from './mock-community';

type Props = NativeStackScreenProps<RootStackParamList, 'PostComments'>;

const EMPTY_COMMENTS: ReadonlyArray<CommunityComment> = [];

/** Bir posta ait yorumları gösteren ve yeni yorum ekleyen native modal. */
export function CommentsModalScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState('');
  const post = COMMUNITY_FEED_ITEMS.find((item) => item.id === route.params.postId);
  const comments = useCommunityStore(
    (state) => state.commentsByPostId[route.params.postId] ?? EMPTY_COMMENTS,
  );
  const addComment = useCommunityStore((state) => state.addComment);
  const addedCommentCount = useCommunityStore(
    (state) => state.addedCommentCountsByPostId[route.params.postId] ?? 0,
  );
  const normalizedDraft = draft.trim();

  const submitComment = () => {
    if (!normalizedDraft) return;
    addComment(route.params.postId, normalizedDraft);
    setDraft('');
    Keyboard.dismiss();
  };

  if (!post) {
    return (
      <View style={[styles.root, styles.notFound, { paddingTop: insets.top }]}>
        <Text selectable style={styles.notFoundText}>
          Paylaşım bulunamadı.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.doneButton}
        >
          <Text style={styles.doneButtonText}>Kapat</Text>
        </Pressable>
      </View>
    );
  }

  const visibleCommentCount = post.commentCount + addedCommentCount;

  return (
    <KeyboardAvoidingView
      behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing(2) }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Yorumları kapat"
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="close" size={23} color={theme.colors.text} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Yorumlar</Text>
          <Text style={styles.headerCount}>{visibleCommentCount}</Text>
        </View>
        <View style={styles.headerButton} />
      </View>

      <FlatList
        data={comments}
        keyExtractor={(comment) => comment.id}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.commentList}
        ListHeaderComponent={
          <View style={styles.postContext}>
            <Text style={styles.postAuthor}>{post.author.displayName}</Text>
            <Text selectable style={styles.postBody} numberOfLines={3}>
              {post.body}
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => <CommentRow comment={item} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-outline" size={32} color={theme.colors.muted} />
            <Text selectable style={styles.emptyTitle}>
              İlk yorumu sen yap
            </Text>
          </View>
        }
      />

      <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, theme.spacing(2)) }]}>
        <Image
          source={{ uri: CURRENT_USER.avatarUrl }}
          accessibilityLabel="Profil fotoğrafın"
          style={styles.composerAvatar}
        />
        <TextInput
          value={draft}
          onChangeText={setDraft}
          accessibilityLabel="Yorum yaz"
          placeholder="Yorumunu yaz..."
          placeholderTextColor={theme.colors.muted}
          multiline
          autoFocus
          maxLength={280}
          style={styles.commentInput}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Yorumu gönder"
          accessibilityState={{ disabled: !normalizedDraft }}
          disabled={!normalizedDraft}
          onPress={submitComment}
          style={({ pressed }) => [
            styles.sendButton,
            !normalizedDraft && styles.sendButtonDisabled,
            pressed && normalizedDraft && styles.sendButtonPressed,
          ]}
        >
          <Ionicons name="arrow-up" size={20} color="#ffffff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function CommentRow({ comment }: { comment: CommunityComment }) {
  return (
    <View style={styles.commentRow}>
      <Image
        source={{ uri: comment.author.avatarUrl }}
        accessibilityLabel={`${comment.author.displayName} profil fotoğrafı`}
        style={styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentMeta}>
          <Text selectable style={styles.commentAuthor} numberOfLines={1}>
            {comment.author.displayName}
          </Text>
          <Text style={styles.commentTime}>{formatRelativeTime(comment.createdAt)}</Text>
        </View>
        <Text selectable style={styles.commentBody}>
          {comment.body}
        </Text>
      </View>
    </View>
  );
}

function formatRelativeTime(createdAt: string): string {
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - Date.parse(createdAt)) / 60_000));
  if (elapsedMinutes < 1) return 'Şimdi';
  if (elapsedMinutes < 60) return `${elapsedMinutes} dk`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} sa`;
  return `${Math.floor(elapsedHours / 24)} gün`;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  header: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  headerButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitleWrap: { height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: theme.colors.text },
  headerCount: {
    paddingTop: 1,
    fontSize: 11,
    color: theme.colors.muted,
    fontVariant: ['tabular-nums'],
  },
  commentList: { paddingBottom: theme.spacing(4) },
  postContext: {
    gap: theme.spacing(2),
    padding: theme.spacing(4),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    backgroundColor: '#f8fafc',
  },
  postAuthor: { fontSize: 13, fontWeight: '800', color: theme.colors.text },
  postBody: { fontSize: 14, lineHeight: 20, color: theme.colors.muted },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 72,
    backgroundColor: theme.colors.border,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing(3),
    paddingHorizontal: theme.spacing(4),
    paddingVertical: theme.spacing(3),
  },
  commentAvatar: { width: 44, height: 44, borderRadius: 999, backgroundColor: theme.colors.border },
  commentContent: { flex: 1, minWidth: 0, gap: theme.spacing(1) },
  commentMeta: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing(2) },
  commentAuthor: { flexShrink: 1, fontSize: 14, fontWeight: '800', color: theme.colors.text },
  commentTime: { fontSize: 12, color: theme.colors.muted },
  commentBody: { fontSize: 14, lineHeight: 20, color: theme.colors.text },
  emptyState: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
  },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.muted },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing(2),
    paddingHorizontal: theme.spacing(3),
    paddingTop: theme.spacing(2),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  composerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
  },
  commentInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 112,
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(2),
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  sendButtonDisabled: { opacity: 0.35 },
  sendButtonPressed: { opacity: 0.75 },
  notFound: { alignItems: 'center', justifyContent: 'center', gap: theme.spacing(4) },
  notFoundText: { fontSize: 16, color: theme.colors.text },
  doneButton: {
    minWidth: 96,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  doneButtonText: { fontSize: 14, fontWeight: '700', color: '#ffffff' },
});
