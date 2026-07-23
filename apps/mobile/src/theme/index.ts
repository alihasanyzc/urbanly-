/** Basit tema tokenları — ileride genişletilir (bkz. CLAUDE.md §3.1). */
export const theme = {
  colors: {
    bg: '#ffffff',
    text: '#111827',
    muted: '#6b7280',
    primary: '#2563eb',
    border: '#e5e7eb',
    danger: '#dc2626',
  },
  spacing: (n: number) => n * 4,
  radius: 12,
} as const;
