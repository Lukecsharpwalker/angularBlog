import {
  ApplicationConfig,
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
import { provideQuillConfig } from 'ngx-quill/config';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { quillToolbarConfig } from './utlis/quill-toolbar';
import hljs from 'highlight.js/lib/core';
import { SupabaseService } from './services/supabase.service';
import { supabaseInitializer } from './utlis/initialize-supabase';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideAppInitializer(() => {
      const supabaseService = inject(SupabaseService);
      return supabaseInitializer(supabaseService)();
    }),

    provideHighlightOptions({
      coreLibraryLoader: () => import('highlight.js/lib/core'),
      languages: {
        xml: () => import('highlight.js/lib/languages/xml'),
        typescript: () => import('highlight.js/lib/languages/typescript'),
        javascript: () => import('highlight.js/lib/languages/javascript'),
        css: () => import('highlight.js/lib/languages/css'),
        plain: () => import('highlight.js/lib/languages/plaintext'),
      },
    }),
    provideQuillConfig({
      modules: {
        syntax: { hljs },
        toolbar: quillToolbarConfig,
      },
    }),
  ],
};
