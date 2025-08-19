import { Routes } from '@angular/router';

export default [
  {
    path: ':id',
    loadComponent: () => import('./details/post.component').then(m => m.PostComponent)
  }
] as Routes;