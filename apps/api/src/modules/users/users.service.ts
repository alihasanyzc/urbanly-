import type { PublicUser } from '@urbanly/shared';
import { HttpError } from '../../utils/http-error.js';
import { toPublicUser } from './users.mapper.js';
import { usersRepository } from './users.repository.js';

export const usersService = {
  async getPublicById(id: string): Promise<PublicUser> {
    const user = await usersRepository.findById(id);
    if (!user) throw HttpError.notFound('Kullanıcı bulunamadı');
    return toPublicUser(user);
  },
};
