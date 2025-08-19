import { inject, Injectable, NgZone, InjectionToken } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Provider,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

export const SUPABASE_CONFIG = new InjectionToken<SupabaseConfig>('SupabaseConfig');

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public session: AuthSession | null = null;
  private supabase: SupabaseClient;
  private readonly ngZone = inject(NgZone);
  private readonly config = inject(SUPABASE_CONFIG);

  constructor() {
    this.supabase = this.ngZone.runOutsideAngular(() =>
      createClient(this.config.supabaseUrl, this.config.supabaseKey),
    );
  }

  getSession(): AuthSession | null {
    return this.session;
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void,
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
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
      options: {
        redirectTo: window.location.origin,
      },
    });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }
}