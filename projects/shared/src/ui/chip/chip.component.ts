import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ChipVariant = 'tint' | 'outline';

@Component({
  selector: 'shared-chip',
  standalone: true,
  templateUrl: './chip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
  readonly text = input.required<string>();
  readonly color = input.required<string>();
  readonly variant = input<ChipVariant>('tint');
}
