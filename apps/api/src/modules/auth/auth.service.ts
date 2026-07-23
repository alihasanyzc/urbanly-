import { createHash } from 'node:crypto';
import type { AuthTokens, LoginInput, PublicUser, RegisterInput } from '@urbanly/shared';
import { HttpError } from '../../utils/http-error.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import { toPublicUser } from '../users/users.mapper.js';
import { usersRepository } from '../users/users.repository.js';
import { authRepository } from './auth.repository.js';

// Refresh token yüksek entropili; DB'de sha256 hash'i saklanır (düz metin değil).
const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

// JWT exp claim'inden refresh token'ın DB kaydı için son geçerlilik tarihini alır.
function refreshExpiry(token: string): Date {
  const { exp } = verifyRefreshToken(token) as unknown as { exp: number };
  return new Date(exp * 1000);
}

async function issueTokens(userId: string): Promise<AuthTokens> {
  const accessToken = signAccessToken({ sub: userId });
  const refreshToken = signRefreshToken({ sub: userId });
  await authRepository.storeRefreshToken({
    tokenHash: hashToken(refreshToken),
    userId,
    expiresAt: refreshExpiry(refreshToken),
  });
  return { accessToken, refreshToken };
}

export const authService = {
  async register(input: RegisterInput): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    const existing = await usersRepository.findByEmail(input.email);
    if (existing) throw HttpError.conflict('Bu e-posta zaten kayıtlı');

    const user = await usersRepository.create({
      email: input.email,
      passwordHash: await hashPassword(input.password),
      displayName: input.displayName,
    });

    const tokens = await issueTokens(user.id);
    return { user: toPublicUser(user), tokens };
  },

  async login(input: LoginInput): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    const user = await usersRepository.findByEmail(input.email);
    // Kullanıcı yoksa da aynı hatayı döneriz (e-posta enumerasyonunu önlemek için).
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw HttpError.unauthorized('E-posta veya şifre hatalı');
    }

    const tokens = await issueTokens(user.id);
    return { user: toPublicUser(user), tokens };
  },

  // Rotasyon: eski refresh token iptal edilir, yenisi verilir.
  async refresh(refreshToken: string): Promise<AuthTokens> {
    let userId: string;
    try {
      userId = verifyRefreshToken(refreshToken).sub;
    } catch {
      throw HttpError.unauthorized('Geçersiz refresh token');
    }

    const stored = await authRepository.findActiveByHash(hashToken(refreshToken));
    if (!stored) throw HttpError.unauthorized('Refresh token geçersiz veya süresi dolmuş');

    await authRepository.revoke(stored.id);
    return issueTokens(userId);
  },

  async logout(refreshToken: string): Promise<void> {
    const stored = await authRepository.findActiveByHash(hashToken(refreshToken));
    if (stored) await authRepository.revoke(stored.id);
  },
};
