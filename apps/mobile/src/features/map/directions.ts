import type { GeoPoint } from '@urbanly/shared';
import { Linking, Platform } from 'react-native';

/**
 * Cihazın harita uygulamasında hedefe yol tarifi açar.
 * iOS → Apple Maps, Android → Google Maps; başarısızsa web Google Maps'e düşer.
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
    // Yerel uygulama açılamadı — web'e düş.
  }
  await Linking.openURL(webUrl);
}
