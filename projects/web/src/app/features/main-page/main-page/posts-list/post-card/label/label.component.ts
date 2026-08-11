import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'web-label',
  standalone: true,
  templateUrl: './label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent {
  readonly text = input.required<string>();
  readonly color = input.required<string>();
}
