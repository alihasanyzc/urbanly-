import type { Place } from '@urbanly/shared';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';
import { usePlaces } from './usePlaces';

/** Keşif ekranı — mekân listesi. Yükleme/hata/boş durumları ele alınır (bkz. CLAUDE.md §5.2). */
export function PlacesListScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = usePlaces();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Mekânlar yüklenemedi.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={data?.data ?? []}
      keyExtractor={(item) => item.id}
      onRefresh={refetch}
      refreshing={isRefetching}
      ListEmptyComponent={<Text style={styles.muted}>Henüz mekân yok.</Text>}
      renderItem={({ item }) => <PlaceRow place={item} />}
    />
  );
}

function PlaceRow({ place }: { place: Place }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{place.name}</Text>
      <Text style={styles.muted}>{place.category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: theme.spacing(4), gap: theme.spacing(3) },
  card: {
    padding: theme.spacing(4),
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  name: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  muted: { color: theme.colors.muted, marginTop: 2 },
  error: { color: theme.colors.danger },
});
