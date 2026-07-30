import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MOCK_CURRENT_USER } from '../data/mockPosts';
import { theme } from '../../../theme';

const MAX_LENGTH = 280;

interface Props {
  /** Paylaş'a basınca çağrılır; ekran yeni paylaşımı akışın başına ekler. */
  onSubmit: (text: string) => void;
  /** Sağ üstteki butonla açıldığında girişe otomatik odaklan. */
  autoFocus?: boolean;
}

/**
 * Paylaşım kutusu — kullanıcı serbest metin yazıp paylaşır. Sağ üstteki "Paylaş"
 * butonuyla açılır. Backend yokken metni yukarı (`onSubmit`) verir; kalıcılaştırma
 * sonraki fazda `createPost` ile.
 */
export function PostComposer({ onSubmit, autoFocus = false }: Props) {
  const [text, setText] = useState('');
  const trimmed = text.trim();
  const canSubmit = trimmed.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(trimmed);
    setText('');
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Image source={{ uri: MOCK_CURRENT_USER.avatarUrl }} style={styles.avatar} />
        <TextInput
          style={styles.input}
          placeholder="Bir keşfini ya da önerini paylaş…"
          placeholderTextColor={theme.colors.muted}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={MAX_LENGTH}
          autoFocus={autoFocus}
          accessibilityLabel="Paylaşım metni"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.counter}>
          {trimmed.length}/{MAX_LENGTH}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Paylaş"
          accessibilityState={{ disabled: !canSubmit }}
          disabled={!canSubmit}
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.button,
            !canSubmit && styles.buttonDisabled,
            pressed && canSubmit && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Paylaş</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: theme.spacing(4),
    padding: theme.spacing(3),
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
    gap: theme.spacing(3),
  },
  row: { flexDirection: 'row', gap: theme.spacing(3) },
  avatar: { width: 40, height: 40, borderRadius: 999, backgroundColor: '#f3f4f6' },
  input: {
    flex: 1,
    minHeight: 44,
    fontSize: 15,
    color: theme.colors.text,
    paddingTop: theme.spacing(2),
    textAlignVertical: 'top',
  },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  counter: { fontSize: 12, color: theme.colors.muted },
  button: {
    minHeight: 44,
    paddingHorizontal: theme.spacing(5),
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  buttonDisabled: { backgroundColor: '#cbd5e1' },
  buttonPressed: { opacity: 0.85 },
  buttonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});
