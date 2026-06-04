import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { AuthService } from '@shared/core/auth';
import { DynamicDialogService } from '@shared/pattern/dynamic-dialog';
import { ProfileStore } from './core';
import { CookieConsentService } from './layout/cookie-consent/cookie-consent.service';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { signOut: jasmine.createSpy('signOut').and.returnValue(of(null)) } },
        {
          provide: DynamicDialogService,
          useValue: { openDialog: jasmine.createSpy('openDialog').and.returnValue(new Subject()) },
        },
        {
          provide: CookieConsentService,
          useValue: {
            needsConsent: jasmine.createSpy('needsConsent').and.returnValue(false),
            showConsentDialog: jasmine.createSpy('showConsentDialog').and.returnValue(Promise.resolve()),
          },
        },
        { provide: ProfileStore, useValue: { userName: signal<string | undefined>(undefined) } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
