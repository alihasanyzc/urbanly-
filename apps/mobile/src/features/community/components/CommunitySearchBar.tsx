import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { theme } from '../../../theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

/** Akışı kelimeye göre daraltan arama kutusu — metin, yazar, mekân ve ilçede eşleşir. */
export function CommunitySearchBar({ value, onChangeText }: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="search" size={18} color={theme.colors.muted} />
      <TextInput
        style={styles.input}
        placeholder="Toplulukta ara…"
        placeholderTextColor={theme.colors.muted}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel="Toplulukta ara"
      />
      {value.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Aramayı temizle"
          hitSlop={8}
          onPress={() => onChangeText('')}
        >
          <Ionicons name="close-circle" size={18} color={theme.colors.muted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginHorizontal: theme.spacing(4),
    paddingHorizontal: theme.spacing(3),
    height: 42,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
  },
  input: { flex: 1, fontSize: 15, color: theme.colors.text, paddingVertical: 0 },
});
