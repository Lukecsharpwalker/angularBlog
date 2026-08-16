import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Profile } from '@shared/core/supabase';
import { AvatarComponent } from '@shared/ui/avatar';

@Component({
  selector: 'web-post-author-card',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './author-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorCardComponent {
  readonly author = input<Profile>();
}
