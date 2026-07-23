import type { AuthTokens, PublicUser } from '@urbanly/shared';
import { create } from 'zustand';
import * as authApi from '../api/auth.api';
import { tokenStorage } from '../lib/tokenStorage';

interface AuthState {
  user: PublicUser | null;
  status: 'loading' | 'authenticated' | 'anonymous';
  bootstrap: () => Promise<void>;
  setSession: (user: PublicUser, tokens: AuthTokens) => Promise<void>;
  signOut: () => Promise<void>;
}

/** İstemci tarafı oturum durumu (bkz. CLAUDE.md §3.1 — istemci durumu Zustand). */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'loading',

  // Uygulama açılışında saklı token varsa oturumu geri yükle.
  async bootstrap() {
    const { accessToken } = await tokenStorage.get();
    set({ status: accessToken ? 'authenticated' : 'anonymous' });
  },

  async setSession(user, tokens) {
    await tokenStorage.set(tokens);
    set({ user, status: 'authenticated' });
  },

  async signOut() {
    const { refreshToken } = await tokenStorage.get();
    if (refreshToken) await authApi.logout(refreshToken).catch(() => undefined);
    await tokenStorage.clear();
    set({ user: null, status: 'anonymous' });
  },
}));
