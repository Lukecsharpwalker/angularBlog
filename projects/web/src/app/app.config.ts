import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { 
  SupabaseService,
  SUPABASE_CONFIG,
  supabaseInitializer,
  TAGS_API_SERVICE
} from 'shared';
import { environment } from '../../../../environments/environment';
import { ReaderApiService } from './core/services/reader-api.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideAppInitializer(() => {
      const supabaseService = inject(SupabaseService);
      return supabaseInitializer(supabaseService)();
    }),

    // Provide Supabase configuration
    {
      provide: SUPABASE_CONFIG,
      useValue: {
        supabaseUrl: environment.supabaseUrl,
        supabaseKey: environment.supabaseKey,
      },
    },

    // API services for shared stores
    {
      provide: TAGS_API_SERVICE,
      useExisting: ReaderApiService,
    },
  ],
};
