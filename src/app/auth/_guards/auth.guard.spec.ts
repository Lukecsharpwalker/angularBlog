import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';
import { authAdminGuard } from './authAdminGuard';

describe('authGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
