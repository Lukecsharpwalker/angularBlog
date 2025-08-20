import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withState, withMethods, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { Tag } from '../../models';
import { TAGS_API_SERVICE, TagsApiService } from '../tokens/api-tokens';

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

  withMethods((store, api = inject(TAGS_API_SERVICE)) => ({
    loadTags: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          api.getTags().pipe(
            tapResponse({
              next: tags => patchState(store, { tags: tags || [], loading: false }),
              error: err =>
                patchState(store, {
                  error: 'Failed to fetch tags',
                  loading: false,
                }),
            })
          )
        )
      )
    ),
  })),

  withHooks(({ loadTags }) => ({
    onInit() {
      loadTags();
    },
  }))
);
