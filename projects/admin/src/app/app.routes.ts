import { Routes } from '@angular/router';
import { authAdminGuard } from './core/auth/auth-admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./layout/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canMatch: [authAdminGuard],
    children: [
      {
        path: 'posts',
        loadChildren: () => import('./features/add-post/add-post.routes'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
