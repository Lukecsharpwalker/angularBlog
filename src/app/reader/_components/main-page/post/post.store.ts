import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { Post } from '../../../../types/supabase';
import { ReaderApiService } from '../../../_services/reader-api.service';

type PostState = {
  post: Post | null;
  loading: boolean;
  error: string | null;
};

const initialState: PostState = {
  post: null,
  loading: false,
  error: null,
};

export const PostStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store, postService = inject(ReaderApiService)) => ({
    getPost: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((id) =>
          postService.getPost(id).pipe(
            tapResponse({
              next: (post: Post) => patchState(store, { post, loading: false }),
              error: (err: string) =>
                patchState(store, {
                  error: err ?? 'Failed to fetch post',
                  loading: false,
                }),
            }),
          ),
        ),
      ),
    ),
  })),
);
