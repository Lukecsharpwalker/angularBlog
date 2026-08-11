import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'admin-panel-card',
  standalone: true,
  template: '<ng-content />',
  host: {
    class: 'block bg-surface-1 border border-edge-1 rounded-2xl shadow-card overflow-hidden',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelCardComponent {}
