import { patchState, signalStore, withMethods, withState, withComputed } from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { Comment } from '@shared/core/supabase';
import { ReaderApiService } from '../../../core';

interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

export const CommentsStore = signalStore(
  withState(initialState),

  withComputed(({ comments }) => ({
    total: computed(() => comments().length),
    hasComments: computed(() => comments().length > 0),
  })),

  withMethods((state, commentsService = inject(ReaderApiService)) => ({
    async getComments(postId: string): Promise<void> {
      patchState(state, { loading: true, error: null });
      try {
        const comments = await commentsService.getComments(postId);
        if (comments) {
          patchState(state, { comments, loading: false });
        } else {
          patchState(state, { error: 'No comments found', loading: false });
        }
      } catch (error) {
        patchState(state, {
          error: `Failed to fetch comments: ${typeof error === 'string' ? error : 'Unknown error'}`,
          loading: false,
        });
      }
    },

    async addComment(postId: string, comment: Comment): Promise<void> {
      patchState(state, { loading: true, error: null });
      try {
        await commentsService.addComment(postId, comment);
        const comments = await commentsService.getComments(postId);
        if (comments) {
          patchState(state, { comments, loading: false });
        }
      } catch (error) {
        patchState(state, {
          error: `Failed to add comment: ${typeof error === 'string' ? error : 'Unknown error'}`,
          loading: false
        });
      }
    },

    async deleteComment(commentId: string, postId: string): Promise<void> {
      patchState(state, { loading: true, error: null });
      try {
        await commentsService.deleteComment(commentId, postId);
        const comments = await commentsService.getComments(postId);
        if (comments) {
          patchState(state, { comments, loading: false });
        }
      } catch (error) {
        patchState(state, {
          error: `Failed to delete comment: ${typeof error === 'string' ? error : 'Unknown error'}`,
          loading: false,
        });
      }
    },
  }))
);
