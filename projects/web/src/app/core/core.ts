import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import {
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { supabaseInitializer, SupabaseService } from 'shared';

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
    provideAppInitializer(() => {
      const supabaseService = inject(SupabaseService);
      return supabaseInitializer(supabaseService)();
    }),
  ];
}
