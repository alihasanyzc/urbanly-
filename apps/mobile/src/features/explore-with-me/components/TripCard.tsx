import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { TripListing } from '../types';
import { formatDepart } from '../utils/datetime';
import { theme } from '../../../theme';
import { CATEGORY_META } from './TripCategoryTabs';

interface Props {
  listing: TripListing;
  onAction: (listing: TripListing) => void;
}

/**
 * Aksiyon etiketi kategoriye göre:
 * - buddy: ilan sahibiyle birlikte gez.
 * - passenger: ilan sahibi şoför; uygulama kullanıcısı yolcu olur (koltuk ister).
 */
const ACTION: Record<TripListing['category'], { label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }> = {
  buddy: { label: 'Birlikte Gez', icon: 'people-outline' },
  passenger: { label: 'Yolcu Ol', icon: 'car-outline' },
};

/** Tek ilan kartı — yazar, rota (kalkış → varış), zaman, not + kategoriye özel aksiyon. */
export function TripCard({ listing, onAction }: Props) {
  const cat = CATEGORY_META[listing.category];
  const action = ACTION[listing.category];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: listing.author.avatarUrl }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.author} numberOfLines={1}>
            {listing.author.name}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#f59e0b" />
            <Text style={styles.rating}>{listing.author.rating.toFixed(1)}</Text>
          </View>
        </View>
        <View style={styles.catBadge}>
          <Ionicons name={cat.icon} size={12} color={theme.colors.primary} />
          <Text style={styles.catText}>{cat.label}</Text>
        </View>
      </View>

      {/* Rota: kalkış → varış. */}
      <View style={styles.route}>
        <View style={styles.routePoint}>
          <Ionicons name="radio-button-on" size={14} color={theme.colors.primary} />
          <Text style={styles.routeText} numberOfLines={1}>
            {listing.from}
          </Text>
        </View>
        <Ionicons name="arrow-forward" size={16} color={theme.colors.muted} />
        <View style={styles.routePoint}>
          <Ionicons name="location" size={14} color={theme.colors.danger} />
          <Text style={styles.routeText} numberOfLines={1}>
            {listing.to}
          </Text>
        </View>
      </View>

      <View style={styles.timeRow}>
        <Ionicons name="time-outline" size={14} color={theme.colors.muted} />
        <Text style={styles.time}>{formatDepart(listing.departAt)}</Text>
      </View>

      {listing.note.length > 0 && <Text style={styles.note}>{listing.note}</Text>}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${listing.author.name} — ${action.label}`}
        onPress={() => onAction(listing)}
        style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
      >
        <Ionicons name={action.icon} size={18} color="#ffffff" />
        <Text style={styles.actionText}>{action.label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: theme.spacing(4),
    padding: theme.spacing(4),
    borderRadius: 18,
    backgroundColor: theme.colors.bg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: theme.spacing(3),
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing(3) },
  avatar: { width: 44, height: 44, borderRadius: 999, backgroundColor: '#f3f4f6' },
  headerText: { flex: 1 },
  author: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  rating: { fontSize: 12, color: theme.colors.muted, fontWeight: '600' },
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: theme.colors.primaryTint,
  },
  catText: { fontSize: 12, fontWeight: '700', color: theme.colors.primary },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingVertical: theme.spacing(2),
    paddingHorizontal: theme.spacing(3),
    borderRadius: theme.radius,
    backgroundColor: '#f9fafb',
  },
  routePoint: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  routeText: { fontSize: 15, fontWeight: '700', color: theme.colors.text, flexShrink: 1 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  time: { fontSize: 13, color: theme.colors.muted, fontWeight: '600' },
  note: { fontSize: 14.5, lineHeight: 21, color: theme.colors.text },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
  },
  pressed: { opacity: 0.85 },
  actionText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});
