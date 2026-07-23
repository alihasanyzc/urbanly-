import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Dimensions, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../../navigation/RootNavigator';
import { useLocationStore } from '../../../store/location.store';
import { theme } from '../../../theme';
import { ImageGallery } from '../components/ImageGallery';
import { AMENITY_META, CATEGORY_META, TAG_META } from '../data/categories';
import { MOCK_ORIGIN, MOCK_PLACES } from '../data/mockPlaces';
import { distanceKm, formatDistance } from '../utils/distance';
import { openDirections } from '../utils/directions';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaceDetail'>;

const { width: SCREEN_W } = Dimensions.get('window');

/** Mekân detay ekranı — galeri, bilgi, özellikler, mini harita + sabit Yol Tarifi barı. */
export function PlaceDetailScreen({ route }: Props) {
  const insets = useSafeAreaInsets();
  const origin = useLocationStore((s) => s.coords) ?? MOCK_ORIGIN;
  const place = MOCK_PLACES.find((p) => p.id === route.params.placeId);

  // Detay verisi mock listesinden çözülür; backend gelince fetch ile değişecek.
  if (!place) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Mekân bulunamadı.</Text>
      </View>
    );
  }

  const cat = CATEGORY_META[place.category];
  const dist = formatDistance(distanceKm(origin, place.location));
  const images = place.images.length > 0 ? place.images : place.imageUrl ? [place.imageUrl] : [];
  const priceText = place.priceLevel ? '₺'.repeat(place.priceLevel) : null;

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
        showsVerticalScrollIndicator={false}
      >
        <ImageGallery images={images} width={SCREEN_W} height={280} />

        <View style={styles.body}>
          {/* Başlık: kategori rozeti + isim + puan/fiyat/mesafe. */}
          <View style={[styles.badge, { backgroundColor: cat.color }]}>
            <Ionicons name={cat.icon} size={13} color="#ffffff" />
            <Text style={styles.badgeText}>{cat.label}</Text>
          </View>
          <Text style={styles.name}>{place.name}</Text>

          <View style={styles.statRow}>
            {place.rating != null && (
              <View style={styles.stat}>
                <Ionicons name="star-outline" size={15} color="#f59e0b" />
                <Text style={styles.statText}>{place.rating.toFixed(1)}</Text>
                <Text style={styles.statMuted}>({place.ratingCount})</Text>
              </View>
            )}
            {priceText && <Text style={styles.statText}>{priceText}</Text>}
            <View style={styles.stat}>
              <Ionicons name="location-outline" size={15} color={theme.colors.muted} />
              <Text style={styles.statText}>{dist}</Text>
            </View>
          </View>

          {place.description && <Text style={styles.desc}>{place.description}</Text>}

          {/* Etiketler (kategoriden bağımsız özellikler) */}
          {place.tags.length > 0 && (
            <View style={styles.tagRow}>
              {place.tags.map((t) => (
                <View key={t} style={styles.tag}>
                  <Ionicons name={TAG_META[t].icon} size={13} color={theme.colors.text} />
                  <Text style={styles.tagText}>{TAG_META[t].label}</Text>
                </View>
              ))}
            </View>
          )}

          <Divider />

          {/* Bilgi satırları — yalnızca dolu alanlar gösterilir; telefon/web dokunulabilir. */}
          <View style={styles.infoBlock}>
            {place.openHours && <InfoRow icon="time-outline" text={place.openHours} />}
            {place.address && <InfoRow icon="location-outline" text={place.address} />}
            {place.phone && (
              <InfoRow
                icon="call-outline"
                text={place.phone}
                onPress={() => void Linking.openURL(`tel:${place.phone}`)}
              />
            )}
            {place.website && (
              <InfoRow
                icon="globe-outline"
                text={place.website.replace(/^https?:\/\//, '')}
                onPress={() => place.website && void Linking.openURL(place.website)}
              />
            )}
          </View>

          {/* Özellikler (olanaklar) */}
          {place.amenities.length > 0 && (
            <>
              <Divider />
              <Text style={styles.sectionTitle}>Özellikler</Text>
              <View style={styles.amenityGrid}>
                {place.amenities.map((a) => (
                  <View key={a} style={styles.amenity}>
                    <Ionicons name={AMENITY_META[a].icon} size={18} color={theme.colors.text} />
                    <Text style={styles.amenityText}>{AMENITY_META[a].label}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <Divider />

          {/* Mini harita — statik önizleme (dokunma kapalı). */}
          <Text style={styles.sectionTitle}>Konum</Text>
          <View style={styles.mapWrap}>
            <MapView
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
              initialRegion={{
                latitude: place.location.lat,
                longitude: place.location.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={{ latitude: place.location.lat, longitude: place.location.lng }}>
                <View style={[styles.marker, { borderColor: cat.color }]}>
                  <Ionicons name={cat.icon} size={16} color={cat.color} />
                </View>
              </Marker>
            </MapView>
          </View>
        </View>
      </ScrollView>

      {/* Sabit alt aksiyon: Yol Tarifi */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + theme.spacing(2) }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${place.name} için yol tarifi al`}
          onPress={() => void openDirections(place.location, place.name)}
          style={({ pressed }) => [styles.directionsBtn, pressed && styles.pressed]}
        >
          <Text style={styles.directionsText}>Yol Tarifi</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Tek bir bilgi satırı (ikon + metin). onPress verilirse dokunulabilir bağlantı olur. */
function InfoRow({
  icon,
  text,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  onPress?: () => void;
}) {
  const content = (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={theme.colors.muted} />
      <Text style={[styles.infoText, onPress && styles.link]}>{text}</Text>
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} hitSlop={6}>
      {content}
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  body: { padding: theme.spacing(4), gap: theme.spacing(2) },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: theme.spacing(3),
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  name: { fontSize: 26, fontWeight: '800', color: theme.colors.text, marginTop: 2 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing(4), marginTop: 2 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  statMuted: { color: theme.colors.muted, fontWeight: '500', fontSize: 14 },
  desc: { fontSize: 15, lineHeight: 22, color: theme.colors.text, marginTop: theme.spacing(2) },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(2), marginTop: theme.spacing(2) },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: theme.spacing(3),
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
  },
  tagText: { fontSize: 13, color: theme.colors.text, fontWeight: '600' },
  divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: theme.spacing(3) },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing(2) },
  infoBlock: { gap: theme.spacing(3) },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing(3) },
  infoText: { flex: 1, fontSize: 15, color: theme.colors.text },
  link: { color: theme.colors.primary, fontWeight: '600' },
  amenityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(3) },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingVertical: theme.spacing(2),
    paddingHorizontal: theme.spacing(3),
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    minWidth: '46%',
  },
  amenityText: { fontSize: 14, color: theme.colors.text, fontWeight: '500' },
  mapWrap: {
    height: 160,
    borderRadius: theme.radius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  marker: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 2,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: theme.spacing(4),
    paddingTop: theme.spacing(3),
    backgroundColor: theme.colors.bg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
  },
  pressed: { opacity: 0.85 },
  directionsText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  muted: { color: theme.colors.muted },
});
