import { inject } from '@angular/core';
import { computed } from '@angular/core';
import { patchState, signalStore, withMethods, withState, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Post } from '@shared/core/supabase';
import { ReaderApiService } from '../../core';

interface PostState {
  post: Post | null;
  date: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  post: null,
  loading: false,
  error: null,
  date: null,
};

export const PostStore = signalStore(
  withState(initialState),
  withComputed(store => ({
    hasPost: computed(() => store.post() !== null),
    postTitle: computed(() => store.post()?.title ?? ''),
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
                  error: `Failed to fetch post: ${typeof err === 'string' ? err : 'Unknown error'}`,
                  loading: false,
                }),
            })
          )
        )
      )
    ),
  }))
);

