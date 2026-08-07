import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';
import type { TravelPlan } from './mock-travel-plans';

interface TravelCompanionCardProps {
  plan: TravelPlan;
  onPress: () => void;
}

type IoniconName = ComponentProps<typeof Ionicons>['name'];

/** Seyahat arkadaşı arama sonuçlarında gösterilen kısa plan özeti. */
export function TravelCompanionCard({ plan, onPress }: TravelCompanionCardProps) {
  const openSpotCount = Math.max(0, plan.maxCompanions - plan.joinedCount);
  const openSpotLabel = openSpotCount > 0 ? `${openSpotCount} kişilik yer` : 'Dolu';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${plan.traveler.displayName}, ${plan.origin} konumundan ${plan.destination} konumuna, ${formatDepartureDate(plan.departureAt)}, ${openSpotLabel}`}
      accessibilityHint="Seyahat detaylarını, yorumları ve puanları açar"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.travelerRow}>
        <Image
          source={{ uri: plan.traveler.avatarUrl }}
          accessibilityLabel={`${plan.traveler.displayName} profil fotoğrafı`}
          style={styles.avatar}
        />

        <View style={styles.travelerInfo}>
          <View style={styles.nameRow}>
            <Text selectable style={styles.displayName} numberOfLines={1}>
              {plan.traveler.displayName}
            </Text>
            {plan.traveler.verified && (
              <Ionicons
                name="checkmark-circle"
                size={17}
                color={theme.colors.primary}
                accessibilityLabel="Doğrulanmış profil"
              />
            )}
          </View>
          <Text style={styles.username} numberOfLines={1}>
            @{plan.traveler.username} · {plan.traveler.age} yaş
          </Text>
        </View>

        <View
          style={styles.rating}
          accessibilityLabel={`${formatRating(plan.rating)} puan, ${plan.reviewCount} yorum`}
        >
          <Ionicons name="star" size={16} color="#f59e0b" />
          <Text style={styles.ratingValue}>{formatRating(plan.rating)}</Text>
          <Text style={styles.reviewCount}>({plan.reviewCount})</Text>
        </View>
      </View>

      <View style={styles.route}>
        <View style={styles.timeline}>
          <View style={styles.originDot} />
          <View style={styles.timelineLine} />
          <Ionicons name="location" size={18} color={theme.colors.primary} />
        </View>
        <View style={styles.routeLabels}>
          <View style={styles.routeStop}>
            <Text style={styles.routeCaption}>Gidiş</Text>
            <Text selectable style={styles.routeName} numberOfLines={1}>
              {plan.origin}
            </Text>
          </View>
          <View style={styles.routeStop}>
            <Text style={styles.routeCaption}>Varış</Text>
            <Text selectable style={styles.routeName} numberOfLines={1}>
              {plan.destination}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tripMetadata}>
        <MetadataItem icon="calendar-outline" label={formatDepartureDate(plan.departureAt)} />
        <MetadataItem
          icon={getTransportIcon(plan.transportPreference)}
          label={plan.transportPreference}
        />
      </View>

      <Text selectable style={styles.description} numberOfLines={2}>
        {plan.description}
      </Text>

      <View style={styles.footer}>
        <View style={[styles.capacityBadge, openSpotCount === 0 && styles.fullBadge]}>
          <Ionicons
            name={openSpotCount > 0 ? 'people-outline' : 'lock-closed-outline'}
            size={16}
            color={openSpotCount > 0 ? theme.colors.primary : theme.colors.muted}
          />
          <Text style={[styles.capacityText, openSpotCount === 0 && styles.fullText]}>
            {openSpotLabel}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
      </View>
    </Pressable>
  );
}

function MetadataItem({ icon, label }: { icon: IoniconName; label: string }) {
  return (
    <View style={styles.metadataItem}>
      <Ionicons name={icon} size={16} color={theme.colors.muted} />
      <Text selectable style={styles.metadataText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function formatDepartureDate(departureAt: string): string {
  return new Intl.DateTimeFormat('tr-TR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(departureAt));
}

function formatRating(rating: number): string {
  return rating.toLocaleString('tr-TR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function getTransportIcon(transportPreference: string): IoniconName {
  const normalizedPreference = transportPreference.toLocaleLowerCase('tr-TR');

  if (normalizedPreference.includes('uçak')) return 'airplane-outline';
  if (normalizedPreference.includes('tren')) return 'train-outline';
  if (normalizedPreference.includes('otobüs')) return 'bus-outline';
  if (normalizedPreference.includes('araba') || normalizedPreference.includes('otomobil')) {
    return 'car-outline';
  }
  if (normalizedPreference.includes('bisiklet')) return 'bicycle-outline';

  return 'navigate-outline';
}

const styles = StyleSheet.create({
  card: {
    minHeight: 44,
    gap: theme.spacing(4),
    padding: theme.spacing(4),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: 18,
    backgroundColor: theme.colors.bg,
  },
  cardPressed: { opacity: 0.78, transform: [{ scale: 0.995 }] },
  travelerRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing(3) },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
  },
  travelerInfo: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  displayName: {
    flexShrink: 1,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  username: { paddingTop: 2, color: theme.colors.muted, fontSize: 12 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingValue: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  reviewCount: {
    color: theme.colors.muted,
    fontSize: 11,
    fontVariant: ['tabular-nums'],
  },
  route: { flexDirection: 'row', gap: theme.spacing(3) },
  timeline: { width: 18, alignItems: 'center', paddingVertical: 5 },
  originDot: {
    width: 10,
    height: 10,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    borderRadius: 999,
    backgroundColor: theme.colors.bg,
  },
  timelineLine: { flex: 1, width: 2, minHeight: 28, backgroundColor: theme.colors.border },
  routeLabels: { flex: 1, gap: theme.spacing(3) },
  routeStop: { minHeight: 34, justifyContent: 'center' },
  routeCaption: {
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  routeName: { color: theme.colors.text, fontSize: 16, fontWeight: '800' },
  tripMetadata: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(2) },
  metadataItem: {
    minHeight: 32,
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: theme.spacing(2),
    borderRadius: 10,
    backgroundColor: '#f8fafc',
  },
  metadataText: {
    flexShrink: 1,
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  description: { color: theme.colors.text, fontSize: 14, lineHeight: 20 },
  footer: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing(3),
  },
  capacityBadge: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: theme.spacing(3),
    borderRadius: 999,
    backgroundColor: '#eff6ff',
  },
  fullBadge: { backgroundColor: '#f1f5f9' },
  capacityText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  fullText: { color: theme.colors.muted },
});
