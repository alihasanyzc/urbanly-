/**
 * Akışta paylaşım tarihini kısa göreli metne çevirir ("az önce", "5 dk", "2 sa", "3 g").
 * Bir haftadan eskiler gün/ay olarak yerel biçimde gösterilir.
 */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const diffSec = Math.max(0, Math.floor((now.getTime() - then) / 1000));

  if (diffSec < 60) return 'az önce';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} dk`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} sa`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} g`;

  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}
