import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./main-page/main-page.component').then(m => m.MainPageComponent)
  }
] as Routes;