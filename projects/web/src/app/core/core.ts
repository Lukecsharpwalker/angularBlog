import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import {
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
  withNoIncrementalHydration,
} from '@angular/platform-browser';
import { authInitializer, SUPABASE_CONFIG } from '@shared/core/supabase';
import { environment } from '../../../../../environments/environment';

export interface CoreOptions {
  routes: Routes;
}

export function provideCore({ routes }: CoreOptions) {
  return [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay(), withNoIncrementalHydration()),
    {
      provide: SUPABASE_CONFIG,
      useValue: {
        supabaseUrl: environment.supabaseUrl,
        supabaseKey: environment.supabaseKey,
      },
    },
    provideAppInitializer(authInitializer),
  ];
}
