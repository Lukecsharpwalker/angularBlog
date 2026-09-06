import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Post } from '@shared/core/supabase';
import { ReaderApiService } from '../../core';

interface PostState {
  post: Post | null;
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  post: null,
  loading: false,
  error: null,
};

export const PostStore = signalStore(
  withState(initialState),

  withComputed(({ post }) => ({
    tableOfContents: computed(() => post()!.table_of_contents_sorted),
  })),

  withMethods((store, postService = inject(ReaderApiService)) => ({
    getPost: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(id =>
          postService.getPost(id).pipe(
            tapResponse({
              next: (post: Post | null) => patchState(store, { post, loading: false }),
              error: (err: unknown) =>
                patchState(store, {
                  error: `Failed to fetch post: ${(err as Error)?.message ?? 'Unknown error'}`,
                  loading: false,
                }),
            })
          )
        )
      )
    ),
  }))
);
