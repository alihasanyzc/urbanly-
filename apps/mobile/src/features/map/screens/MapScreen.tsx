import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Place, PlaceCategory } from '@urbanly/shared';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../../navigation/RootNavigator';
import { useLocationStore } from '../../../store/location.store';
import { theme } from '../../../theme';
import { CategoryFilterBar } from '../components/CategoryFilterBar';
import { PlaceBottomSheet } from '../components/PlaceBottomSheet';
import { CATEGORY_META } from '../data/categories';
import { MOCK_ORIGIN, MOCK_PLACES } from '../data/mockPlaces';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_W - theme.spacing(4) * 2;

const INITIAL_REGION: Region = {
  latitude: MOCK_ORIGIN.lat,
  longitude: MOCK_ORIGIN.lng,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

/** Kategori seçili değilse tümü, seçiliyse yalnız o kategori. */
function filterPlaces(all: Place[], category: PlaceCategory | null): Place[] {
  if (!category) return all;
  return all.filter((p) => p.category === category);
}

/** Ana ekran — kategori ikonlu markerlar + seçili mekân bottom sheet'i. */
export function MapScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  // Cihaz konumu — açılışta bir kez istenir (kullanıcı noktası + mesafe için).
  const requestLocation = useLocationStore((s) => s.requestLocation);
  const locationStatus = useLocationStore((s) => s.status);
  useEffect(() => {
    void requestLocation();
  }, [requestLocation]);

  // Kategori TEK seçim (filtre görevi). Seçili mekân: null → bottom sheet kapalı.
  const [activeCategory, setActiveCategory] = useState<PlaceCategory | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);

  const places = useMemo(() => filterPlaces(MOCK_PLACES, activeCategory), [activeCategory]);

  // Filtre değişince ilk mekânı seç (yeni listenin başı).
  useEffect(() => {
    setSelectedIndex(places.length > 0 ? 0 : null);
  }, [places]);

  // Seçili mekân değiştiğinde haritayı ona ortala.
  useEffect(() => {
    if (selectedIndex == null) return;
    const place = places[selectedIndex];
    if (!place) return;
    mapRef.current?.animateToRegion(
      {
        latitude: place.location.lat,
        longitude: place.location.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      350,
    );
  }, [selectedIndex, places]);

  // Aynı kategoriye tekrar basınca filtre kalkar (tümü gösterilir).
  const selectCategory = (c: PlaceCategory) =>
    setActiveCategory((prev) => (prev === c ? null : c));

  const openDetail = (place: Place) =>
    navigation.navigate('PlaceDetail', { placeId: place.id });

  const selected = selectedIndex != null ? places[selectedIndex] : undefined;

  return (
    <View style={styles.root}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
        showsUserLocation={locationStatus === 'granted'}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        // Haritanın boş bir yerine (marker/kart dışına) dokununca bottom sheet kapanır.
        onPress={() => setSelectedIndex(null)}
      >
        {places.map((place, index) => {
          const meta = CATEGORY_META[place.category];
          const isSelected = index === selectedIndex;
          return (
            <Marker
              key={place.id}
              coordinate={{ latitude: place.location.lat, longitude: place.location.lng }}
              onPress={() => setSelectedIndex(index)}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View
                style={[
                  styles.marker,
                  { borderColor: meta.color },
                  isSelected && { backgroundColor: meta.color, transform: [{ scale: 1.15 }] },
                ]}
              >
                <Ionicons name={meta.icon} size={18} color={isSelected ? '#ffffff' : meta.color} />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Üst filtre çubuğu */}
      <View style={[styles.topBar, { paddingTop: insets.top + theme.spacing(2) }]}>
        <CategoryFilterBar activeCategory={activeCategory} onSelectCategory={selectCategory} />
      </View>

      {/* Alt bölge: seçili mekân kartı, sonuç yoksa boş durum, kapalıysa hiçbir şey. */}
      {selected ? (
        <PlaceBottomSheet place={selected} cardWidth={CARD_WIDTH} onPressDetail={openDetail} />
      ) : places.length === 0 ? (
        <View style={[styles.empty, { paddingBottom: insets.bottom + theme.spacing(4) }]}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Bu filtrede mekân yok.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setActiveCategory(null)}
              hitSlop={8}
            >
              <Text style={styles.emptyReset}>Filtreyi temizle</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, paddingBottom: theme.spacing(2) },
  marker: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 2,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  empty: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  emptyCard: {
    backgroundColor: theme.colors.bg,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing(4),
    paddingHorizontal: theme.spacing(6),
    alignItems: 'center',
    gap: theme.spacing(2),
    marginHorizontal: theme.spacing(4),
  },
  emptyText: { fontSize: 14, color: theme.colors.text, fontWeight: '500' },
  emptyReset: { fontSize: 14, color: theme.colors.primary, fontWeight: '600' },
});
