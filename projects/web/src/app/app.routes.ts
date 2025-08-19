import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/main-page.routes')
  },
  {
    path: 'post',
    loadChildren: () => import('./features/post/post.routes')
  },
  // Placeholder for future features
  // { path: 'tags', loadChildren: () => import('./features/tags/tags.routes') },
  {
    path: '**',
    redirectTo: ''
  }
];
