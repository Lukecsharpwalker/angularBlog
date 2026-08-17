import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  inject,
  input,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '@shared/core/auth';

@Directive({
  selector: '[webHasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit {
  readonly requiredRole = input.required<string>({ alias: 'webHasRole' });

  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  private isViewCreated = false;

  ngOnInit() {
    this.userService.userRole$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(userRoles => {
      const allowed = userRoles && userRoles === this.requiredRole();
      if (!allowed || this.isViewCreated) {
        this.viewContainer.clear();
        this.isViewCreated = false;
        return;
      }
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isViewCreated = true;
    });
  }
}
