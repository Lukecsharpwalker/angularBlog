import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { SupabaseService, SUPABASE_CONFIG, supabaseInitializer } from 'shared';
import { environment } from '../../../../environments/environment';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { provideQuillConfig } from 'ngx-quill/config';
import hljs from 'highlight.js/lib/core';
import { routes } from './app.routes';
import { quillToolbarConfig } from './core/utils/quill-toolbar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),

    // Supabase configuration
    {
      provide: SUPABASE_CONFIG,
      useValue: {
        supabaseUrl: environment.supabaseUrl,
        supabaseKey: environment.supabaseKey,
      },
    },
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
