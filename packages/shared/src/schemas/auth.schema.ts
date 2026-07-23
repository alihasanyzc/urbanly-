import { z } from 'zod';

/** Kayıt (register) girdisi — frontend ve backend aynı şemayı kullanır. */
export const registerSchema = z.object({
  email: z.string().email('Geçerli bir e-posta girin'),
  password: z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalı')
    .max(72, 'Şifre en fazla 72 karakter olabilir'),
  displayName: z.string().min(2, 'İsim en az 2 karakter olmalı').max(50),
});

/** Giriş (login) girdisi. */
export const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta girin'),
  password: z.string().min(1, 'Şifre gerekli'),
});

/** Refresh token yenileme girdisi. */
export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;

/** Auth uçlarının döndürdüğü token çifti. */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
