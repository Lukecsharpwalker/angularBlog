import { inject, Injectable, NgZone, OnDestroy, signal, InjectionToken } from '@angular/core';
import {
  AuthChangeEvent,
  createClient,
  Provider,
  Session,
  SupabaseClient as SupabaseClientType,
} from '@supabase/supabase-js';

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

export const SUPABASE_CONFIG = new InjectionToken<SupabaseConfig>('SUPABASE_CONFIG');

@Injectable({ providedIn: 'root' })
export class SupabaseClient implements OnDestroy {
  session: Session | null = null;
  readonly sessionSig = signal<Session | null>(null);
  readonly ready = signal(false);

  private supabase: SupabaseClientType;
  private sub?: { data: { subscription: { unsubscribe(): void } } };
  private readonly ngZone = inject(NgZone);
  private readonly config = inject(SUPABASE_CONFIG);

  constructor() {
    this.supabase = this.ngZone.runOutsideAngular(() =>
      createClient(this.config.supabaseUrl, this.config.supabaseKey)
    );
    this.initializeSession();
  }

  ngOnDestroy() {
    this.sub?.data.subscription.unsubscribe();
  }

  getSession(): Session | null {
    return this.sessionSig();
  }

  async getCurrentSession(): Promise<Session | null> {
    const s = this.sessionSig();
    if (s) return s;
    const {
      data: { session },
    } = await this.supabase.auth.getSession();
    this.sessionSig.set(session);
    return session;
  }

  authChanges(cb: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(cb);
  }

  get getClient() {
    return this.supabase;
  }

  signInWithEmail(email: string) {
    return this.supabase.auth.signInWithOtp({ email });
  }
  signInWithPassword(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
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
    return this.supabase.auth.signOut();
  }

  private async initializeSession(): Promise<void> {
    const {
      data: { session },
    } = await this.supabase.auth.getSession();
    this.ngZone.run(() => {
      this.sessionSig.set(session);
      this.ready.set(true);
    });

    this.sub = this.supabase.auth.onAuthStateChange((event, session) => {
      this.ngZone.run(() => this.sessionSig.set(session));
    });
  }
}
