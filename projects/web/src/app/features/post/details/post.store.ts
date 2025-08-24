import { inject } from '@angular/core';
import { computed } from '@angular/core';
import { patchState, signalStore, withMethods, withState, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ReaderApiService } from '../../../core/services/reader-api.service';
import { formatDateToDDMMYYYY } from 'shared';
import { Post } from 'shared';

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
    formattedDate: computed(() => formatDateToDDMMYYYY(store.post()?.created_at)),
  })),
  withMethods((store, postService = inject(ReaderApiService)) => ({
    getPost: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(id =>
          postService.getPost(id).pipe(
            tapResponse({
              next: (post: Post) => patchState(store, { post, loading: false }),
              error: (err: unknown) =>
                patchState(store, {
                  error: typeof err === 'string' ? err : 'Failed to fetch post',
                  loading: false,
                }),
            })
          )
        )
      )
    ),
  }))
);
