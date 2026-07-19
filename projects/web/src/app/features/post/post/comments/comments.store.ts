import { patchState, signalStore, withMethods, withState, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject, computed } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Comment } from '@shared/core/supabase';
import { ReaderApiService } from '../../../../core';

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
    loadComments: rxMethod<string>(
      pipe(
        tap(() => patchState(state, { loading: true, error: null })),
        switchMap(postId =>
          commentsService.getComments(postId).pipe(
            tapResponse({
              next: comments => patchState(state, { comments, loading: false }),
              error: (error: unknown) =>
                patchState(state, {
                  error: `Failed to fetch comments: ${error instanceof Error ? error.message : 'Unknown error'}`,
                  loading: false,
                }),
            })
          )
        )
      )
    ),

    addComment: rxMethod<{ postId: string; comment: Comment }>(
      pipe(
        tap(() => patchState(state, { loading: true, error: null })),
        switchMap(({ postId, comment }) =>
          commentsService.addComment(postId, comment).pipe(
            switchMap(() => commentsService.getComments(postId)),
            tapResponse({
              next: comments => patchState(state, { comments, loading: false }),
              error: (error: unknown) =>
                patchState(state, {
                  error: `Failed to add comment: ${error instanceof Error ? error.message : 'Unknown error'}`,
                  loading: false,
                }),
            })
          )
        )
      )
    ),

    deleteComment: rxMethod<{ commentId: string; postId: string }>(
      pipe(
        tap(() => patchState(state, { loading: true, error: null })),
        switchMap(({ commentId, postId }) =>
          commentsService.deleteComment(commentId, postId).pipe(
            switchMap(() => commentsService.getComments(postId)),
            tapResponse({
              next: comments => patchState(state, { comments, loading: false }),
              error: (error: unknown) =>
                patchState(state, {
                  error: `Failed to delete comment: ${error instanceof Error ? error.message : 'Unknown error'}`,
                  loading: false,
                }),
            })
          )
        )
      )
    ),
  }))
);
