import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_SPACE } from '../../../navigation/tabBarLayout';
import { theme } from '../../../theme';
import type { NewListingInput } from '../components/CreateListingSheet';
import { CreateListingSheet } from '../components/CreateListingSheet';
import { RouteSelector } from '../components/RouteSelector';
import { TripCard } from '../components/TripCard';
import { TripCategoryTabs } from '../components/TripCategoryTabs';
import { AREAS } from '../data/areas';
import { MOCK_CURRENT_USER, MOCK_LISTINGS } from '../data/mockListings';
import type { TripCategory, TripListing } from '../types';

/**
 * "Benimle Gez" — kullanıcı ilanları (kalkış → varış). Üstte kalkış/varış seçilir, akış
 * ona göre listelenir. İki kategori: birlikte gezmek isteyenler ve taksiyle götürülmek
 * isteyen yolcular. Kullanıcı ilan verebilir, bir ilana katılım isteği gönderebilir.
 *
 * Backend yok: ilanlar/aksiyonlar yerel state'te (mock) — bkz. CLAUDE.md §1.2.
 */
export function ExploreWithMeScreen() {
  const insets = useSafeAreaInsets();
  const [listings, setListings] = useState<TripListing[]>(MOCK_LISTINGS);
  const [category, setCategory] = useState<TripCategory>('buddy');
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const visible = useMemo(
    () =>
      listings.filter(
        (l) =>
          l.category === category &&
          (from === null || l.from === from) &&
          (to === null || l.to === to),
      ),
    [listings, category, from, to],
  );

  const onAction = useCallback((listing: TripListing) => {
    const message =
      listing.category === 'buddy'
        ? `Gezi isteğin ${listing.author.name} kişisine iletildi. Onaylarsa bildirim alacaksın.`
        : `Yolcu isteğin ${listing.author.name} şoförüne iletildi. Onaylarsa bildirim alacaksın.`;
    Alert.alert('İstek gönderildi', message);
  }, []);

  const addListing = useCallback((input: NewListingInput) => {
    const listing: TripListing = {
      id: `trip_${Date.now()}`,
      author: MOCK_CURRENT_USER,
      ...input,
      createdAt: new Date().toISOString(),
    };
    setListings((prev) => [listing, ...prev]);
    setCategory(input.category); // yeni ilanın kategorisine geç ki kullanıcı görsün
    setCreating(false);
  }, []);

  return (
    <>
      <FlatList
        style={styles.root}
        data={visible}
        keyExtractor={(l) => l.id}
        contentContainerStyle={{ paddingBottom: TAB_BAR_SPACE }}
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: insets.top + theme.spacing(2) }]}>
            <View style={styles.titleRow}>
              <View>
                <Text style={styles.title}>Benimle Gez</Text>
                <Text style={styles.subtitle}>Rota ver, eşlik bul ya da yolcu ol.</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="İlan ver"
                onPress={() => setCreating(true)}
                style={({ pressed }) => [styles.newBtn, pressed && styles.newBtnPressed]}
              >
                <Ionicons name="add" size={18} color="#ffffff" />
                <Text style={styles.newBtnText}>İlan Ver</Text>
              </Pressable>
            </View>

            <RouteSelector
              from={from}
              to={to}
              areas={AREAS}
              onChangeFrom={setFrom}
              onChangeTo={setTo}
            />

            <TripCategoryTabs value={category} onChange={setCategory} />
          </View>
        }
        renderItem={({ item }) => <TripCard listing={item} onAction={onAction} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="navigate-outline" size={40} color={theme.colors.muted} />
            <Text style={styles.emptyText}>Bu rota için ilan yok.</Text>
            <Text style={styles.emptyHint}>Kalkış/varışı değiştir ya da ilk ilanı sen ver.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <CreateListingSheet
        visible={creating}
        areas={AREAS}
        onClose={() => setCreating(false)}
        onSubmit={addListing}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  header: { gap: theme.spacing(4), paddingBottom: theme.spacing(4) },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing(4),
  },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.text },
  subtitle: { fontSize: 13, color: theme.colors.muted, marginTop: 2 },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 40,
    paddingHorizontal: theme.spacing(3),
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  newBtnPressed: { opacity: 0.85 },
  newBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  separator: { height: theme.spacing(3) },
  empty: {
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(12),
    paddingHorizontal: theme.spacing(6),
  },
  emptyText: { fontSize: 15, fontWeight: '600', color: theme.colors.text, textAlign: 'center' },
  emptyHint: { fontSize: 13, color: theme.colors.muted, textAlign: 'center' },
});
