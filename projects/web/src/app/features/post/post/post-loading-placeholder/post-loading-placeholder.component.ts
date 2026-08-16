import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'web-post-loading-placeholder',
  standalone: true,
  templateUrl: './post-loading-placeholder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostLoadingPlaceholderComponent {
  protected readonly tags = [0, 1, 2];
  protected readonly lines = [0, 1, 2, 3, 4, 5, 6, 7];
  protected readonly tocItems = [0, 1, 2];
  protected readonly shareButtons = [0, 1, 2];
}
