import { Routes } from '@angular/router';
import { authAdminGuard } from './core/guards/authAdminGuard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'posts',
    canMatch: [authAdminGuard],
    loadChildren: () => import('./features/posts/add-post/add-post.routes')
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
