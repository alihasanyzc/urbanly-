import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TripCategory } from '../types';
import { theme } from '../../../theme';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface Props {
  value: TripCategory;
  onChange: (category: TripCategory) => void;
}

/** İki kategori: birlikte gezmek isteyenler vs. taksiyle götürülmek isteyen yolcular. */
export const CATEGORY_META: Record<TripCategory, { label: string; icon: IoniconName }> = {
  buddy: { label: 'Gezelim', icon: 'walk-outline' },
  passenger: { label: 'Yolcu', icon: 'car-outline' },
};

const ORDER: TripCategory[] = ['buddy', 'passenger'];

/** Segmented kontrol — aktif kategori dolu, diğeri sönük. */
export function TripCategoryTabs({ value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      {ORDER.map((cat) => {
        const active = cat === value;
        const meta = CATEGORY_META[cat];
        return (
          <Pressable
            key={cat}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(cat)}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Ionicons
              name={meta.icon}
              size={17}
              color={active ? '#ffffff' : theme.colors.muted}
            />
            <Text style={[styles.label, active && styles.labelActive]}>{meta.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: theme.spacing(1),
    marginHorizontal: theme.spacing(4),
    padding: 4,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 40,
    borderRadius: 999,
  },
  tabActive: { backgroundColor: theme.colors.primary },
  label: { fontSize: 14, fontWeight: '700', color: theme.colors.muted },
  labelActive: { color: '#ffffff' },
});
