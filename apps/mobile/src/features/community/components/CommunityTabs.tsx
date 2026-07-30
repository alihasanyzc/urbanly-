import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CommunityTab } from '../types';
import { theme } from '../../../theme';

interface Props {
  value: CommunityTab;
  onChange: (tab: CommunityTab) => void;
}

const TABS: { key: CommunityTab; label: string }[] = [
  { key: 'feed', label: 'Akış' },
  { key: 'following', label: 'Takip Ettiklerin' },
];

/** Twitter benzeri iki sekme — aktif sekmenin altında primary çizgi. */
export function CommunityTabs({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {TABS.map((tab) => {
        const active = tab.key === value;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(tab.key)}
            style={styles.tab}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
            <View style={[styles.indicator, active && styles.indicatorActive]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  tab: { flex: 1, alignItems: 'center', paddingTop: theme.spacing(3), gap: theme.spacing(2) },
  label: { fontSize: 15, fontWeight: '600', color: theme.colors.muted },
  labelActive: { color: theme.colors.text, fontWeight: '800' },
  indicator: { height: 3, width: 44, borderRadius: 999, backgroundColor: 'transparent' },
  indicatorActive: { backgroundColor: theme.colors.primary },
});
