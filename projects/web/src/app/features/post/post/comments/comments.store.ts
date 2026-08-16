import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { addEntity, removeEntity, setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { firstValueFrom, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Comment, CommentInsert } from '@shared/core/supabase';
import { ReaderApiService } from '../../../../core';

interface CommentsState {
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  loading: false,
  submitting: false,
  error: null,
};

export const CommentsStore = signalStore(
  withState(initialState),
  withEntities<Comment>(),

  withComputed(({ entities }) => ({
    total: computed(() => entities().length),
  })),

  withMethods((state, commentsService = inject(ReaderApiService)) => ({
    loadComments: rxMethod<string>(
      pipe(
        tap(() => patchState(state, { loading: true, error: null })),
        switchMap(postId =>
          commentsService.getComments(postId).pipe(
            tapResponse({
              next: comments => patchState(state, setAllEntities(comments), { loading: false }),
              error: (error: unknown) =>
                patchState(state, {
                  error: `Failed to fetch comments: ${(error as Error)?.message ?? 'Unknown error'}`,
                  loading: false,
                }),
            })
          )
        )
      )
    ),

    async addComment(comment: CommentInsert): Promise<boolean> {
      patchState(state, { submitting: true, error: null });

      try {
        const addedComment = await firstValueFrom(commentsService.addComment(comment));
        patchState(state, addEntity(addedComment), { submitting: false });
        return true;
      } catch (error: unknown) {
        patchState(state, {
          error: `Failed to add comment: ${(error as Error)?.message ?? 'Unknown error'}`,
          submitting: false,
        });
        return false;
      }
    },

    deleteComment: rxMethod<{ commentId: string; postId: string }>(
      pipe(
        tap(() => patchState(state, { loading: true, error: null })),
        switchMap(({ commentId, postId }) =>
          commentsService.deleteComment(commentId, postId).pipe(
            tapResponse({
              next: () => patchState(state, removeEntity(commentId), { loading: false }),
              error: (error: unknown) =>
                patchState(state, {
                  error: `Failed to delete comment: ${(error as Error)?.message ?? 'Unknown error'}`,
                  loading: false,
                }),
            })
          )
        )
      )
    ),
  }))
);
