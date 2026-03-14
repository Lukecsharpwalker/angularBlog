import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  inject,
  input,
  afterRenderEffect,
  OnInit,
} from '@angular/core';
import { AuthStore } from '@shared/core/auth';

@Directive({
  selector: '[webHasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit {
  readonly requiredRole = input.required<string>({ alias: 'webHasRole' });

  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private authStore = inject(AuthStore);

  private hasView = false;

  ngOnInit() {
    const allowed = !!this.authStore.userRole() && this.authStore.userRole() === this.requiredRole();

    if (allowed) {
      if (!this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
    } else if (this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
