import { inject, InjectionToken, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './supabase.service';

export const SUPABASE_CLIENT = new InjectionToken<SupabaseClient>('SupabaseClient');

export function createSupabaseClient(): SupabaseClient {
  const config = inject(SUPABASE_CONFIG);
  const platform = inject(PLATFORM_ID);
  const zone = inject(NgZone);

  //TODO: Implement server-side authentication logic with SSR and cookies/headers
  return isPlatformServer(platform)
    ? zone.runOutsideAngular(() => createClient(config.supabaseUrl, config.supabaseKey))
    : createClient(config.supabaseUrl, config.supabaseKey);
}
