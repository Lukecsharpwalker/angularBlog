import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { SupabaseService } from 'shared';
import { Roles } from 'shared';

export const authAdminGuard: CanMatchFn = (): boolean => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);
  const session = supabaseService.getSession();
  console.log(session);
  if (session?.user?.app_metadata?.['role'] === Roles.ADMIN) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
