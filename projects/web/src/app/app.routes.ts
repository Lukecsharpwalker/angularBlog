import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    //TODO: https://github.com/Lukecsharpwalker/angularBlog/issues/123
    loadChildren: () => import('./features/main-page/main-page.routes'),
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
