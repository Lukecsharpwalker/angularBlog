import { computed, inject } from '@angular/core';
import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
  patchState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { distinctUntilChanged, of, pipe, switchMap, tap } from 'rxjs';
import { Roles, UserService } from '@shared/core/auth';
import { ProfileService } from '@shared/core/profile/profile.service';
import { Profile } from '@shared/core/supabase/profiles';
import { UserWithRole } from '@shared/core/auth/user.model';

interface ProfileState {
  userProfile: Profile | null;
  loading: boolean;
  error: string | null;
  role: Roles | null;
}

const initialState: ProfileState = { userProfile: null, loading: false, error: null, role: null };

export const ProfileStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    _profileService: inject(ProfileService),
    _userService: inject(UserService),
  })),
  withComputed(({ userProfile, loading, error }) => ({
    //TODO: Refactor XD
    userName: computed(() => userProfile()?.username),
    userId: computed(() => userProfile()?.id),
    isLoaded: computed(() => userProfile() !== null),
    status: computed(() => {
      if (loading()) return 'loading' as const;
      if (error()) return 'error' as const;
      if (userProfile()) return 'loaded' as const;
      return 'idle' as const;
    }),
  })),
  withMethods((store, profileService = inject(ProfileService)) => ({
    loadProfile: rxMethod<UserWithRole | null>(
      pipe(
        distinctUntilChanged(),
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(user => {
          if (!user) {
            patchState(store, { userProfile: null, loading: false, role: null });
            return of(null);
          }
          return profileService.getProfile(user.id).pipe(
            tapResponse({
              next: profile =>
                patchState(store, {
                  userProfile: profile,
                  loading: false,
                  role: user.app_metadata.role,
                }),
              error: (err: unknown) =>
                patchState(store, {
                  userProfile: null,
                  loading: false,
                  role: null,
                  error: `Failed to fetch profile: ${err instanceof Error ? err.message : String(err)}`,
                }),
            })
          );
        })
      )
    ),
  })),
  withHooks({
    onInit(store, userService = inject(UserService)) {
      store.loadProfile(userService.appUser$);
    },
  })
);
