import { inject, Injectable, NgZone, OnDestroy, signal } from '@angular/core';
import {
  AuthChangeEvent,
  createClient,
  Provider,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService implements OnDestroy {
  private supabase: SupabaseClient;
  private sub?: { data: { subscription: { unsubscribe(): void } } };
  private readonly ngZone = inject(NgZone);

  // Optional: expose reactive session
  readonly sessionSig = signal<Session | null>(null);
  readonly ready = signal(false);

  constructor() {
    this.supabase = this.ngZone.runOutsideAngular(() =>
      createClient(environment.supabaseUrl, environment.supabaseKey)
    );
    this.initializeSession();
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

  get getClient(): SupabaseClient {
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
}
