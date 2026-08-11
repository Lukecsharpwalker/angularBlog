import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFormComponent, provideLoginFormConfig } from '@shared/pattern/auth-form';
import { ADMIN_ROUTE } from '../../core/routing/admin-routes';

//TODO: Refactor - this is a routed page, not a layout shell; move it to features/login so layout/ holds only main-layout, navbar and sidenav
@Component({
  selector: 'admin-login',
  standalone: true,
  imports: [AuthFormComponent],
  templateUrl: './login.component.html',
  providers: [
    provideLoginFormConfig({
      showGoogleLogin: false,
      title: 'Admin sign in',
      subtitle: 'Restricted to editors and administrators.',
      submitButtonText: 'Sign in',
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly router = inject(Router);

  //TODO: Refactor - honour a returnUrl query param instead of hardcoding /posts, so a deep link to a post editor survives the login round trip; authAdminGuard must capture the attempted URL first
  protected onLoginSuccess(): void {
    void this.router.navigate([ADMIN_ROUTE.posts]);
  }
}
