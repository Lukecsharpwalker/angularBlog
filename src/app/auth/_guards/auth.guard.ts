import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
<<<<<<< HEAD
import { AuthService } from '../auth.service';
import { Roles } from '../../shared/_enums/roles';
=======
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../auth.service';
>>>>>>> 2ca65a2 (auth guard moved to auth folder)

export const authGuard: CanMatchFn = (): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);
<<<<<<< HEAD

  if (authService.user$()?.roles?.includes(Roles.ADMIN)) {
=======
  console.log('GUARD', authService.isAdmin$());
  if (authService.isAdmin$()) {
>>>>>>> 2ca65a2 (auth guard moved to auth folder)
    return true;
  } else {
    router.navigate(['/posts']);
    return false;
  }
<<<<<<< HEAD
=======

>>>>>>> 2ca65a2 (auth guard moved to auth folder)
};
