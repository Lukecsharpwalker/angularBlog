import { inject, computed } from '@angular/core';
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
import { Tag } from '@shared/core/supabase';
import { ReaderApiService } from '../../core';

interface TagsState {
  tags: Tag[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: TagsState = {
  tags: [],
  loading: false,
  error: null,
};

export const TagsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ tags }) => ({
    total: computed(() => tags()?.length ?? 0),
    hasTags: computed(() => (tags()?.length ?? 0) > 0),
  })),

  withMethods((store, api = inject(ReaderApiService)) => ({
    loadTags: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          api.getTags().pipe(
            tapResponse({
              next: tags => patchState(store, { tags: tags || [], loading: false }),
              error: (err: unknown) =>
                patchState(store, {
                  error:
                    'Failed to fetch tags: ' + (typeof err === 'string' ? err : 'Unknown error'),
                  loading: false,
                }),
            })
          )
        )
      )
    ),
  })),

  withHooks(({ loadTags }) => ({
    onInit(): void {
      loadTags();
    },
  }))
);
