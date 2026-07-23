import { Ionicons } from '@expo/vector-icons';
import type { Place } from '@urbanly/shared';
import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../theme';
import { useLocationStore } from '../../../store/location.store';
import { CATEGORY_META, TAG_META } from '../data/categories';
import { MOCK_ORIGIN } from '../data/mockPlaces';
import { distanceKm, formatDistance } from '../utils/distance';
import { openDirections } from '../utils/directions';
import { ImageGallery } from './ImageGallery';

const IMAGE_HEIGHT = 168;

interface Props {
  place: Place;
  width: number;
  onPressDetail: (place: Place) => void;
}

/**
 * Bottom sheet'te tek mekânın glassmorphism (buzlu cam) önizleme kartı.
 * Kart gövdesine dokunmak detayı açar; alttaki buton yol tarifini başlatır.
 */
export function PlaceCard({ place, width, onPressDetail }: Props) {
  const cat = CATEGORY_META[place.category];
  // Mesafe kullanıcının konumundan; izin yoksa mock merkeze düşer.
  const origin = useLocationStore((s) => s.coords) ?? MOCK_ORIGIN;
  const dist = formatDistance(distanceKm(origin, place.location));
  const images = place.images.length > 0 ? place.images : place.imageUrl ? [place.imageUrl] : [];

  return (
    // Dış katman: gölge + yuvarlak köşe (overflow bırakılır — iOS'ta gölgenin kırpılmaması için).
    <View style={[styles.shadow, { width }]}>
      {/* İç katman: buzlu cam + köşe kırpma. */}
      <View style={styles.clip}>
        <BlurView intensity={55} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.tint} pointerEvents="none" />

        {/* Görsel galerisi — sağa-sola kaydırılır. Üstünde kategori rozeti ve puan. */}
        <View>
          <ImageGallery images={images} width={width} height={IMAGE_HEIGHT} />
          <View style={[styles.badge, { backgroundColor: cat.color }]}>
            <Ionicons name={cat.icon} size={12} color="#ffffff" />
            <Text style={styles.badgeText}>{cat.label}</Text>
          </View>
          {place.rating != null && (
            <View style={styles.ratingPill}>
              <Ionicons name="star-outline" size={12} color="#fbbf24" />
              <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>({place.ratingCount})</Text>
            </View>
          )}
        </View>

        {/* Bilgi bloğu — dokununca detay ekranı açılır. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${place.name} detayını aç`}
          onPress={() => onPressDetail(place)}
          style={styles.body}
        >
          <Text style={styles.name} numberOfLines={1}>
            {place.name}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={13} color={theme.colors.muted} />
            <Text style={styles.meta}>{dist} uzaklıkta</Text>
          </View>
          {place.description && (
            <Text style={styles.desc} numberOfLines={2}>
              {place.description}
            </Text>
          )}
          {place.tags.length > 0 && (
            <View style={styles.tagRow}>
              {place.tags.map((t) => (
                <View key={t} style={styles.tag}>
                  <Ionicons name={TAG_META[t].icon} size={12} color={theme.colors.text} />
                  <Text style={styles.tagText}>{TAG_META[t].label}</Text>
                </View>
              ))}
            </View>
          )}
        </Pressable>

        {/* Ana aksiyon: Yol Tarifi. */}
        <View style={styles.actions}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 22,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  clip: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  // Buzlu camın üstüne hafif beyaz tül — metin okunurluğu + cam parlaklığı.
  tint: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.45)' },
  badge: {
    position: 'absolute',
    top: theme.spacing(3),
    left: theme.spacing(3),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  ratingPill: {
    position: 'absolute',
    top: theme.spacing(3),
    right: theme.spacing(3),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  ratingText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  ratingCount: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '500' },
  body: { paddingHorizontal: theme.spacing(4), paddingTop: theme.spacing(3), gap: theme.spacing(1) },
  name: { fontSize: 19, fontWeight: '700', color: theme.colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { fontSize: 13, color: theme.colors.muted, fontWeight: '500' },
  desc: { fontSize: 14, color: theme.colors.text, lineHeight: 20, marginTop: 2 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(2), marginTop: theme.spacing(2) },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  tagText: { fontSize: 12, color: theme.colors.text, fontWeight: '600' },
  actions: { padding: theme.spacing(4), paddingTop: theme.spacing(3) },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
  },
  pressed: { opacity: 0.85 },
  directionsText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
