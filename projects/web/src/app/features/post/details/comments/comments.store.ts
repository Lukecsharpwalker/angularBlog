import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { ReaderApiService } from '../../../../core/services/reader-api.service';
import { Comment } from 'shared';

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

  withMethods((state, commentsService = inject(ReaderApiService)) => ({
    async getComments(postId: string) {
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
          error: 'Failed to fetch comments' + error,
          loading: false,
        });
      }
    },

    async addComment(postId: string, comment: Comment) {
      patchState(state, { loading: true, error: null });
      try {
        await commentsService.addComment(postId, comment);
        const comments = await commentsService.getComments(postId);
        if (comments) {
          patchState(state, { comments, loading: false });
        }
      } catch (error) {
        patchState(state, { error: 'Failed to add comment' + error, loading: false });
      }
    },

    async deleteComment(commentId: string, postId: string) {
      patchState(state, { loading: true, error: null });
      try {
        await commentsService.deleteComment(commentId, postId);
        const comments = await commentsService.getComments(postId);
        if (comments) {
          patchState(state, { comments, loading: false });
        }
      } catch (error) {
        patchState(state, {
          error: 'Failed to delete comment' + error,
          loading: false,
        });
      }
    },
  }))
);
