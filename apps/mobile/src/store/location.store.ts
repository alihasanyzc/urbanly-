import type { GeoPoint } from '@urbanly/shared';
import * as Location from 'expo-location';
import { create } from 'zustand';

type LocationStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'error';

interface LocationState {
  coords: GeoPoint | null;
  status: LocationStatus;
  /** İzin ister ve cihaz konumunu bir kez alır. Tekrar çağrılırsa yeniden dener. */
  requestLocation: () => Promise<void>;
}

/** Cihaz konumu — mesafe hesabı ve harita merkezlemesi için paylaşılan durum. */
export const useLocationStore = create<LocationState>((set, get) => ({
  coords: null,
  status: 'idle',
  async requestLocation() {
    if (get().status === 'loading') return;
    set({ status: 'loading' });
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        set({ status: 'denied' });
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      set({
        coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        status: 'granted',
      });
    } catch {
      set({ status: 'error' });
    }
  },
}));
