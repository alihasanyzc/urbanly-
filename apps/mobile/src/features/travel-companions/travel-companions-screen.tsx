import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { matchesSearchQuery } from '../../lib/search';
import type { RootStackParamList, TabParamList } from '../../navigation/RootNavigator';
import { TAB_BAR_SPACE } from '../../navigation/tabBarLayout';
import { theme } from '../../theme';
import { MOCK_TRAVEL_PLANS } from './mock-travel-plans';
import { TravelCompanionCard } from './travel-companion-card';
import { TURKISH_PROVINCES } from './turkish-provinces';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'YolArkadasi'>,
  NativeStackScreenProps<RootStackParamList>
>;

type RouteField = 'origin' | 'destination';

/** Aynı rotada seyahat etmek isteyen kullanıcıları nereden/nereye filtresiyle eşleştirir. */
export function TravelCompanionsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [originQuery, setOriginQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<RouteField | null>(null);

  const filteredPlans = useMemo(() => {
    return MOCK_TRAVEL_PLANS.filter(
      (plan) =>
        (!selectedOrigin || matchesSearchQuery([plan.origin], selectedOrigin)) &&
        (!selectedDestination || matchesSearchQuery([plan.destination], selectedDestination)),
    );
  }, [selectedDestination, selectedOrigin]);

  const locationSuggestions = useMemo(() => {
    if (!activeField) return [];

    const query = activeField === 'origin' ? originQuery : destinationQuery;
    if (query.trim().length === 0) return [];

    return TURKISH_PROVINCES.filter((province) => matchesSearchQuery([province], query)).slice(
      0,
      5,
    );
  }, [activeField, destinationQuery, originQuery]);

  const swapRoute = () => {
    setOriginQuery(destinationQuery);
    setDestinationQuery(originQuery);
    setSelectedOrigin(selectedDestination);
    setSelectedDestination(selectedOrigin);
    setActiveField(null);
  };

  const clearFilters = () => {
    setOriginQuery('');
    setDestinationQuery('');
    setSelectedOrigin(null);
    setSelectedDestination(null);
    setActiveField(null);
  };

  const changeOriginQuery = (value: string) => {
    setOriginQuery(value);
    if (value !== selectedOrigin) setSelectedOrigin(null);
  };

  const changeDestinationQuery = (value: string) => {
    setDestinationQuery(value);
    if (value !== selectedDestination) setSelectedDestination(null);
  };

  const clearOrigin = () => {
    setOriginQuery('');
    setSelectedOrigin(null);
  };

  const clearDestination = () => {
    setDestinationQuery('');
    setSelectedDestination(null);
  };

  const selectLocation = (location: string) => {
    if (activeField === 'origin') {
      setOriginQuery(location);
      setSelectedOrigin(location);
    } else if (activeField === 'destination') {
      setDestinationQuery(location);
      setSelectedDestination(location);
    }

    setActiveField(null);
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Yol Arkadaşı</Text>
        <Text style={styles.subtitle}>Aynı rotadaki gezginleri bul, birlikte keşfet.</Text>

        <View style={styles.filterCard}>
          <View style={styles.routeInputsRow}>
            <RouteInput
              icon="radio-button-on"
              label="Gidiş"
              placeholder="Nereden?"
              value={originQuery}
              onChangeText={changeOriginQuery}
              onClear={clearOrigin}
              onFocus={() => setActiveField('origin')}
              onSubmitEditing={() => setActiveField(null)}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Gidiş ve varış noktalarını değiştir"
              onPress={swapRoute}
              style={({ pressed }) => [styles.swapButton, pressed && styles.buttonPressed]}
            >
              <Ionicons name="swap-horizontal" size={21} color={theme.colors.primary} />
            </Pressable>

            <RouteInput
              icon="location"
              label="Varış"
              placeholder="Nereye?"
              value={destinationQuery}
              onChangeText={changeDestinationQuery}
              onClear={clearDestination}
              onFocus={() => setActiveField('destination')}
              onSubmitEditing={() => setActiveField(null)}
            />
          </View>

          {activeField && locationSuggestions.length > 0 && (
            <View style={styles.suggestions}>
              <Text style={styles.suggestionsTitle}>
                {activeField === 'origin' ? 'Gidiş önerileri' : 'Varış önerileri'}
              </Text>
              {locationSuggestions.map((location, index) => (
                <Pressable
                  key={location}
                  accessibilityRole="button"
                  accessibilityLabel={`${location} konumunu seç`}
                  onPress={() => selectLocation(location)}
                  style={({ pressed }) => [
                    styles.suggestionRow,
                    index > 0 && styles.suggestionBorder,
                    pressed && styles.suggestionPressed,
                  ]}
                >
                  <Ionicons name="location-outline" size={18} color={theme.colors.primary} />
                  <Text numberOfLines={1} style={styles.suggestionText}>
                    {location}
                  </Text>
                  <Ionicons name="arrow-forward" size={17} color={theme.colors.muted} />
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>

      <FlatList
        data={filteredPlans}
        keyExtractor={(plan) => plan.id}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + TAB_BAR_SPACE + theme.spacing(3) },
        ]}
        ListHeaderComponent={
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>Seyahat planları</Text>
            <Text style={styles.resultCount}>{filteredPlans.length} eşleşme</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TravelCompanionCard
            plan={item}
            onPress={() => navigation.navigate('TravelCompanionDetail', { planId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="trail-sign-outline" size={34} color={theme.colors.primary} />
            </View>
            <Text selectable style={styles.emptyTitle}>
              Bu rotada plan bulunamadı
            </Text>
            <Text selectable style={styles.emptyText}>
              Şehir adlarını değiştirerek başka yol arkadaşlarına göz atabilirsin.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Rota filtrelerini temizle"
              onPress={clearFilters}
              style={({ pressed }) => [styles.clearFiltersButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.clearFiltersText}>Filtreleri temizle</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

function RouteInput({
  icon,
  label,
  placeholder,
  value,
  onChangeText,
  onClear,
  onFocus,
  onSubmitEditing,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  onClear: () => void;
  onFocus: () => void;
  onSubmitEditing: () => void;
}) {
  return (
    <View style={styles.inputBlock}>
      <View style={styles.inputLabelRow}>
        <Ionicons
          name={icon}
          size={14}
          color={icon === 'location' ? theme.colors.danger : theme.colors.primary}
        />
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <View style={styles.inputControl}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          accessibilityLabel={`${label} filtresi`}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.muted}
          returnKeyType="search"
          autoCapitalize="words"
          onFocus={onFocus}
          onSubmitEditing={onSubmitEditing}
          style={styles.input}
        />
        {value.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${label} filtresini temizle`}
            onPress={onClear}
            style={styles.inputClearButton}
          >
            <Ionicons name="close-circle" size={18} color={theme.colors.muted} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    gap: theme.spacing(1),
    paddingHorizontal: theme.spacing(4),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    backgroundColor: theme.colors.bg,
  },
  title: { fontSize: 24, fontWeight: '800', color: theme.colors.text },
  subtitle: { fontSize: 14, lineHeight: 20, color: theme.colors.muted },
  filterCard: {
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: '#f8fafc',
  },
  routeInputsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing(1),
  },
  inputBlock: { flex: 1, minWidth: 0, gap: theme.spacing(1) },
  inputLabelRow: {
    minHeight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
    paddingHorizontal: theme.spacing(1),
  },
  inputLabel: { fontSize: 11, fontWeight: '700', color: theme.colors.muted },
  inputControl: {
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  input: {
    minHeight: 48,
    paddingLeft: theme.spacing(2),
    paddingRight: 44,
    paddingVertical: theme.spacing(1),
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  inputClearButton: {
    position: 'absolute',
    right: 0,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapButton: {
    width: 44,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    backgroundColor: '#eff6ff',
  },
  suggestions: {
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  suggestionsTitle: {
    paddingHorizontal: theme.spacing(3),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.muted,
  },
  suggestionRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingHorizontal: theme.spacing(3),
  },
  suggestionBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  suggestionText: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  suggestionPressed: { backgroundColor: '#eff6ff' },
  listContent: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    paddingHorizontal: theme.spacing(3),
  },
  resultHeader: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text },
  resultCount: { fontSize: 12, color: theme.colors.muted, fontVariant: ['tabular-nums'] },
  separator: { height: theme.spacing(3) },
  emptyState: {
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    paddingHorizontal: theme.spacing(6),
  },
  emptyIcon: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#eff6ff',
  },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: theme.colors.text, textAlign: 'center' },
  emptyText: { fontSize: 14, lineHeight: 20, color: theme.colors.muted, textAlign: 'center' },
  clearFiltersButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing(4),
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  clearFiltersText: { fontSize: 14, fontWeight: '700', color: '#ffffff' },
  buttonPressed: { opacity: 0.75 },
});
