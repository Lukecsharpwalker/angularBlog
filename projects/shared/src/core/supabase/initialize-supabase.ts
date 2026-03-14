import { inject } from '@angular/core';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { SupabaseClient } from './supabase.client';
import { AuthStore } from '../auth/auth.store';

export function supabaseInitializer(supabase: SupabaseClient): () => Promise<void> {
  return async () => {
    const authStore = inject(AuthStore);

    const currentSession = await supabase.getCurrentSession();
    await authStore.handleSessionChange(currentSession);

    supabase.authChanges(async (event: AuthChangeEvent, session: Session | null) => {
      await authStore.handleSessionChange(session);
    });
  };
}
