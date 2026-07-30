import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../theme';
import { AreaPickerModal } from './AreaPickerModal';

interface Props {
  from: string | null;
  to: string | null;
  areas: string[];
  onChangeFrom: (value: string | null) => void;
  onChangeTo: (value: string | null) => void;
}

type Target = 'from' | 'to' | null;

/** Üstte kalkış → varış seçimi. Boş seçim "Farketmez" (tümü) anlamına gelir. */
export function RouteSelector({ from, to, areas, onChangeFrom, onChangeTo }: Props) {
  const [picking, setPicking] = useState<Target>(null);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Field
          label="Kalkış"
          value={from}
          icon="radio-button-on-outline"
          onPress={() => setPicking('from')}
        />
        <Ionicons name="arrow-forward" size={18} color={theme.colors.muted} />
        <Field
          label="Varış"
          value={to}
          icon="location-outline"
          onPress={() => setPicking('to')}
        />
      </View>

      <AreaPickerModal
        visible={picking === 'from'}
        title="Kalkış seç"
        selected={from}
        options={areas}
        allowAny
        onSelect={(v) => {
          onChangeFrom(v);
          setPicking(null);
        }}
        onClose={() => setPicking(null)}
      />
      <AreaPickerModal
        visible={picking === 'to'}
        title="Varış seç"
        selected={to}
        options={areas}
        allowAny
        onSelect={(v) => {
          onChangeTo(v);
          setPicking(null);
        }}
        onClose={() => setPicking(null)}
      />
    </View>
  );
}

function Field({
  label,
  value,
  icon,
  onPress,
}: {
  label: string;
  value: string | null;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value ?? 'Farketmez'}, değiştir`}
      onPress={onPress}
      style={({ pressed }) => [styles.field, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={16} color={theme.colors.primary} />
      <View style={styles.fieldText}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue} numberOfLines={1}>
          {value ?? 'Farketmez'}
        </Text>
      </View>
      <Ionicons name="chevron-down" size={14} color={theme.colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: theme.spacing(4) },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing(2) },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    minHeight: 52,
    paddingHorizontal: theme.spacing(3),
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  pressed: { backgroundColor: '#f9fafb' },
  fieldText: { flex: 1 },
  fieldLabel: { fontSize: 11, color: theme.colors.muted, fontWeight: '600' },
  fieldValue: { fontSize: 14, color: theme.colors.text, fontWeight: '700' },
});
