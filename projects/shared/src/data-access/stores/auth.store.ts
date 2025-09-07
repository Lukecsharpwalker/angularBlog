import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  AuthChangeEvent,
  Provider,
  Session,
  AuthResponse,
  AuthError,
  Subscription,
  OAuthResponse,
} from '@supabase/supabase-js';
import { catchError, EMPTY, finalize, from, pipe, switchMap, tap } from 'rxjs';
import { SupabaseClient } from '../clients/supabase.client';

interface AuthState {
  session: Session | null;
  loading: boolean;
  error: string | null;
  ready: boolean;
  initialized: boolean;
}

const initialState: AuthState = {
  session: null,
  loading: false,
  error: null,
  ready: false,
  initialized: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(store => ({
    isAuthenticated: computed(() => {
      const token = store.session()?.access_token;
      if (!token) return false;
      const exp = expiresAtMs(store.session());
      return exp ? Date.now() < exp : true;
    }),
    user: computed(() => store.session()?.user ?? null),
    accessToken: computed(() => store.session()?.access_token ?? null),
  })),
  withMethods((store, supabase: SupabaseClient = inject(SupabaseClient)) => {
    let authSub: { data: { subscription: Subscription } } | null = null;

    return {
      init: async () => {
        if (store.initialized()) return;
        patchState(store, { initialized: true });

        authSub = supabase.authChanges((_: AuthChangeEvent, session: Session | null) => {
          patchState(store, { session, error: null });
        });

        try {
          const current: Session | null = await supabase.getCurrentSession();
          patchState(store, { session: current });
        } finally {
          patchState(store, { ready: true });
        }
      },

      destroy: () => {
        authSub?.data.subscription?.unsubscribe?.();
        authSub = null;
      },

      clearError: () => patchState(store, { error: null }),
      
      resetLoadingState: () => patchState(store, { loading: false }),

      whenReady: (): Promise<void> =>
        new Promise<void>((resolve: () => void) => {
          if (store.ready()) return resolve();
          const tick = (): void => {
            if (store.ready()) {
              resolve();
            } else {
              setTimeout(tick, 0);
            }
          };
          tick();
        }),

      loginWithPassword: rxMethod<{ email: string; password: string }>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(({ email, password }: { email: string; password: string }) =>
            from(supabase.signInWithPassword(email, password))
          ),
          tap((res: AuthResponse) => {
            if (res.error) throw new Error(res.error.message);
              if (res.data.session) {
              patchState(store, { session: res.data.session, loading: false });
            } else {
              patchState(store, { loading: false });
            }
          }),
          catchError((e: unknown) => {
            patchState(store, { error: normalizeAuthError(e, 'Login failed'), loading: false });
            return EMPTY;
          })
        )
      ),

      loginWithEmailOtp: rxMethod<{ email: string }>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(({ email }: { email: string }) => from(supabase.signInWithEmail(email))),
          tap((res: AuthResponse) => {
            if (res.error) throw new Error(res.error.message);
          }),
          finalize(() => patchState(store, { loading: false })),
          catchError((e: unknown) => {
            patchState(store, { error: normalizeAuthError(e, 'Email OTP failed') });
            return EMPTY;
          })
        )
      ),

      loginWithProvider: rxMethod<{ provider: Provider }>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(({ provider }: { provider: Provider }) =>
            from(supabase.signInWithProvider(provider) as Promise<OAuthResponse>)
          ),
          tap((res: OAuthResponse) => {
            if (res.error) throw new Error(res.error.message);
          }),
          finalize(() => patchState(store, { loading: false })),
          catchError((e: unknown) => {
            patchState(store, { error: normalizeAuthError(e, 'Provider login failed') });
            return EMPTY;
          })
        )
      ),

      signup: rxMethod<{ email: string; password: string }>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(({ email, password }: { email: string; password: string }) =>
            from(supabase.signUp(email, password))
          ),
          tap((res: AuthResponse) => {
            if (res.error) throw new Error(res.error.message);
          }),
          tap((res: AuthResponse) => {
            if (res.data.session) patchState(store, { session: res.data.session });
          }),
          finalize(() => patchState(store, { loading: false })),
          catchError((e: unknown) => {
            patchState(store, { error: normalizeAuthError(e, 'Signup failed') });
            return EMPTY;
          })
        )
      ),

      logout: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(() => from(supabase.signOut())),
          tap((res: { error: AuthError | null }) => {
            if (res.error) throw new Error(res.error.message);
          }),
          tap(() => patchState(store, { session: null })),
          finalize(() => patchState(store, { loading: false })),
          catchError((e: unknown) => {
            patchState(store, { error: normalizeAuthError(e, 'Logout failed') });
            return EMPTY;
          })
        )
      ),
    };
  }),
  withHooks({
    onDestroy(store) {
      store.destroy?.();
    },
  })
);

const normalizeAuthError = (error: unknown, fallback: string) =>
  error && typeof error === 'object' && 'message' in error
    ? (error as { message: string }).message
    : fallback;

const expiresAtMs = (s: Session | null): number | null => {
  const v: unknown = s?.expires_at;
  if (typeof v === 'number') return v * 1000;
  if (typeof v === 'string') return Date.parse(v);
  return null;
};
