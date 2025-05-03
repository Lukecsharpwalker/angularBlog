import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withState,
  withMethods,
  withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { Tag } from '../../types/supabase';
import { ReaderApiService } from '../../reader/_services/reader-api.service';

type TagsState = {
  tags: Tag[] | null;
  loading: boolean;
  error: string | null;
};

const initialState: TagsState = {
  tags: [],
  loading: false,
  error: null,
};

export const TagsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store, api = inject(ReaderApiService)) => ({
    loadTags: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          api.getTags().pipe(
            tapResponse({
              next: (tags) => patchState(store, { tags, loading: false }),
              error: (err) =>
                patchState(store, {
                  error: 'Failed to fetch tags',
                  loading: false,
                }),
            }),
          ),
        ),
      ),
    ),
  })),

  withHooks(({ loadTags }) => ({
    onInit() {
      loadTags();
    },
  })),
);
