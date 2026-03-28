import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Roles } from '@shared/core/auth/roles';
import { SupabaseClient } from '@shared/core/supabase';

export const authAdminGuard: CanMatchFn = (): boolean => {
  const supabaseClient = inject(SupabaseClient);
  const router = inject(Router);

  if (supabaseClient.userRole() === Roles.ADMIN) {
    return true;
  }

  void router.navigate(['/login']);
  return false;
};
