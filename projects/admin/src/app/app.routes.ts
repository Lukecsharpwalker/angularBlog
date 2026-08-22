import { Routes } from '@angular/router';
import { authAdminGuard } from './core/auth/auth-admin.guard';
import { ADMIN_PATH, ADMIN_ROUTE } from './core/routing/admin-routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: ADMIN_ROUTE.posts,
    pathMatch: 'full',
  },
  {
    path: ADMIN_PATH.login,
    loadComponent: () => import('./layout/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canMatch: [authAdminGuard],
    children: [
      {
        path: ADMIN_PATH.post,
        loadChildren: () => import('./features/add-post/add-post.routes'),
      },
      {
        path: ADMIN_PATH.posts,
        loadChildren: () => import('./features/post-list/post-list.routes'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: ADMIN_ROUTE.posts,
  },
];
