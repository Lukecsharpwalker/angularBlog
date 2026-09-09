import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { IconComponent } from '@shared/pattern/icon-system';
import { SharePlatform, SocialShareService } from './social-share.service';

@Component({
  selector: 'web-social-share',
  standalone: true,
  imports: [IconComponent],
  providers: [SocialShareService],
  templateUrl: './social-share.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class SocialShareComponent {
  protected readonly shared = output<void>();

  private readonly socialShare = inject(SocialShareService);

  protected shareOn(platform: SharePlatform): void {
    this.socialShare.shareOnSocial(platform);
    this.shared.emit();
  }

  protected copyLink(): void {
    void this.socialShare.copyLink();
    this.shared.emit();
  }
}
