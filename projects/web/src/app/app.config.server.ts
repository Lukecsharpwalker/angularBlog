import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { createSupabaseClient, SUPABASE_CLIENT } from '@shared/core/supabase';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: SUPABASE_CLIENT, useFactory: createSupabaseClient },
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
