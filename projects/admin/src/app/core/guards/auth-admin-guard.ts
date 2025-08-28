import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Roles } from 'shared';
import { SupabaseService } from 'shared';

export const authAdminGuard: CanMatchFn = async (): Promise<boolean> => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);
  
  const session = await supabaseService.getCurrentSession();
  if (session?.user?.app_metadata?.['role'] === Roles.ADMIN) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
