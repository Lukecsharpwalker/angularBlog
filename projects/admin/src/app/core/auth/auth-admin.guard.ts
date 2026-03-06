import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { AuthStore } from '@shared/core/auth';
import { Roles } from './roles';

export const authAdminGuard: CanMatchFn = async (): Promise<boolean> => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  await authStore.init();
  await authStore.whenReady();

  const user: User | null = authStore.user();
  if (user?.app_metadata?.['role'] === Roles.ADMIN) {
    return true;
  } else {
    void router.navigate(['/login']);
    return false;
  }
};
