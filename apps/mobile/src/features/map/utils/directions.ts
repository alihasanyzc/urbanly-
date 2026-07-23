import type { GeoPoint } from '@urbanly/shared';
import { Linking, Platform } from 'react-native';

/**
 * Cihazın harita uygulamasında hedefe yol tarifi açar.
 *
 * Önce platforma özel derin bağlantıyı dener (iOS → Apple Maps, Android → Google Maps).
 * Uygulama kurulu değilse veya açılamazsa web Google Maps'e düşer; böylece her cihazda çalışır.
 */
export async function openDirections(dest: GeoPoint, label?: string): Promise<void> {
  const latLng = `${dest.lat},${dest.lng}`;
  const encodedLabel = label ? encodeURIComponent(label) : '';

  const nativeUrl = Platform.select({
    ios: `maps://?daddr=${latLng}${encodedLabel ? `&q=${encodedLabel}` : ''}`,
    android: `google.navigation:q=${latLng}`,
    default: '',
  });

  const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latLng}`;

  try {
    if (nativeUrl && (await Linking.canOpenURL(nativeUrl))) {
      await Linking.openURL(nativeUrl);
      return;
    }
  } catch {
    // Yerel harita uygulaması açılamadı — sessizce web'e düşüyoruz.
  }
  await Linking.openURL(webUrl);
}
