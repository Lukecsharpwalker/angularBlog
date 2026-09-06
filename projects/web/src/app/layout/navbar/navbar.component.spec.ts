import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { AuthService, UserService } from '@shared/core/auth';
import { ProfileService } from '@shared/core/profile/profile.service';
import { DynamicDialogService } from '@shared/pattern/dynamic-dialog';
import { ProfileStore } from '../../core';
import { CookieConsentService } from '../cookie-consent/cookie-consent.service';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  const createCommonMocks = () => ({
    authService: {
      signOut: jasmine.createSpy('signOut').and.returnValue(of(null)),
    },
    dynamicDialogService: {
      openDialog: jasmine.createSpy('openDialog').and.returnValue(new Subject()),
    },
    cookieConsentService: {
      needsConsent: jasmine.createSpy('needsConsent').and.returnValue(false),
      showConsentDialog: jasmine.createSpy('showConsentDialog').and.returnValue(Promise.resolve()),
    },
  });

  describe('with mocked ProfileStore', () => {
    let fixture: ComponentFixture<NavbarComponent>;
    let component: NavbarComponent;
    let profileStoreMock: { userName: ReturnType<typeof signal<string | undefined>> };

    beforeEach(async () => {
      const mocks = createCommonMocks();
      profileStoreMock = {
        userName: signal<string | undefined>(undefined),
      };

      await TestBed.configureTestingModule({
        imports: [NavbarComponent],
        providers: [
          provideRouter([]),
          { provide: AuthService, useValue: mocks.authService },
          { provide: DynamicDialogService, useValue: mocks.dynamicDialogService },
          { provide: CookieConsentService, useValue: mocks.cookieConsentService },
          { provide: ProfileStore, useValue: profileStoreMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NavbarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('shows authenticated navigation when user exists', () => {
      profileStoreMock.userName.set('Lukasz');
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent as string;
      expect(text).toContain('Hello, Lukasz');
      expect(text).toContain('Sign Out');
      expect(text).not.toContain('Sign In');
    });
  });

  describe('with actual ProfileStore', () => {
    let fixture: ComponentFixture<NavbarComponent>;
    let component: NavbarComponent;
    let profileServiceMock: Pick<ProfileService, 'getProfile'>;

    beforeEach(async () => {
      const mocks = createCommonMocks();
      const userServiceMock: Pick<UserService, 'appUser$' | 'setAppUser'> = {
        appUser$: of({ id: 'user-1' } as never),
        setAppUser: jasmine.createSpy('setAppUser'),
      };
      profileServiceMock = {
        getProfile: jasmine
          .createSpy('getProfile')
          .and.returnValue(of({ id: 'user-1', username: 'Lukasz' } as never)),
      };

      await TestBed.configureTestingModule({
        imports: [NavbarComponent],
        providers: [
          provideRouter([]),
          { provide: AuthService, useValue: mocks.authService },
          { provide: DynamicDialogService, useValue: mocks.dynamicDialogService },
          { provide: CookieConsentService, useValue: mocks.cookieConsentService },
          { provide: UserService, useValue: userServiceMock },
          { provide: ProfileService, useValue: profileServiceMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NavbarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('shows authenticated navigation when profile is loaded by actual store', async () => {
      await fixture.whenStable();
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent as string;
      expect(profileServiceMock.getProfile).toHaveBeenCalledWith('user-1');
      expect(text).toContain('Hello, Lukasz');
      expect(text).toContain('Sign Out');
      expect(text).not.toContain('Sign In');
    });
  });
});
