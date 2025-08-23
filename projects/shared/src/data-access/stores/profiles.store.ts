import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';

import { Profile } from '../../models';
import { ProfilesService } from '../api';

interface ProfilesState {
  profiles: Profile[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfilesState = {
  profiles: [],
  loading: false,
  error: null,
};

export const ProfilesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((state, profilesService = inject(ProfilesService)) => ({
    async getProfiles() {
      patchState(state, { loading: true, error: null });
      try {
        const profiles = await profilesService.getProfiles();
        if (profiles) {
          patchState(state, { profiles, loading: false });
        } else {
          patchState(state, { profiles: [], error: 'No profiles found', loading: false });
        }
      } catch {
        patchState(state, {
          error: 'Failed to fetch profiles,',
          loading: false,
        });
      }
    },
  })),

  withHooks({
    onInit(store) {
      store.getProfiles();
    },
  })
);
