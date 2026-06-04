import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Roles, UserService } from '@shared/core/auth';

export const authAdminGuard: CanMatchFn = (): Observable<boolean | UrlTree> => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.appUser$.pipe(
    take(1),
    map(user => {
      if (user?.app_metadata.role === Roles.ADMIN) {
        return true;
      }
      return router.createUrlTree(['/login']);
    })
  );
};
