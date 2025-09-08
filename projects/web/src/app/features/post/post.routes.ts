import { Routes } from '@angular/router';

export default [
  {
    path: ':id',
    loadComponent: () => import('./components/details/post.component').then(m => m.PostComponent)
  }
] as Routes;