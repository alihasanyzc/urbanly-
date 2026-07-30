import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../theme';

interface Props {
  visible: boolean;
  title: string;
  selected: string | null;
  options: string[];
  /** true ise başa "Farketmez" (null) seçeneği eklenir (filtre için). */
  allowAny?: boolean;
  onSelect: (value: string | null) => void;
  onClose: () => void;
}

const ANY_LABEL = 'Farketmez';

/** Bölge seçimi için alttan açılan liste modalı — kalkış/varış filtresi ve ilan formu paylaşır. */
export function AreaPickerModal({
  visible,
  title,
  selected,
  options,
  allowAny = false,
  onSelect,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.grabber} />
          <Text style={styles.title}>{title}</Text>
          <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
            {allowAny && (
              <Row
                label={ANY_LABEL}
                selected={selected === null}
                onPress={() => onSelect(null)}
              />
            )}
            {options.map((opt) => (
              <Row
                key={opt}
                label={opt}
                selected={selected === opt}
                onPress={() => onSelect(opt)}
              />
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Row({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Text style={[styles.rowText, selected && styles.rowActive]}>{label}</Text>
      {selected && <Ionicons name="checkmark" size={18} color={theme.colors.primary} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: {
    maxHeight: '70%',
    backgroundColor: theme.colors.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: theme.spacing(4),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(6),
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing(3),
  },
  title: { fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: theme.spacing(2) },
  scroll: { flexGrow: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: theme.spacing(2),
  },
  pressed: { opacity: 0.7 },
  rowText: { fontSize: 15, color: theme.colors.text },
  rowActive: { fontWeight: '700', color: theme.colors.primary },
});
