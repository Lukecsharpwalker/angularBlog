import { Directive, TemplateRef, ViewContainerRef, inject, input, effect } from '@angular/core';
import { SupabaseClient } from 'shared';

@Directive({
  selector: '[webHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  readonly role = input.required<string>({ alias: 'webHasRole' });

  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private supabaseClient = inject(SupabaseClient);

  private hasView = false;

  private _renderEff = effect(() => {
    const requiredRole = this.role();

    const session = this.supabaseClient.getSession();
    const userRole = session?.user?.app_metadata?.['role'] as string | undefined;

    const allowed = !!userRole && userRole === requiredRole;

    if (allowed) {
      if (!this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
    } else if (this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  });
}
