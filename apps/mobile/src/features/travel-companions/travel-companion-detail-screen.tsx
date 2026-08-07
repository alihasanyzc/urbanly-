import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { theme } from '../../theme';
import { getTravelPlanById, type TravelReview } from './mock-travel-plans';

type Props = NativeStackScreenProps<RootStackParamList, 'TravelCompanionDetail'>;
type IconName = keyof typeof Ionicons.glyphMap;

const DATE_FORMATTER = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const REVIEW_DATE_FORMATTER = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

/** Yol arkadaşı ilanının profil, seyahat planı ve değerlendirme ayrıntıları. */
export function TravelCompanionDetailScreen({ route, navigation }: Props) {
  const [requestSent, setRequestSent] = useState(false);
  const plan = getTravelPlanById(route.params.planId);

  if (!plan) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.notFoundContent}
        style={styles.root}
      >
        <View style={styles.notFoundIcon}>
          <Ionicons name="compass-outline" size={32} color={theme.colors.muted} />
        </View>
        <Text selectable style={styles.notFoundTitle}>
          Seyahat planı bulunamadı
        </Text>
        <Text selectable style={styles.notFoundText}>
          Bu ilan kaldırılmış veya artık yayında olmayabilir.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Seyahat planlarına dön"
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Text style={styles.backButtonText}>Geri dön</Text>
        </Pressable>
      </ScrollView>
    );
  }

  const availableCompanionCount = Math.max(plan.maxCompanions - plan.joinedCount, 0);
  const transportIcon = getTransportIcon(plan.transportPreference);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={styles.root}
    >
      <View style={styles.profileSection}>
        <Image
          source={{ uri: plan.traveler.avatarUrl }}
          accessibilityLabel={`${plan.traveler.displayName} profil fotoğrafı`}
          style={styles.avatar}
        />
        <View style={styles.profileContent}>
          <View style={styles.nameRow}>
            <Text selectable numberOfLines={1} style={styles.displayName}>
              {plan.traveler.displayName}
            </Text>
            {plan.traveler.verified && (
              <Ionicons
                accessibilityLabel="Doğrulanmış profil"
                name="checkmark-circle"
                size={19}
                color={theme.colors.primary}
              />
            )}
          </View>
          <Text style={styles.profileMeta}>
            @{plan.traveler.username} · {plan.traveler.age} yaşında
          </Text>
          <View style={styles.completedTripsRow}>
            <Ionicons name="shield-checkmark-outline" size={15} color="#15803d" />
            <Text style={styles.completedTripsText}>
              {plan.completedTripCount} tamamlanan seyahat
            </Text>
          </View>
        </View>
      </View>

      <Text selectable style={styles.bio}>
        {plan.traveler.bio}
      </Text>

      <View
        accessible
        accessibilityLabel={`${plan.origin} çıkışlı, ${plan.destination} varışlı seyahat`}
        style={styles.routeCard}
      >
        <View style={styles.routeGraphic}>
          <View style={styles.originDot} />
          <View style={styles.routeLine} />
          <Ionicons name="location" size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.routeContent}>
          <View>
            <Text style={styles.routeLabel}>GİDİŞ</Text>
            <Text selectable style={styles.routeCity}>
              {plan.origin}
            </Text>
          </View>
          <View>
            <Text style={styles.routeLabel}>VARIŞ</Text>
            <Text selectable style={styles.routeCity}>
              {plan.destination}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.factGrid}>
        <TravelFact
          icon="calendar-outline"
          label="Gidiş tarihi"
          value={formatDateTime(plan.departureAt)}
        />
        <TravelFact
          icon="return-up-back-outline"
          label="Dönüş tarihi"
          value={plan.returnAt ? formatDateTime(plan.returnAt) : 'Tek yön'}
        />
        <TravelFact icon={transportIcon} label="Ulaşım tercihi" value={plan.transportPreference} />
        <TravelFact
          icon="people-outline"
          label="Kontenjan"
          value={
            availableCompanionCount > 0
              ? `${availableCompanionCount} kişilik yer kaldı`
              : 'Kontenjan doldu'
          }
        />
      </View>

      <Section title="Seyahat hakkında">
        <Text selectable style={styles.description}>
          {plan.description}
        </Text>
        <View style={styles.capacityRow}>
          <Ionicons name="people" size={17} color={theme.colors.primary} />
          <Text style={styles.capacityText}>
            {plan.joinedCount} katılımcı · En fazla {plan.maxCompanions} yol arkadaşı
          </Text>
        </View>
      </Section>

      {plan.interests.length > 0 && (
        <Section title="Ortak ilgi alanları">
          <View style={styles.interestList}>
            {plan.interests.map((interest) => (
              <View key={interest} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </Section>
      )}

      <Section title="Puan ve yorumlar">
        <View
          accessible
          accessibilityLabel={`5 üzerinden ${formatRating(plan.rating)} puan, ${plan.reviewCount} yorum`}
          style={styles.ratingSummary}
        >
          <View style={styles.ratingValueRow}>
            <Ionicons name="star" size={23} color="#f59e0b" />
            <Text style={styles.ratingValue}>{formatRating(plan.rating)}</Text>
          </View>
          <Text style={styles.reviewCount}>{plan.reviewCount} değerlendirme</Text>
        </View>

        {plan.reviews.length > 0 ? (
          <View style={styles.reviewList}>
            {plan.reviews.map((review, index) => (
              <View key={review.id}>
                {index > 0 && <View style={styles.reviewDivider} />}
                <ReviewRow review={review} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noReviews}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={theme.colors.muted} />
            <Text style={styles.noReviewsText}>Henüz yazılı değerlendirme yok.</Text>
          </View>
        )}
      </Section>

      <View style={styles.safetyCard}>
        <View style={styles.safetyIcon}>
          <Ionicons name="shield-checkmark" size={22} color="#15803d" />
        </View>
        <View style={styles.safetyContent}>
          <Text style={styles.safetyTitle}>Güvenli seyahat</Text>
          <Text selectable style={styles.safetyText}>
            Yolculuk öncesi detayları konuş, ilk buluşmanı kamusal bir yerde yap ve planını
            güvendiğin biriyle paylaş.
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={requestSent ? 'Seyahat isteğini geri çek' : 'Seyahat isteği gönder'}
        accessibilityState={{ selected: requestSent }}
        onPress={() => setRequestSent((isSent) => !isSent)}
        style={({ pressed }) => [
          styles.requestButton,
          requestSent && styles.requestButtonSent,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons
          name={requestSent ? 'checkmark-circle' : 'paper-plane-outline'}
          size={21}
          color={requestSent ? '#15803d' : '#ffffff'}
        />
        <Text style={[styles.requestButtonText, requestSent && styles.requestButtonTextSent]}>
          {requestSent ? 'İstek gönderildi' : 'Seyahat isteği gönder'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function TravelFact({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.factCard}>
      <View style={styles.factIcon}>
        <Ionicons name={icon} size={19} color={theme.colors.primary} />
      </View>
      <View style={styles.factContent}>
        <Text style={styles.factLabel}>{label}</Text>
        <Text selectable style={styles.factValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ReviewRow({ review }: { review: TravelReview }) {
  return (
    <View style={styles.reviewRow}>
      <Image
        source={{ uri: review.reviewer.avatarUrl }}
        accessibilityLabel={`${review.reviewer.displayName} profil fotoğrafı`}
        style={styles.reviewAvatar}
      />
      <View style={styles.reviewContent}>
        <View style={styles.reviewHeader}>
          <Text selectable numberOfLines={1} style={styles.reviewerName}>
            {review.reviewer.displayName}
          </Text>
          <Text style={styles.reviewDate}>{formatReviewDate(review.createdAt)}</Text>
        </View>
        <View accessible accessibilityLabel={`${review.rating} yıldız`} style={styles.starsRow}>
          {Array.from({ length: 5 }, (_, index) => (
            <Ionicons
              key={index}
              name={index < Math.round(review.rating) ? 'star' : 'star-outline'}
              size={14}
              color="#f59e0b"
            />
          ))}
        </View>
        <Text selectable style={styles.reviewComment}>
          {review.comment}
        </Text>
      </View>
    </View>
  );
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : DATE_FORMATTER.format(date);
}

function formatReviewDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : REVIEW_DATE_FORMATTER.format(date);
}

function formatRating(rating: number): string {
  return rating.toFixed(1).replace('.', ',');
}

function getTransportIcon(preference: string): IconName {
  const normalizedPreference = preference.toLocaleLowerCase('tr-TR');

  if (normalizedPreference.includes('uçak')) return 'airplane-outline';
  if (normalizedPreference.includes('tren')) return 'train-outline';
  if (normalizedPreference.includes('otobüs')) return 'bus-outline';
  if (normalizedPreference.includes('bisiklet')) return 'bicycle-outline';
  return 'car-sport-outline';
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  content: {
    gap: theme.spacing(5),
    paddingHorizontal: theme.spacing(4),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(10),
  },
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing(3) },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#dbeafe',
    backgroundColor: theme.colors.border,
  },
  profileContent: { flex: 1, minWidth: 0, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  displayName: { flexShrink: 1, fontSize: 21, fontWeight: '800', color: theme.colors.text },
  profileMeta: { fontSize: 14, color: theme.colors.muted },
  completedTripsRow: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingTop: 2 },
  completedTripsText: { fontSize: 12, fontWeight: '700', color: '#15803d' },
  bio: { marginTop: -8, fontSize: 14, lineHeight: 21, color: theme.colors.text },
  routeCard: {
    flexDirection: 'row',
    gap: theme.spacing(3),
    padding: theme.spacing(4),
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 18,
    backgroundColor: '#eff6ff',
  },
  routeGraphic: { width: 20, alignItems: 'center', paddingVertical: 5 },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    backgroundColor: '#ffffff',
  },
  routeLine: { flex: 1, width: 2, minHeight: 30, backgroundColor: '#93c5fd' },
  routeContent: { flex: 1, gap: theme.spacing(5) },
  routeLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8, color: theme.colors.primary },
  routeCity: { paddingTop: 2, fontSize: 19, fontWeight: '800', color: theme.colors.text },
  factGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(2) },
  factCard: {
    width: '48.7%',
    minHeight: 106,
    gap: theme.spacing(2),
    padding: theme.spacing(3),
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius,
    backgroundColor: '#ffffff',
  },
  factIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#eff6ff',
  },
  factContent: { flex: 1, gap: 3 },
  factLabel: { fontSize: 11, fontWeight: '600', color: theme.colors.muted },
  factValue: { fontSize: 13, lineHeight: 18, fontWeight: '700', color: theme.colors.text },
  section: {
    gap: theme.spacing(3),
    paddingTop: theme.spacing(5),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  description: { fontSize: 15, lineHeight: 23, color: theme.colors.text },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(3),
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  capacityText: { flex: 1, fontSize: 13, fontWeight: '600', color: theme.colors.text },
  interestList: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(2) },
  interestChip: {
    minHeight: 32,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing(3),
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
  },
  interestText: { fontSize: 13, fontWeight: '600', color: theme.colors.text },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(3),
    borderRadius: 12,
    backgroundColor: '#fffbeb',
  },
  ratingValueRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing(2) },
  ratingValue: { fontSize: 24, fontWeight: '800', color: theme.colors.text },
  reviewCount: { fontSize: 13, fontWeight: '600', color: theme.colors.muted },
  reviewList: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius,
  },
  reviewDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 72,
    backgroundColor: theme.colors.border,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing(3),
    padding: theme.spacing(3),
  },
  reviewAvatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
  },
  reviewContent: { flex: 1, minWidth: 0, gap: 5 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing(2) },
  reviewerName: { flex: 1, fontSize: 14, fontWeight: '800', color: theme.colors.text },
  reviewDate: { fontSize: 11, color: theme.colors.muted },
  starsRow: { flexDirection: 'row', alignSelf: 'flex-start' },
  reviewComment: { fontSize: 14, lineHeight: 20, color: theme.colors.text },
  noReviews: {
    minHeight: 96,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius,
  },
  noReviewsText: { fontSize: 13, color: theme.colors.muted },
  safetyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing(3),
    padding: theme.spacing(4),
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: theme.radius,
    backgroundColor: '#f0fdf4',
  },
  safetyIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#dcfce7',
  },
  safetyContent: { flex: 1, gap: 5 },
  safetyTitle: { fontSize: 15, fontWeight: '800', color: '#166534' },
  safetyText: { fontSize: 13, lineHeight: 19, color: '#166534' },
  requestButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    paddingHorizontal: theme.spacing(4),
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
  },
  requestButtonSent: { borderWidth: 1, borderColor: '#86efac', backgroundColor: '#dcfce7' },
  requestButtonText: { fontSize: 16, fontWeight: '800', color: '#ffffff' },
  requestButtonTextSent: { color: '#15803d' },
  pressed: { opacity: 0.78 },
  notFoundContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(3),
    padding: theme.spacing(6),
  },
  notFoundIcon: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
  },
  notFoundTitle: { fontSize: 19, fontWeight: '800', color: theme.colors.text, textAlign: 'center' },
  notFoundText: { fontSize: 14, lineHeight: 20, color: theme.colors.muted, textAlign: 'center' },
  backButton: {
    minWidth: 120,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing(4),
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  backButtonText: { fontSize: 14, fontWeight: '700', color: '#ffffff' },
});
