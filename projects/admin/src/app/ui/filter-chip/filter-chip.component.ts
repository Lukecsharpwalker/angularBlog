import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'admin-filter-chip',
  standalone: true,
  templateUrl: './filter-chip.component.html',
  styleUrl: './filter-chip.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-selected]': 'selected()',
  },
})
export class FilterChipComponent {
  readonly label = input.required<string>();
  readonly selected = input.required<boolean>();
  readonly activate = output<void>();
}
