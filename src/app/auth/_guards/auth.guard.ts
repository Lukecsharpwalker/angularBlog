import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
<<<<<<< HEAD
<<<<<<< HEAD
import { AuthService } from '../auth.service';
=======
>>>>>>> 34e7e50 (supabase added, firebase removed)
import { Roles } from '../../shared/_enums/roles';
<<<<<<< HEAD
=======
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../auth.service';
>>>>>>> 2ca65a2 (auth guard moved to auth folder)
=======
import { SupabaseService } from '../../services/supabase.service';
>>>>>>> 793fe4a (login fixed)

export const authGuard: CanMatchFn = (): boolean => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);
<<<<<<< HEAD

<<<<<<< HEAD
<<<<<<< HEAD
  if (authService.user$()?.roles?.includes(Roles.ADMIN)) {
=======
  console.log('GUARD', authService.isAdmin$());
  if (authService.isAdmin$()) {
>>>>>>> 2ca65a2 (auth guard moved to auth folder)
=======
  const session = supabaseService.getSession();

  // For now, just check if the user is authenticated
  // In a real application, you would check for specific roles in the user's metadata
  if (session) {
>>>>>>> 793fe4a (login fixed)
    return true;
  } else {
    router.navigate(['/posts']);
    return false;
  }
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> 2ca65a2 (auth guard moved to auth folder)
=======
  // if (authService.user$()?.roles?.includes(Roles.ADMIN)) {
  //   return true;
  // } else {
  //   router.navigate(['/posts']);
  //   return false;
  // }
  return true;
>>>>>>> 34e7e50 (supabase added, firebase removed)
=======
>>>>>>> 793fe4a (login fixed)
};
