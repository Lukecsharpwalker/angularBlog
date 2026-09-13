import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Roles, UserService } from '@shared/core/auth';
import { BehaviorSubject } from 'rxjs';
import { HasRoleDirective } from './has-role.directive';

@Component({
  standalone: true,
  imports: [HasRoleDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<button *webHasRole="requiredRole">Delete</button>',
})
class TestHostComponent {
  readonly requiredRole = Roles.ADMIN;
}

describe('HasRoleDirective', () => {
  const appUser = new BehaviorSubject<{ app_metadata: { role?: Roles } } | null>(null);
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    appUser.next(null);

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: UserService, useValue: { appUser$: appUser.asObservable() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
  });

  it('reacts to user role changes', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();

    appUser.next({ app_metadata: { role: Roles.ADMIN } });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).not.toBeNull();

    appUser.next({ app_metadata: { role: Roles.READER } });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });
});
