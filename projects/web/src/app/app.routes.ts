import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/main-page.routes'),
  },
  {
    path: 'post',
    loadChildren: () => import('./features/post/post.routes'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
