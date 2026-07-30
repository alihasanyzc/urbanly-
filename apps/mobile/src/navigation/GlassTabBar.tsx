import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { TAB_BAR_HEIGHT } from './tabBarLayout';
import type { RootStackParamList } from './RootNavigator';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

/** Sekme rota adı → outline ikon + etiket. Aktifken dolu (filled) ikon kullanılır. */
const TAB_META: Record<string, { icon: IoniconName; iconActive: IoniconName; label: string }> = {
  Kesfet: { icon: 'map-outline', iconActive: 'map', label: 'Keşfet' },
  Topluluk: { icon: 'people-outline', iconActive: 'people', label: 'Topluluk' },
  ArkadasAra: { icon: 'person-add-outline', iconActive: 'person-add', label: 'Arkadaş' },
  Profil: { icon: 'person-outline', iconActive: 'person', label: 'Profil' },
};

/**
 * Modern glassmorphism yüzen tab bar.
 *
 * - `expo-blur` ile cam efekti; yarı saydam kenar + gölge.
 * - 4 gerçek sekme; ortada normal "Oluştur" sekmesi içerik ekleme modalını (CreatePost) açar.
 * - Sekmeler outline ikon, aktif sekme dolu ikon + primary renk.
 */
export function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // "+" ortada: ilk 2 sekme | + | son 2 sekme
  const mid = Math.ceil(state.routes.length / 2);
  const left = state.routes.slice(0, mid);
  const right = state.routes.slice(mid);

  const openCreate = () =>
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.navigate('CreatePost');

  const renderTab = (route: (typeof state.routes)[number]) => {
    const index = state.routes.indexOf(route);
    const focused = state.index === index;
    const meta = TAB_META[route.name];
    const { options } = descriptors[route.key];

    const onPress = () => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
    };

    return (
      <Pressable
        key={route.key}
        accessibilityRole="button"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={options.tabBarAccessibilityLabel ?? `${meta?.label} sekmesi`}
        onPress={onPress}
        hitSlop={8}
        style={styles.tab}
      >
        <Ionicons
          name={focused ? meta.iconActive : meta.icon}
          size={24}
          color={focused ? theme.colors.primary : isDark ? '#9ca3af' : theme.colors.muted}
        />
        <Text style={[styles.label, focused && styles.labelActive]}>{meta?.label}</Text>
      </Pressable>
    );
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, theme.spacing(2)) }]}
    >
      <View style={styles.barShadow}>
        <BlurView
          intensity={40}
          tint={isDark ? 'dark' : 'light'}
          style={[styles.bar, { backgroundColor: isDark ? 'rgba(17,24,39,0.55)' : 'rgba(255,255,255,0.6)' }]}
        >
          {left.map(renderTab)}

          {/* Ortadaki normal "Oluştur" sekmesi — içerik ekleme modalını açar */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Oluştur sekmesi"
            onPress={openCreate}
            hitSlop={8}
            style={styles.tab}
          >
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={isDark ? '#9ca3af' : theme.colors.muted}
            />
            <Text style={styles.label}>Oluştur</Text>
          </Pressable>

          {right.map(renderTab)}
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: theme.spacing(4),
    alignItems: 'center',
  },
  // Gölge, overflow:hidden'lı BlurView'ı kesmesin diye dış katmanda.
  barShadow: {
    width: '100%',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: TAB_BAR_HEIGHT,
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
    paddingHorizontal: theme.spacing(2),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minHeight: 44, // erişilebilir dokunma hedefi (bkz. CLAUDE.md §5.2)
  },
  label: { fontSize: 11, fontWeight: '600', color: theme.colors.muted },
  labelActive: { color: theme.colors.primary },
});
