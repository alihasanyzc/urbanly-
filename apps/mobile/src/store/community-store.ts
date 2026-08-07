import { create } from 'zustand';
import {
  CURRENT_USER,
  MOCK_COMMENTS_BY_POST_ID,
  type CommunityComment,
} from '../features/community/mock-community';

interface CommunityState {
  commentsByPostId: Readonly<Record<string, ReadonlyArray<CommunityComment>>>;
  addedCommentCountsByPostId: Readonly<Record<string, number>>;
  addComment: (postId: string, body: string) => void;
}

let nextLocalCommentId = 1;

/** Modal yorumları ile kartlardaki yorum sayılarını aynı kaynakta tutar. */
export const useCommunityStore = create<CommunityState>((set) => ({
  commentsByPostId: MOCK_COMMENTS_BY_POST_ID,
  addedCommentCountsByPostId: {},
  addComment: (postId, body) => {
    const normalizedBody = body.trim();
    if (!normalizedBody) return;

    set((state) => {
      const comment: CommunityComment = {
        id: `local-comment-${nextLocalCommentId++}`,
        postId,
        author: CURRENT_USER,
        body: normalizedBody,
        createdAt: new Date().toISOString(),
      };

      return {
        commentsByPostId: {
          ...state.commentsByPostId,
          [postId]: [comment, ...(state.commentsByPostId[postId] ?? [])],
        },
        addedCommentCountsByPostId: {
          ...state.addedCommentCountsByPostId,
          [postId]: (state.addedCommentCountsByPostId[postId] ?? 0) + 1,
        },
      };
    });
  },
}));
