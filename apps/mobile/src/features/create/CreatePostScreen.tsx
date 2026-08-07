import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;

/**
 * Profildeki Kartpostal oluştur aksiyonuyla açılan içerik modalı.
 * Şimdilik seçenekleri gösteren placeholder; ilgili ekranlar sonraki fazda bağlanacak.
 */
export function CreatePostScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + theme.spacing(2),
          paddingBottom: insets.bottom + theme.spacing(4),
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Kartpostal oluştur</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kapat"
          hitSlop={12}
          onPress={() => navigation.goBack()}
          style={styles.close}
        >
          <Ionicons name="close" size={22} color={theme.colors.text} />
        </Pressable>
      </View>

      <View style={styles.options}>
        <Option icon="star-outline" label="Mekân deneyimi paylaş" />
        <Option icon="camera-outline" label="Fotoğraflı kartpostal" />
        <Option icon="list-outline" label="Gezi listesi oluştur" />
        <Option icon="location-outline" label="Yeni mekân öner" />
      </View>

      <Text selectable style={styles.note}>
        Kartpostal düzenleme adımları sonraki fazda etkinleşecek.
      </Text>
    </View>
  );
}

function Option({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
    >
      <View style={styles.optionIcon}>
        <Ionicons name={icon} size={22} color={theme.colors.primary} />
      </View>
      <Text style={styles.optionLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg, paddingHorizontal: theme.spacing(4) },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(4),
  },
  title: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
  close: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  options: { gap: theme.spacing(2) },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(3),
    minHeight: 56,
    paddingHorizontal: theme.spacing(3),
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  optionPressed: { backgroundColor: '#f9fafb' },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
  },
  optionLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: theme.colors.text },
  note: {
    marginTop: theme.spacing(4),
    fontSize: 13,
    color: theme.colors.muted,
    textAlign: 'center',
  },
});
