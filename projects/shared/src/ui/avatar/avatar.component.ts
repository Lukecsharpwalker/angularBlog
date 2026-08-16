import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';

export type AvatarSize = 'sm' | 'md' | 'lg';
export type AvatarType = 'rounded' | 'square-rounded';

@Component({
  selector: 'shared-avatar',
  standalone: true,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css',
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-type]': 'type()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  readonly name = input<string | null | undefined>();
  readonly imageUrl = input<string | null | undefined>();
  readonly size = input<AvatarSize>('md');
  readonly type = input<AvatarType>('rounded');

  protected readonly displayImageUrl = linkedSignal(() => this.imageUrl()?.trim() || null);

  protected readonly initials = computed(() =>
    (this.name() ?? '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('')
  );

  protected showInitials(): void {
    this.displayImageUrl.set(null);
  }
}
