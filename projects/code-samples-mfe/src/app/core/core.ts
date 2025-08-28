import { provideRouter, Routes } from '@angular/router';
import { provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';

export interface CoreOptions {
  routes: Routes;
}

export function provideCore({ routes }: CoreOptions) {
  return [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
  ];
}
