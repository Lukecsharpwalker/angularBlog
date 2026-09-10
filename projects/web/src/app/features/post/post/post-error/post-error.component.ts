import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '@shared/pattern/icon-system';

@Component({
  selector: 'web-post-error',
  standalone: true,
  templateUrl: './post-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class PostErrorComponent {
  readonly error = input.required<string | null>();
  readonly retryRequested = output<void>();
  readonly backRequested = output<void>();
}
