import { RenderMode, ServerRoute } from '@angular/ssr';
import { getPrerenderParams } from './core/utils/prerender-params';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
