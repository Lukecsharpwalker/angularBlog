import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  Provider,
  Session,
  User,
} from '@supabase/supabase-js';
import { SupabaseClient } from '@shared/core/supabase';
import { Profile } from '../supabase';
import { Roles } from './roles';
import { ProfileService } from '../profiles/profile.service';

interface AppMetadata {
  role?: Roles;
}

interface UserWithRole extends User {
  app_metadata: AppMetadata;
}

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  session: null,
  profile: null,
  loading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(store => ({
    isAuthenticated: computed(() => {
      const token = store.session()?.access_token;
      if (!token) {
        return false;
      }
      const exp = expiresAtMs(store.session());
      return exp ? Date.now() < exp : true;
    }),
    user: computed(() => store.session()?.user ?? null),
    userProfile: computed(() => store.profile()),
    accessToken: computed(() => store.session()?.access_token ?? null),
    userRole: computed(() => {
      const user = store.session()?.user as UserWithRole | undefined;
      return user?.app_metadata.role;
    }),
  })),
  withMethods(
    (
      store,
      supabase: SupabaseClient = inject(SupabaseClient),
      profileService = inject(ProfileService)
    ) => {
      let fetchingProfileForUserId: string | null = null;

      const fetchUserProfile = async (userId: string): Promise<void> => {
        if (fetchingProfileForUserId === userId) {
          return;
        }

        const currentProfile = store.profile();
        if (currentProfile?.id === userId) {
          return;
        }

        fetchingProfileForUserId = userId;

        try {
          const profile = await profileService.getProfile(userId);
          if (profile) {
            patchState(store, { profile });
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        } finally {
          fetchingProfileForUserId = null;
        }
      };

      return {
        setSession: (session: Session | null) => {
          patchState(store, { session, error: null });
        },

        handleSessionChange: async (session: Session | null) => {
          patchState(store, { session, error: null });
          if (session?.user?.id) {
            await fetchUserProfile(session.user.id);
          } else {
            patchState(store, { profile: null });
          }
        },

        clearProfile: () => patchState(store, { profile: null }),

        clearError: () => patchState(store, { error: null }),

        resetLoadingState: () => patchState(store, { loading: false }),

        loginWithPassword: async (credentials: { email: string; password: string }): Promise<Session> => {
          patchState(store, { loading: true, error: null });
          try {
            const res = await supabase.signInWithPassword(credentials.email, credentials.password);
            if (res.error) {
              throw new Error(res.error.message);
            }
            if (res.data.session) {
              patchState(store, { session: res.data.session });
              await fetchUserProfile(res.data.session.user.id);
              return res.data.session;
            }
            throw new Error('No session returned');
          } catch (e: unknown) {
            const error = normalizeAuthError(e, 'Login failed');
            patchState(store, { error, loading: false });
            throw e;
          } finally {
            patchState(store, { loading: false });
          }
        },

        loginWithEmailOtp: async (email: string): Promise<void> => {
          patchState(store, { loading: true, error: null });
          try {
            const res = await supabase.signInWithEmail(email);
            if (res.error) {
              throw new Error(res.error.message);
            }
          } catch (e: unknown) {
            const error = normalizeAuthError(e, 'Email OTP failed');
            patchState(store, { error, loading: false });
            throw e;
          } finally {
            patchState(store, { loading: false });
          }
        },

        loginWithProvider: async (provider: Provider): Promise<void> => {
          patchState(store, { loading: true, error: null });
          try {
            const res = await supabase.signInWithProvider(provider);
            if (res.error) {
              throw new Error(res.error.message);
            }
          } catch (e: unknown) {
            const error = normalizeAuthError(e, 'Provider login failed');
            patchState(store, { error, loading: false });
            throw e;
          } finally {
            patchState(store, { loading: false });
          }
        },

        signup: async (credentials: { email: string; password: string }): Promise<Session | null> => {
          patchState(store, { loading: true, error: null });
          try {
            const res = await supabase.signUp(credentials.email, credentials.password);
            if (res.error) {
              throw new Error(res.error.message);
            }
            if (res.data.session) {
              patchState(store, { session: res.data.session });
              await fetchUserProfile(res.data.session.user.id);
              return res.data.session;
            }
            return null;
          } catch (e: unknown) {
            const error = normalizeAuthError(e, 'Signup failed');
            patchState(store, { error, loading: false });
            throw e;
          } finally {
            patchState(store, { loading: false });
          }
        },

        logout: async (): Promise<void> => {
          patchState(store, { loading: true, error: null });
          try {
            const res = await supabase.signOut();
            if (res.error) {
              throw new Error(res.error.message);
            }
            patchState(store, { session: null, profile: null });
          } catch (e: unknown) {
            const error = normalizeAuthError(e, 'Logout failed');
            patchState(store, { error, loading: false });
            throw e;
          } finally {
            patchState(store, { loading: false });
          }
        },
      };
    }
  )
);

const normalizeAuthError = (error: unknown, fallback: string) =>
  error && typeof error === 'object' && 'message' in error
    ? (error as { message: string }).message
    : fallback;

const expiresAtMs = (s: Session | null): number | null => {
  const v: unknown = s?.expires_at;
  if (typeof v === 'number') {
    return v * 1000;
  }
  if (typeof v === 'string') {
    return Date.parse(v);
  }
  return null;
};
