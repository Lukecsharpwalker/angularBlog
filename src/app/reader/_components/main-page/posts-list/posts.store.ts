import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withState,
  withMethods,
  withHooks,
  withComputed,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { Post } from '../../../../types/supabase';
import { ReaderApiService } from '../../../_services/reader-api.service';

type PostsState = {
  posts: Post[] | null;
  loading: boolean;
  error: string | null;
};

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
};

export const PostsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, api = inject(ReaderApiService)) => ({
    loadPosts: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          api.getPosts().pipe(
            tapResponse({
              next: (posts) => patchState(store, { posts, loading: false }),
              error: (err) =>
                patchState(store, {
                  error: 'Failed to fetch posts',
                  loading: false,
                }),
            }),
          ),
        ),
      ),
    ),
  })),

  withHooks(({ loadPosts }) => ({
    onInit() {
      loadPosts();
    },
  })),

  withComputed(({ posts }) => ({
    total: computed(() => posts()!.length),
  })),
);
