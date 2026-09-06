import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '@shared/pattern/icon-system';
import { ObserveDockedDirective } from './observe-docked.directive';

@Component({
  selector: 'web-post-mobile-toolbar',
  standalone: true,
  imports: [RouterLink, IconComponent],
  hostDirectives: [ObserveDockedDirective],
  templateUrl: './post-mobile-toolbar.component.html',
  styleUrl: './post-mobile-toolbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'md:hidden sticky top-0 z-20 -mx-4 mb-3 flex items-center px-4 py-3',
  },
})
export class PostMobileToolbarComponent {
  readonly hasContents = input.required<boolean>();

  readonly contentsRequested = output<void>();
}
