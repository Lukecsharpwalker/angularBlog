import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { IconComponent } from '@shared/pattern/icon-system';
import { SharePlatform, SocialShareService } from './social-share.service';

@Component({
  selector: 'web-social-share',
  standalone: true,
  imports: [IconComponent, NgTemplateOutlet],
  providers: [SocialShareService],
  templateUrl: './social-share.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class SocialShareComponent {
  protected readonly shareMenuOpen = signal(false);

  private readonly socialShare = inject(SocialShareService);

  protected toggleShareMenu(): void {
    this.shareMenuOpen.update(open => !open);
  }

  protected shareOn(platform: SharePlatform): void {
    this.socialShare.shareOnSocial(platform);
    this.shareMenuOpen.set(false);
  }

  protected copyLink(): void {
    void this.socialShare.copyLink();
    this.shareMenuOpen.set(false);
  }
}
