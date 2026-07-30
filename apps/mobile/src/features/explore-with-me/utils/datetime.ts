/** Planlanan kalkış zamanını kısa yerel biçime çevirir (ör. "31 Tem · 13:00"). */
export function formatDepart(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  return `${date} · ${time}`;
}
