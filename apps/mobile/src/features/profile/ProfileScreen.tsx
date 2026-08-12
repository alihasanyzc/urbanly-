import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList, TabParamList } from '../../navigation/RootNavigator';
import { TAB_BAR_SPACE } from '../../navigation/tabBarLayout';
import { theme } from '../../theme';
import { MOCK_PLACES } from '../map/data/mockPlaces';
import { PROFILE_COMMENTS } from './mock-profile';
import { ProfileCommentCard } from './profile-comment-card';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profil'>,
  NativeStackScreenProps<RootStackParamList>
>;

type ProfileTab = 'postcards' | 'comments';

const PROFILE = {
  displayName: 'Eylül Arslan',
  username: 'urbanly_user',
  avatarUrl: 'https://i.pravatar.cc/240?u=urbanly-current',
  city: 'İstanbul',
  bio: 'Şehrin sakin köşelerini, iyi kahveyi ve yürüyerek keşfedilen küçük hikâyeleri biriktiriyorum.',
  stats: [
    { label: 'Kartpostal', value: '12' },
    { label: 'Kaydedilen', value: '38' },
    { label: 'Takipçi', value: '326' },
  ],
} as const;

const PROFILE_TABS = [
  { id: 'postcards', label: 'Kartpostallar' },
  { id: 'comments', label: 'Yorumlar' },
] as const satisfies ReadonlyArray<{ id: ProfileTab; label: string }>;

const POSTCARD_SOURCES = [
  {
    id: 'profile-postcard-balat',
    placeId: 'p6',
    title: 'Balat’ta sabah ışığı',
    publishedAt: '2 gün önce',
    likeCount: 84,
  },
  {
    id: 'profile-postcard-pierre-loti',
    placeId: 'p3',
    title: 'Haliç üzerinde gün batımı',
    publishedAt: '1 hafta önce',
    likeCount: 61,
  },
] as const;

const placesById = new Map(MOCK_PLACES.map((place) => [place.id, place]));

const RECENT_POSTCARDS = POSTCARD_SOURCES.map((postcard) => {
  const place = placesById.get(postcard.placeId);

  if (!place) {
    throw new Error(`Profil kartpostalı için mekân bulunamadı: ${postcard.placeId}`);
  }

  return {
    ...postcard,
    place,
    imageUrl:
      place.imageUrl ??
      place.images[0] ??
      `https://picsum.photos/seed/urbanly-${postcard.placeId}/900/600`,
  };
});

/** Profil kimliğini, kartpostalları ve diğer kullanıcıların yorumlarını birlikte sunar. */
export function ProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ProfileTab>('postcards');

  return (
    <ScrollView
      style={styles.root}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + theme.spacing(4),
          paddingBottom: insets.bottom + TAB_BAR_SPACE + theme.spacing(5),
        },
      ]}
    >
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.eyebrow}>URBANLY</Text>
          <Text selectable style={styles.pageTitle}>
            Profil
          </Text>
        </View>
        <View style={styles.cityBadge}>
          <Ionicons name="location" size={15} color={theme.colors.primary} />
          <Text style={styles.cityBadgeText}>{PROFILE.city}</Text>
        </View>
      </View>

      <View style={styles.profileHeader}>
        <View style={styles.avatarFrame}>
          <Image
            source={{ uri: PROFILE.avatarUrl }}
            accessibilityLabel={`${PROFILE.displayName} profil fotoğrafı`}
            style={styles.avatar}
          />
        </View>

        <View style={styles.identityText}>
          <Text selectable numberOfLines={1} style={styles.displayName}>
            {PROFILE.displayName}
          </Text>
          <Text selectable numberOfLines={1} style={styles.username}>
            @{PROFILE.username}
          </Text>
          <View style={styles.memberRow}>
            <Ionicons name="sparkles-outline" size={13} color={theme.colors.primary} />
            <Text style={styles.memberText}>Şehir kâşifi · Mart 2026’dan beri</Text>
          </View>
        </View>

        <Text selectable style={styles.bio}>
          {PROFILE.bio}
        </Text>

        <View style={styles.statsRow}>
          {PROFILE.stats.map((stat, index) => (
            <View key={stat.label} style={[styles.statItem, index > 0 && styles.statItemBorder]}>
              <Text selectable style={styles.statValue}>
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Kartpostal oluştur"
        accessibilityHint="Yeni bir şehir keşfi paylaşma ekranını açar"
        onPress={() => navigation.navigate('CreatePost')}
        style={({ pressed }) => [styles.createPostcardButton, pressed && styles.buttonPressed]}
      >
        <View style={styles.createPostcardIcon}>
          <MaterialCommunityIcons name="postage-stamp" size={28} color={theme.colors.primary} />
        </View>
        <View style={styles.createPostcardText}>
          <Text style={styles.createPostcardTitle}>Kartpostal oluştur</Text>
          <Text style={styles.createPostcardSubtitle}>
            Yeni keşfini fotoğraf ve notlarınla paylaş
          </Text>
        </View>
        <Ionicons name="arrow-forward" size={20} color="#ffffff" />
      </Pressable>

      <View style={styles.profileContent}>
        <View style={styles.profileTabs}>
          {PROFILE_TABS.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <Pressable
                key={tab.id}
                accessibilityRole="tab"
                accessibilityLabel={tab.label}
                accessibilityState={{ selected: isActive }}
                onPress={() => setActiveTab(tab.id)}
                style={({ pressed }) => [styles.profileTab, pressed && styles.profileTabPressed]}
              >
                <Text style={[styles.profileTabLabel, isActive && styles.profileTabLabelActive]}>
                  {tab.label}
                </Text>
                {isActive && <View style={styles.profileTabIndicator} />}
              </Pressable>
            );
          })}
        </View>

        {activeTab === 'postcards' ? (
          <ScrollView
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.postcardRow}
          >
            {RECENT_POSTCARDS.map((postcard) => (
              <View key={postcard.id} style={styles.postcardCard}>
                <Image
                  source={{ uri: postcard.imageUrl }}
                  accessibilityLabel={`${postcard.place.name} kartpostal görseli`}
                  style={styles.postcardImage}
                />
                <View style={styles.postcardBody}>
                  <Text selectable numberOfLines={1} style={styles.postcardTitle}>
                    {postcard.title}
                  </Text>
                  <View style={styles.postcardPlaceRow}>
                    <Ionicons name="location-outline" size={14} color={theme.colors.primary} />
                    <Text numberOfLines={1} style={styles.postcardPlace}>
                      {postcard.place.name}
                    </Text>
                  </View>
                  <View style={styles.postcardMeta}>
                    <Text style={styles.postcardDate}>{postcard.publishedAt}</Text>
                    <View style={styles.likeCount}>
                      <Ionicons name="heart" size={14} color="#ef4444" />
                      <Text style={styles.likeCountText}>{postcard.likeCount}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.commentList}>
            {PROFILE_COMMENTS.map((comment) => (
              <ProfileCommentCard key={comment.id} comment={comment} />
            ))}
          </View>
        )}
      </View>

      <View style={styles.discoveryCard}>
        <View style={styles.discoveryIcon}>
          <Ionicons name="compass" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.discoveryContent}>
          <View style={styles.discoveryTitleRow}>
            <Text selectable style={styles.discoveryTitle}>
              Ağustos keşif özeti
            </Text>
            <Text style={styles.discoveryPercent}>%68</Text>
          </View>
          <Text selectable style={styles.discoveryText}>
            Bu ay 6 yeni mekân keşfettin. Hedefine ulaşmak için 3 keşif daha yap.
          </Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressValue} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  content: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    gap: theme.spacing(5),
    paddingHorizontal: theme.spacing(4),
  },
  pageHeader: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.colors.primary,
  },
  pageTitle: { paddingTop: 2, fontSize: 28, fontWeight: '900', color: theme.colors.text },
  cityBadge: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
    paddingHorizontal: theme.spacing(3),
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#bfdbfe',
    backgroundColor: '#eff6ff',
  },
  cityBadgeText: { fontSize: 12, fontWeight: '700', color: theme.colors.primary },
  profileHeader: {
    alignItems: 'center',
    gap: theme.spacing(3),
    paddingHorizontal: theme.spacing(2),
  },
  avatarFrame: {
    width: 96,
    height: 96,
    padding: 4,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  avatar: { width: '100%', height: '100%', borderRadius: 999, backgroundColor: '#dbeafe' },
  identityText: { alignItems: 'center', gap: 3 },
  displayName: { fontSize: 22, fontWeight: '900', color: theme.colors.text },
  username: { fontSize: 13, fontWeight: '600', color: theme.colors.muted },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    paddingTop: 3,
  },
  memberText: { flexShrink: 1, fontSize: 11, color: theme.colors.muted },
  bio: {
    maxWidth: 460,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.text,
  },
  statsRow: { width: '100%', flexDirection: 'row', paddingTop: theme.spacing(2) },
  statItem: { flex: 1, minHeight: 62, alignItems: 'center', justifyContent: 'center', gap: 2 },
  statItemBorder: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: theme.colors.border,
  },
  statValue: {
    fontSize: 19,
    fontWeight: '900',
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  statLabel: { fontSize: 11, fontWeight: '600', color: theme.colors.muted },
  createPostcardButton: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(3),
    paddingHorizontal: theme.spacing(4),
    paddingVertical: theme.spacing(3),
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
  },
  createPostcardIcon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  createPostcardText: { flex: 1, minWidth: 0, gap: 3 },
  createPostcardTitle: { fontSize: 16, fontWeight: '900', color: '#ffffff' },
  createPostcardSubtitle: { fontSize: 12, lineHeight: 17, color: '#dbeafe' },
  buttonPressed: { opacity: 0.78 },
  profileContent: { gap: theme.spacing(4) },
  profileTabs: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  profileTab: {
    minHeight: 48,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    borderRadius: 10,
  },
  profileTabPressed: { backgroundColor: '#f8fafc' },
  profileTabLabel: { fontSize: 13, fontWeight: '700', color: theme.colors.muted },
  profileTabLabelActive: { color: theme.colors.text },
  profileTabIndicator: {
    position: 'absolute',
    right: theme.spacing(3),
    bottom: -1,
    left: theme.spacing(3),
    height: 2,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  commentList: { gap: theme.spacing(3) },
  discoveryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing(3),
    padding: theme.spacing(4),
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: '#ffffff',
  },
  discoveryIcon: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#eff6ff',
  },
  discoveryContent: { flex: 1, minWidth: 0, gap: theme.spacing(2) },
  discoveryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
  },
  discoveryTitle: { flex: 1, fontSize: 15, fontWeight: '800', color: theme.colors.text },
  discoveryPercent: { fontSize: 12, fontWeight: '800', color: theme.colors.primary },
  discoveryText: { fontSize: 12, lineHeight: 18, color: theme.colors.muted },
  progressTrack: { height: 7, overflow: 'hidden', borderRadius: 999, backgroundColor: '#dbeafe' },
  progressValue: {
    width: '68%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  postcardRow: { gap: theme.spacing(3), paddingRight: theme.spacing(4) },
  postcardCard: {
    width: 244,
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: '#ffffff',
  },
  postcardImage: { width: '100%', height: 132, backgroundColor: '#dbeafe' },
  postcardBody: { gap: theme.spacing(2), padding: theme.spacing(3) },
  postcardTitle: { fontSize: 14, fontWeight: '800', color: theme.colors.text },
  postcardPlaceRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1) },
  postcardPlace: { flex: 1, minWidth: 0, fontSize: 11, color: theme.colors.muted },
  postcardMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  postcardDate: { fontSize: 10, color: theme.colors.muted },
  likeCount: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1) },
  likeCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
});
