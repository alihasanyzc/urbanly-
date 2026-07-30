import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import type { PlaceCategory } from '@urbanly/shared';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { theme } from '../../../theme';
import { CATEGORY_META, CATEGORY_ORDER } from '../data/categories';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface Props {
  activeCategory: PlaceCategory | null;
  onSelectCategory: (c: PlaceCategory) => void;
  /** "Tümü" çipine basınca filtreyi temizler (tüm kategoriler gösterilir). */
  onClear: () => void;
}

/** "Tümü" çipinin sabit rengi (kategori nötr — marka mavisi). */
const ALL_COLOR = '#2563eb';

/**
 * Harita üstündeki yatay kategori filtre çubuğu.
 * Kategoriler TEK seçim: birine basınca sadece o gösterilir, tekrar basınca temizlenir.
 * Baştaki "Tümü" çipi filtreyi temizler ve hiçbir kategori seçili değilken aktiftir.
 */
export function CategoryFilterBar({ activeCategory, onSelectCategory, onClear }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <Chip
        icon="apps-outline"
        label="Tümü"
        active={activeCategory === null}
        activeColor={ALL_COLOR}
        onPress={onClear}
      />
      {CATEGORY_ORDER.map((c) => {
        const meta = CATEGORY_META[c];
        return (
          <Chip
            key={c}
            icon={meta.icon}
            label={meta.label}
            active={activeCategory === c}
            activeColor={meta.color}
            onPress={() => onSelectCategory(c)}
          />
        );
      })}
    </ScrollView>
  );
}

interface ChipProps {
  icon: IoniconName;
  label: string;
  active: boolean;
  activeColor: string;
  onPress: () => void;
}

function Chip({ icon, label, active, activeColor, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${label} filtresi`}
      hitSlop={8}
      onPress={onPress}
      style={[styles.chip, active && { backgroundColor: activeColor, borderColor: activeColor }]}
    >
      <Ionicons name={icon} size={16} color={active ? '#ffffff' : activeColor} />
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: theme.spacing(2),
    paddingHorizontal: theme.spacing(4),
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
    minHeight: 44, // erişilebilir dokunma hedefi (bkz. CLAUDE.md §5.2)
    paddingHorizontal: theme.spacing(3),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  chipLabel: { fontSize: 13, fontWeight: '600', color: theme.colors.text },
  chipLabelActive: { color: '#ffffff' },
});
