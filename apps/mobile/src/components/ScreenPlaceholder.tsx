import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { TAB_BAR_SPACE } from '../navigation/tabBarLayout';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface Props {
  icon: IoniconName;
  title: string;
  subtitle?: string;
}

/**
 * Henüz içeriği gelmemiş sekmeler için ortak boş durum ekranı.
 * Alt boşluk (`TAB_BAR_SPACE`) yüzen cam tab bar'ın altında kalmasını önler.
 */
export function ScreenPlaceholder({ icon, title, subtitle = 'Yakında' }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: TAB_BAR_SPACE }]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={40} color={theme.colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    backgroundColor: theme.colors.bg,
    paddingHorizontal: theme.spacing(6),
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff', // primary'nin çok açık tonu
    marginBottom: theme.spacing(2),
  },
  title: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
  subtitle: { fontSize: 14, color: theme.colors.muted, textAlign: 'center' },
});
