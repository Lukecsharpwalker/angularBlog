import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./placeholder.component').then(c => c.PlaceholderComponent),
  },
];