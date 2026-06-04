import { Route } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { firstValueFrom, Observable, ReplaySubject, Subject } from 'rxjs';
import { Roles, UserService } from '@shared/core/auth';
import { UserWithRole } from '@shared/core/auth/user.model';
import { authAdminGuard } from './auth-admin.guard';

describe('authAdminGuard', () => {
  const createUser = (role?: Roles): UserWithRole =>
    ({
      app_metadata: role ? { role } : {},
    }) as UserWithRole;

  const setup = (appUser$: Observable<UserWithRole | null>) => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: UserService,
          useValue: { appUser$ },
        },
      ],
    });

    const router = TestBed.inject(Router);
    const createUrlTreeSpy = spyOn(router, 'createUrlTree').and.callThrough();

    const runGuard = () =>
      TestBed.runInInjectionContext(
        () => authAdminGuard({} as Route, []) as Observable<boolean | UrlTree>
      );

    return { router, createUrlTreeSpy, runGuard };
  };

  it('returns true for an admin user', async () => {
    const appUser$ = new ReplaySubject<UserWithRole | null>(1);
    appUser$.next(createUser(Roles.ADMIN));
    const { createUrlTreeSpy, runGuard } = setup(appUser$);

    const result = await firstValueFrom(runGuard());

    expect(result).toBe(true);
    expect(createUrlTreeSpy).not.toHaveBeenCalled();
  });

  it('redirects to /login for an unauthenticated user', async () => {
    const appUser$ = new ReplaySubject<UserWithRole | null>(1);
    appUser$.next(null);
    const { router, createUrlTreeSpy, runGuard } = setup(appUser$);

    const result = await firstValueFrom(runGuard());

    expect(result instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(result as UrlTree)).toBe('/login');
    expect(createUrlTreeSpy).toHaveBeenCalledOnceWith(['/login']);
  });

  [Roles.READER, Roles.MODERATOR, Roles.WRITER].forEach(role => {
    it(`redirects authenticated ${role} to /login`, async () => {
      const appUser$ = new ReplaySubject<UserWithRole | null>(1);
      appUser$.next(createUser(role));
      const { router, createUrlTreeSpy, runGuard } = setup(appUser$);

      const result = await firstValueFrom(runGuard());

      expect(result instanceof UrlTree).toBe(true);
      expect(router.serializeUrl(result as UrlTree)).toBe('/login');
      expect(createUrlTreeSpy).toHaveBeenCalledOnceWith(['/login']);
    });
  });

  it('redirects when app_metadata.role is missing', async () => {
    const appUser$ = new ReplaySubject<UserWithRole | null>(1);
    appUser$.next(createUser());
    const { router, createUrlTreeSpy, runGuard } = setup(appUser$);

    const result = await firstValueFrom(runGuard());

    expect(result instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(result as UrlTree)).toBe('/login');
    expect(createUrlTreeSpy).toHaveBeenCalledOnceWith(['/login']);
  });

  it('uses only the first emission from appUser$', async () => {
    const appUser$ = new Subject<UserWithRole | null>();
    const { createUrlTreeSpy, runGuard } = setup(appUser$);

    const result$ = firstValueFrom(runGuard());
    appUser$.next(createUser(Roles.ADMIN));
    appUser$.next(createUser(Roles.READER));
    appUser$.next(null);

    const result = await result$;

    expect(result).toBe(true);
    expect(createUrlTreeSpy).not.toHaveBeenCalled();
  });

  it('waits for the first emission before resolving', async () => {
    const appUser$ = new Subject<UserWithRole | null>();
    const { router, createUrlTreeSpy, runGuard } = setup(appUser$);

    const result$ = firstValueFrom(runGuard());
    let settled = false;
    result$.finally(() => {
      settled = true;
    });

    await Promise.resolve();
    expect(settled).toBe(false);

    appUser$.next(createUser(Roles.WRITER));
    const result = await result$;

    expect(result instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(result as UrlTree)).toBe('/login');
    expect(createUrlTreeSpy).toHaveBeenCalledOnceWith(['/login']);
  });
});
