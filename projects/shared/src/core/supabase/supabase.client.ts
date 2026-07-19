import { inject, InjectionToken, PLATFORM_ID, REQUEST, RESPONSE_INIT } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  createBrowserClient,
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';
import { SUPABASE_CONFIG } from './supabase.service';

export const SUPABASE_CLIENT = new InjectionToken<SupabaseClient>('SupabaseClient');

export function createSupabaseClient(): SupabaseClient | null {
  const config = inject(SUPABASE_CONFIG);
  const platform = inject(PLATFORM_ID);
  const request = inject(REQUEST, { optional: true });
  const responseInit = inject(RESPONSE_INIT, { optional: true });

  if (isPlatformBrowser(platform)) {
    return createBrowserClient(config.supabaseUrl, config.supabaseKey);
  }

  if (isPlatformServer(platform)) {
    return createServerClient(config.supabaseUrl, config.supabaseKey, {
      cookies: {
        getAll: () =>
          parseCookieHeader(request?.headers.get('cookie') ?? '').map(c => ({
            name: c.name,
            value: c.value ?? '',
          })),
        setAll: (cookiesToSet, headers = {}) => {
          if (!responseInit) return;

          const responseHeaders = new Headers(responseInit.headers ?? undefined);
          cookiesToSet.forEach(({ name, value, options }) => {
            responseHeaders.append('Set-Cookie', serializeCookieHeader(name, value, options));
          });
          Object.entries(headers).forEach(([key, value]) => {
            if (key.toLowerCase() === 'set-cookie') {
              responseHeaders.append(key, value);
            } else {
              responseHeaders.set(key, value);
            }
          });
          responseInit.headers = responseHeaders;
        },
      },
    });
  }

  return null;
}
