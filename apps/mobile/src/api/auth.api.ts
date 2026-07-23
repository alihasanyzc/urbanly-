import type { AuthTokens, LoginInput, PublicUser, RegisterInput } from '@urbanly/shared';
import { api } from './client';

interface AuthResult {
  user: PublicUser;
  tokens: AuthTokens;
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const res = await api.post<{ data: AuthResult }>('/auth/register', input);
  return res.data.data;
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const res = await api.post<{ data: AuthResult }>('/auth/login', input);
  return res.data.data;
}

export async function logout(refreshToken: string): Promise<void> {
  await api.post('/auth/logout', { refreshToken });
}
