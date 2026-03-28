import { inject, NgZone } from '@angular/core';
import { SUPABASE_CONFIG, SupabaseClient } from './supabase.client';
import { createClient, SupabaseClient as SupabaseClientType } from '@supabase/supabase-js';
import { firstValueFrom, from, switchMap } from 'rxjs';
import { Profile } from '@shared/core/supabase/profiles';

export function supabaseInitializer(ssrOn = false): () => Promise<Profile | null> {
  const ngZone = inject(NgZone);
  const config = inject(SUPABASE_CONFIG);
  const client = inject(SupabaseClient);

  let supabase: SupabaseClientType;

  //Supabase is not working with SRR/SSG as expected
  if (ssrOn) {
    supabase = ngZone.runOutsideAngular(() =>
      createClient(config.supabaseUrl, config.supabaseKey)
    );
  } else {
    supabase = createClient(config.supabaseUrl, config.supabaseKey);
  }

  client.setClient(supabase);

  return () =>
    firstValueFrom(
      from(supabase.auth.getSession()).pipe(
        switchMap(({ data }) => {
          client.setSession(data.session);
          client.convertSessionStateToSignal();
          return client.getProfile(data.session?.user.id);
        })
      )
    );
}
