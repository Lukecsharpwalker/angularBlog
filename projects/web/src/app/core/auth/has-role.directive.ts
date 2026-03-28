import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { SupabaseClient } from '@shared/core/supabase';

@Directive({
  selector: '[webHasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit {
  readonly requiredRole = input.required<string>({ alias: 'webHasRole' });

  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private supabaseClient = inject(SupabaseClient);

  private hasView = false;

  ngOnInit() {
    const allowed =
      !!this.supabaseClient.userRole() && this.supabaseClient.userRole() === this.requiredRole();

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
