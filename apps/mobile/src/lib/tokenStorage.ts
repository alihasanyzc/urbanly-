import * as SecureStore from 'expo-secure-store';

// Token'lar güvenli depoda tutulur (AsyncStorage değil) — hassas veri.
const ACCESS_KEY = 'urbanly.accessToken';
const REFRESH_KEY = 'urbanly.refreshToken';

export const tokenStorage = {
  async get() {
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_KEY),
      SecureStore.getItemAsync(REFRESH_KEY),
    ]);
    return { accessToken, refreshToken };
  },

  async set(tokens: { accessToken: string; refreshToken: string }) {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_KEY, tokens.accessToken),
      SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken),
    ]);
  },

  async clear() {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_KEY),
      SecureStore.deleteItemAsync(REFRESH_KEY),
    ]);
  },
};
