import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./placeholder.routes').then(m => m.routes),
  },
];
