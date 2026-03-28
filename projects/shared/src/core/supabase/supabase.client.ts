import {
  computed,
  inject,
  Injectable,
  InjectionToken,
  NgZone,
  OnDestroy,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  createClient,
  Provider,
  Session,
  SupabaseClient as SupabaseClientType,
  User,
} from '@supabase/supabase-js';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { Roles } from '@shared/core/auth';
import { Profile } from './profiles';

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

interface AppMetadata {
  role?: Roles;
}

interface UserWithRole extends User {
  app_metadata: AppMetadata;
}

export const SUPABASE_CONFIG = new InjectionToken<SupabaseConfig>('SUPABASE_CONFIG');

@Injectable({ providedIn: 'root' })
export class SupabaseClient implements OnDestroy {
  readonly userRole = computed(() => {
    return (this.session()?.user as UserWithRole)?.app_metadata?.role;
  });

  readonly supabaseClient: WritableSignal<SupabaseClientType | null> = signal(null);

  readonly userProfile = signal<Profile | null>(null);

  private readonly session = signal<Session | null>(null);
  private sub?: { data: { subscription: { unsubscribe(): void } } };

  constructor() {
    // this.convertSessionStateToSignal();
  }

  ngOnDestroy() {
    this.sub?.data.subscription.unsubscribe();
  }
  //
  // async checkIsSessionLoaded(): Promise<void> {
  //   if (!this.session()) {
  //     await this.loadSession();
  //   }
  // }

  get getClient(): SupabaseClientType {
    console.log(this.supabaseClient());
    return this.supabaseClient() as SupabaseClientType;
  }

  //TODO GET SUPABASE AUTH

  setClient(client: SupabaseClientType) {
    this.supabaseClient.set(client);
  }

  setSession(session: Session | null) {
    this.session.set(session);
  }

  //
  // signInWithMagicLink(email: string) {
  //   return this.supabase.auth.signInWithOtp({ email });
  // }
  signInWithPassword(email: string, password: string) {
    return from(this.supabaseClient()!.auth.signInWithPassword({ email, password })).pipe(
      switchMap(response => {
        if (response.data.user?.id) {
          return this.getProfile(response.data.user.id).pipe(
            tap(profile => this.userProfile.set(profile))
          );
        }
        return of(null);
      })
    );
  }
  signUp(email: string, password: string) {
    return this.supabase.auth.signUp({ email, password });
  }
  signInWithProvider(provider: Provider) {
    return this.supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
  }
  signOut() {
    return from(this.supabaseClient()!.auth.signOut()).pipe(
      tap(() => {
        this.userProfile.set(null);
      })
    );
  }

  convertSessionStateToSignal() {
    this.sub = this.getClient.auth.onAuthStateChange((event, session) => {
      console.log('tet');
      this.session.set(session);
    });
  }

  getProfile(userId: string | undefined): Observable<Profile | null> {
    if (!userId) {
      return of(null);
    }
    return from(this.supabaseClient()!.from('profiles').select('*').eq('id', userId).single()).pipe(
      map(({ data, error }) => (error ? null : data))
    );
  }
}
