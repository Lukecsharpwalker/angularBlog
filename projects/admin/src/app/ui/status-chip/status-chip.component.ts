import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'admin-status-chip',
  standalone: true,
  template: '{{ label() }}',
  styleUrl: './status-chip.component.css',
  host: {
    class: 'chip',
    '[attr.data-state]': 'isDraft() ? "draft" : "published"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusChipComponent {
  readonly isDraft = input.required<boolean>();

  protected readonly label = computed(() => (this.isDraft() ? 'Draft' : 'Published'));
}
