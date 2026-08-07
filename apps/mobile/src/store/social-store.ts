import { create } from 'zustand';
import { INITIAL_FOLLOWED_USER_IDS } from '../features/community/mock-community';

interface SocialState {
  followedUserIds: ReadonlySet<string>;
  toggleFollow: (userId: string) => void;
}

/** Arkadaş araması ve topluluk akışının aynı takip durumunu kullanmasını sağlar. */
export const useSocialStore = create<SocialState>((set) => ({
  followedUserIds: new Set(INITIAL_FOLLOWED_USER_IDS),
  toggleFollow: (userId) =>
    set((state) => {
      const followedUserIds = new Set(state.followedUserIds);
      if (followedUserIds.has(userId)) followedUserIds.delete(userId);
      else followedUserIds.add(userId);
      return { followedUserIds };
    }),
}));
