import { computed, Injectable, signal } from '@angular/core';
import { Portal, TemplatePortal } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class AngularCdkTeleportService {
  readonly portal = computed(() => this.activePortal());

  private readonly activePortal = signal<Portal<unknown> | null>(null);

  teleport(portal: TemplatePortal<unknown>): void {
    this.activePortal.set(portal);
  }

  finishTeleportation(): void {
    this.activePortal.set(null);
  }
}
