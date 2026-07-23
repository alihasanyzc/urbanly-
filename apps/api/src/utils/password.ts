import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/** Şifre hash'lenir; düz metin asla saklanmaz (bkz. CLAUDE.md §5.3). */
export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
