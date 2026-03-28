import { inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { provideQuillConfig } from 'ngx-quill/config';
import hljs from 'highlight.js/lib/core';
import { SUPABASE_CONFIG, SupabaseClient, supabaseInitializer } from '@shared/core/supabase';
import { quillToolbarConfig } from './utils/quill-toolbar';
import { environment } from '../../../../../environments/environment';
import { firstValueFrom, from, tap } from 'rxjs';

export interface CoreOptions {
  routes: Routes;
}

export function provideCore({ routes }: CoreOptions) {
  return [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),

    {
      provide: SUPABASE_CONFIG,
      useValue: {
        supabaseUrl: environment.supabaseUrl,
        supabaseKey: environment.supabaseKey,
      },
    },
    provideAppInitializer(() => {
      return supabaseInitializer()();
    }),

    provideHighlightOptions({
      coreLibraryLoader: () => import('highlight.js/lib/core'),
      languages: {
        xml: () => import('highlight.js/lib/languages/xml'),
        typescript: () => import('highlight.js/lib/languages/typescript'),
        javascript: () => import('highlight.js/lib/languages/javascript'),
        css: () => import('highlight.js/lib/languages/css'),
        sql: () => import('highlight.js/lib/languages/sql'),
        yaml: () => import('highlight.js/lib/languages/yaml'),
        plain: () => import('highlight.js/lib/languages/plaintext'),
      },
    }),
    provideQuillConfig({
      modules: {
        syntax: { hljs },
        toolbar: quillToolbarConfig,
      },
    }),
  ];
}
