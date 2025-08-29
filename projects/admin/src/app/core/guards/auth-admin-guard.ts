import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Roles } from 'shared';
import { AuthStore } from 'shared';

export const authAdminGuard: CanMatchFn = async (): Promise<boolean> => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  
  await authStore.init();
  await authStore.whenReady();
  
  const user = authStore.user();
  if (user?.app_metadata?.['role'] === Roles.ADMIN) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
