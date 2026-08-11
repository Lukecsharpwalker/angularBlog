import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Roles, UserService } from '@shared/core/auth';
import { ADMIN_ROUTE } from '../routing/admin-routes';

export const authAdminGuard: CanMatchFn = (): Observable<boolean | UrlTree> => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.appUser$.pipe(
    take(1),
    map(user => {
      if (user?.app_metadata.role === Roles.ADMIN) {
        return true;
      }
      //TODO: Refactor - capture the attempted URL from the CanMatchFn segments and pass it as a returnUrl query param, so LoginComponent can navigate back to it instead of always landing on /posts
      return router.createUrlTree([ADMIN_ROUTE.login]);
    })
  );
};
