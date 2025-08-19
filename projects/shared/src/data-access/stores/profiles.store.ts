import { inject, InjectionToken } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { Profile } from '../../models';

// Abstract interface for profiles API service
export interface ProfilesApiService {
  getProfiles(): Promise<Profile[] | null>;
}

// Injection token for the profiles API service
export const PROFILES_API_SERVICE = new InjectionToken<ProfilesApiService>('ProfilesApiService');

type ProfilesState = {
  profiles: Profile[];
  loading: boolean;
  error: string | null;
};

const initialState: ProfilesState = {
  profiles: [],
  loading: false,
  error: null,
};

export const ProfilesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((state, profilesService = inject(PROFILES_API_SERVICE)) => ({
    async getProfiles() {
      patchState(state, { loading: true, error: null });
      try {
        const profiles = await profilesService.getProfiles();
        if (profiles) {
          patchState(state, { profiles, loading: false });
        } else {
          patchState(state, { profiles: [], error: 'No profiles found', loading: false });
        }
      } catch (error) {
        patchState(state, {
          error: 'Failed to fetch profiles',
          loading: false,
        });
      }
    },
  })),

  withHooks({
    onInit(store) {
      store.getProfiles();
    },
  }),
);