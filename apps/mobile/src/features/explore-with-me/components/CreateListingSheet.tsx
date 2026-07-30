import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { TripCategory } from '../types';
import { theme } from '../../../theme';
import { AreaPickerModal } from './AreaPickerModal';
import { TripCategoryTabs } from './TripCategoryTabs';

export interface NewListingInput {
  category: TripCategory;
  from: string;
  to: string;
  departAt: string;
  note: string;
}

interface Props {
  visible: boolean;
  areas: string[];
  onClose: () => void;
  onSubmit: (input: NewListingInput) => void;
}

/** Hazır zaman seçenekleri — datetime picker (ek bağımlılık) yerine hızlı seçim. */
const WHEN_OPTIONS: { key: string; label: string; resolve: () => Date }[] = [
  { key: 'now', label: 'Şimdi', resolve: () => new Date() },
  {
    key: 'evening',
    label: 'Bugün akşam',
    resolve: () => {
      const d = new Date();
      d.setHours(19, 0, 0, 0);
      return d;
    },
  },
  {
    key: 'tomorrow',
    label: 'Yarın sabah',
    resolve: () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(9, 0, 0, 0);
      return d;
    },
  },
];

/** İlan oluşturma modalı — kategori, kalkış/varış, zaman ve not. */
export function CreateListingSheet({ visible, areas, onClose, onSubmit }: Props) {
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<TripCategory>('buddy');
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [whenKey, setWhenKey] = useState('now');
  const [note, setNote] = useState('');
  const [picking, setPicking] = useState<'from' | 'to' | null>(null);

  const canSubmit = from !== null && to !== null;

  const reset = () => {
    setCategory('buddy');
    setFrom(null);
    setTo(null);
    setWhenKey('now');
    setNote('');
  };

  const handleSubmit = () => {
    if (from === null || to === null) return;
    const when = WHEN_OPTIONS.find((o) => o.key === whenKey) ?? WHEN_OPTIONS[0];
    onSubmit({
      category,
      from,
      to,
      departAt: when.resolve().toISOString(),
      note: note.trim(),
    });
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTop} onPress={handleClose} accessibilityLabel="Kapat" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheet}
        >
          <View style={styles.grabber} />
          <View style={styles.headerRow}>
            <Text style={styles.title}>İlan ver</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kapat"
              hitSlop={12}
              onPress={handleClose}
              style={styles.close}
            >
              <Ionicons name="close" size={20} color={theme.colors.text} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.label}>Ne arıyorsun?</Text>
            <TripCategoryTabs value={category} onChange={setCategory} />

            <Text style={styles.label}>Rota</Text>
            <View style={styles.routeRow}>
              <RouteField label="Kalkış" value={from} onPress={() => setPicking('from')} />
              <Ionicons name="arrow-forward" size={18} color={theme.colors.muted} />
              <RouteField label="Varış" value={to} onPress={() => setPicking('to')} />
            </View>

            <Text style={styles.label}>Ne zaman?</Text>
            <View style={styles.whenRow}>
              {WHEN_OPTIONS.map((opt) => {
                const active = opt.key === whenKey;
                return (
                  <Pressable
                    key={opt.key}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => setWhenKey(opt.key)}
                    style={[styles.whenChip, active && styles.whenChipActive]}
                  >
                    <Text style={[styles.whenText, active && styles.whenTextActive]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Not (opsiyonel)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Planını, tercihini veya bütçeni yaz…"
              placeholderTextColor={theme.colors.muted}
              value={note}
              onChangeText={setNote}
              multiline
              maxLength={280}
              accessibilityLabel="İlan notu"
            />
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing(3)) }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="İlanı yayınla"
              accessibilityState={{ disabled: !canSubmit }}
              disabled={!canSubmit}
              onPress={handleSubmit}
              style={[styles.submit, !canSubmit && styles.submitDisabled]}
            >
              <Text style={styles.submitText}>İlanı Yayınla</Text>
            </Pressable>
          </View>

          <AreaPickerModal
            visible={picking === 'from'}
            title="Kalkış seç"
            selected={from}
            options={areas}
            onSelect={(v) => {
              setFrom(v);
              setPicking(null);
            }}
            onClose={() => setPicking(null)}
          />
          <AreaPickerModal
            visible={picking === 'to'}
            title="Varış seç"
            selected={to}
            options={areas}
            onSelect={(v) => {
              setTo(v);
              setPicking(null);
            }}
            onClose={() => setPicking(null)}
          />
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function RouteField({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string | null;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value ?? 'seçilmedi'}, seç`}
      onPress={onPress}
      style={({ pressed }) => [styles.field, pressed && styles.fieldPressed]}
    >
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={[styles.fieldValue, value === null && styles.fieldPlaceholder]} numberOfLines={1}>
        {value ?? 'Seç'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  backdropTop: { flex: 1 },
  sheet: {
    maxHeight: '88%',
    backgroundColor: theme.colors.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: theme.spacing(2),
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing(2),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing(4),
    paddingBottom: theme.spacing(3),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  title: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  close: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  body: { paddingVertical: theme.spacing(4), gap: theme.spacing(2) },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.muted,
    paddingHorizontal: theme.spacing(4),
    marginTop: theme.spacing(2),
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingHorizontal: theme.spacing(4),
  },
  field: {
    flex: 1,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing(3),
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  fieldPressed: { backgroundColor: '#f9fafb' },
  fieldLabel: { fontSize: 11, color: theme.colors.muted, fontWeight: '600' },
  fieldValue: { fontSize: 15, color: theme.colors.text, fontWeight: '700', marginTop: 2 },
  fieldPlaceholder: { color: theme.colors.muted, fontWeight: '600' },
  whenRow: { flexDirection: 'row', gap: theme.spacing(2), paddingHorizontal: theme.spacing(4) },
  whenChip: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
  },
  whenChipActive: { backgroundColor: theme.colors.primary },
  whenText: { fontSize: 13, fontWeight: '600', color: theme.colors.text },
  whenTextActive: { color: '#ffffff' },
  noteInput: {
    marginHorizontal: theme.spacing(4),
    minHeight: 88,
    padding: theme.spacing(3),
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontSize: 15,
    color: theme.colors.text,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: theme.spacing(4),
    paddingTop: theme.spacing(3),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  submit: {
    minHeight: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  submitDisabled: { backgroundColor: '#cbd5e1' },
  submitText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
