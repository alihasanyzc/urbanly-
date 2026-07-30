/**
 * Tema tokenları — 60-30-10 renk kuralına göre düzenlendi:
 * - %60 baskın nötr: `bg` (beyaz) + açık gri yüzeyler (#f3f4f6 / #f9fafb).
 * - %30 ikincil nötr: `text` / `muted` / `border` (yapısal griler).
 * - %10 vurgu: `primary` (marka moru) — yalnızca CTA, aktif durum ve rozetlerde.
 *
 * `primaryTint`, primary'nin çok açık zemin tonu (rozet/çip arka planı).
 */
export const theme = {
  colors: {
    bg: '#ffffff',
    text: '#111827',
    muted: '#6b7280',
    primary: '#8B5DFF', // marka ana rengi (vurgu — %10)
    primaryTint: '#F1ECFF', // primary'nin açık zemin tonu
    border: '#e5e7eb',
    danger: '#dc2626',
  },
  spacing: (n: number) => n * 4,
  radius: 12,
} as const;
