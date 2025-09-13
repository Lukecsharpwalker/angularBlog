import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import {
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { supabaseInitializer, SupabaseClient, SUPABASE_CONFIG } from '@shared/core/supabase';
import { environment } from '../../../../../environments/environment';

export interface CoreOptions {
  routes: Routes;
}

export function provideCore({ routes }: CoreOptions) {
  return [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    {
      provide: SUPABASE_CONFIG,
      useValue: {
        supabaseUrl: environment.supabaseUrl,
        supabaseKey: environment.supabaseKey,
      },
    },
    provideAppInitializer(() => {
      const supabaseService = inject(SupabaseClient);
      return supabaseInitializer(supabaseService)();
    }),
  ];
}
