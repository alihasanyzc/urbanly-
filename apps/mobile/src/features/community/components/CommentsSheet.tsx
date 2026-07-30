import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CommunityPost } from '../types';
import { formatRelativeTime } from '../utils/time';
import { theme } from '../../../theme';

interface Props {
  /** Yorumları gösterilen paylaşım; `null` iken modal kapalı. */
  post: CommunityPost | null;
  onClose: () => void;
  onSubmit: (postId: string, text: string) => void;
}

/** Bir paylaşımın yorumlarını gösteren + yeni yorum eklenen alttan açılır modal. */
export function CommentsSheet({ post, onClose, onSubmit }: Props) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const trimmed = text.trim();
  const canSubmit = trimmed.length > 0;

  const handleSubmit = () => {
    if (!post || !canSubmit) return;
    onSubmit(post.id, trimmed);
    setText('');
  };

  return (
    <Modal
      visible={post !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTop} onPress={onClose} accessibilityLabel="Kapat" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheet}
        >
          <View style={styles.grabber} />
          <View style={styles.header}>
            <Text style={styles.title}>Yorumlar</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kapat"
              hitSlop={12}
              onPress={onClose}
              style={styles.close}
            >
              <Ionicons name="close" size={20} color={theme.colors.text} />
            </Pressable>
          </View>

          <FlatList
            data={post?.comments ?? []}
            keyExtractor={(c) => c.id}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text style={styles.empty}>Henüz yorum yok. İlk yorumu sen yaz.</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Image source={{ uri: item.author.avatarUrl }} style={styles.avatar} />
                <View style={styles.commentBody}>
                  <View style={styles.commentMeta}>
                    <Text style={styles.commentAuthor}>{item.author.name}</Text>
                    <Text style={styles.commentTime}>{formatRelativeTime(item.createdAt)}</Text>
                  </View>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              </View>
            )}
          />

          <View style={[styles.inputRow, { paddingBottom: Math.max(insets.bottom, theme.spacing(3)) }]}>
            <TextInput
              style={styles.input}
              placeholder="Yorum yaz…"
              placeholderTextColor={theme.colors.muted}
              value={text}
              onChangeText={setText}
              multiline
              maxLength={280}
              accessibilityLabel="Yorum metni"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Yorumu gönder"
              accessibilityState={{ disabled: !canSubmit }}
              disabled={!canSubmit}
              onPress={handleSubmit}
              style={[styles.sendBtn, !canSubmit && styles.sendDisabled]}
            >
              <Ionicons name="arrow-up" size={20} color="#ffffff" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  backdropTop: { flex: 1 },
  sheet: {
    maxHeight: '80%',
    minHeight: '55%',
    backgroundColor: theme.colors.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: theme.spacing(2),
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing(2),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  title: { fontSize: 16, fontWeight: '800', color: theme.colors.text },
  close: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  list: { padding: theme.spacing(4), gap: theme.spacing(4), flexGrow: 1 },
  empty: { textAlign: 'center', color: theme.colors.muted, fontSize: 14, marginTop: theme.spacing(6) },
  comment: { flexDirection: 'row', gap: theme.spacing(3) },
  avatar: { width: 36, height: 36, borderRadius: 999, backgroundColor: '#f3f4f6' },
  commentBody: { flex: 1, gap: 2 },
  commentMeta: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing(2) },
  commentAuthor: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
  commentTime: { fontSize: 12, color: theme.colors.muted },
  commentText: { fontSize: 14, lineHeight: 20, color: theme.colors.text },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing(2),
    paddingHorizontal: theme.spacing(4),
    paddingTop: theme.spacing(3),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(2),
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    fontSize: 15,
    color: theme.colors.text,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  sendDisabled: { backgroundColor: '#cbd5e1' },
});
