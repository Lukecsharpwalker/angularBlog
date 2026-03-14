import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthStore } from '@shared/core/auth';
import { Roles } from '@shared/core/auth/roles';

export const authAdminGuard: CanMatchFn = (): boolean => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.userRole() === Roles.ADMIN) {
    return true;
  }

  void router.navigate(['/login']);
  return false;
};
