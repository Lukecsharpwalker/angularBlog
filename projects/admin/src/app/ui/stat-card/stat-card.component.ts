import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type StatHintTone = 'positive' | 'neutral' | 'accent' | 'danger';

@Component({
  selector: 'admin-stat-card',
  standalone: true,
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly hint = input<string>('');
  readonly hintTone = input<StatHintTone>('neutral');
}
