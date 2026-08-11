import { Routes } from '@angular/router';
import { authAdminGuard } from './core/auth/auth-admin.guard';
import { ADMIN_PATH, ADMIN_ROUTE } from './core/routing/admin-routes';

export const routes: Routes = [
  //TODO: Refactor - this matches before the guarded '' route below, so an already authenticated admin landing on '/' always sees the login screen; gate it on auth state or redirect to /posts and let the guard bounce anonymous users
  {
    path: '',
    redirectTo: ADMIN_ROUTE.login,
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
  //TODO: Refactor - a typo'd URL should land on a 404 page (or /posts when authenticated), not silently on the sign in screen, which reads as a session timeout
  {
    path: '**',
    redirectTo: ADMIN_ROUTE.login,
  },
];
