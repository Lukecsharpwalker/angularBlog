import { Directive, TemplateRef, ViewContainerRef, inject, input } from '@angular/core';
import { SupabaseService } from 'shared';

@Directive({
  selector: '[sharedHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  readonly role = input.required<string, string>({
    alias: 'sharedHasRole',
    transform: (role: string): string => {
      this.updateView(role);
      return role;
    },
  });

  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private supabaseService = inject(SupabaseService);

  private hasView = false;

  private updateView(requiredRole: string): void {
    const session = this.supabaseService.getSession();
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
  }
}
