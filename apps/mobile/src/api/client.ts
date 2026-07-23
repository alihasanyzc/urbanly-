import type { AuthTokens } from '@urbanly/shared';
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '../config';
import { tokenStorage } from '../lib/tokenStorage';

/** Tek axios instance — token ekleme ve otomatik yenileme burada (bkz. CLAUDE.md §3.1). */
export const api = axios.create({ baseURL: API_URL, timeout: 15000 });

// İstekten önce access token'ı ekle.
api.interceptors.request.use(async (config) => {
  const { accessToken } = await tokenStorage.get();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// 401'de bir kez refresh dene; başarısızsa token'ları temizle.
let refreshing: Promise<AuthTokens | null> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retried?: boolean };

    if (error.response?.status !== 401 || original._retried) {
      return Promise.reject(error);
    }
    original._retried = true;

    refreshing ??= refreshTokens();
    const tokens = await refreshing;
    refreshing = null;

    if (!tokens) return Promise.reject(error);
    original.headers.Authorization = `Bearer ${tokens.accessToken}`;
    return api(original);
  },
);

// Interceptor döngüsüne girmemek için ayrı bir axios çağrısı kullanılır.
async function refreshTokens(): Promise<AuthTokens | null> {
  const { refreshToken } = await tokenStorage.get();
  if (!refreshToken) return null;

  try {
    const res = await axios.post<{ data: AuthTokens }>(`${API_URL}/auth/refresh`, { refreshToken });
    await tokenStorage.set(res.data.data);
    return res.data.data;
  } catch {
    await tokenStorage.clear();
    return null;
  }
}
