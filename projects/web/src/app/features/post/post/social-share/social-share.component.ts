import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { IconComponent } from '@shared/pattern/icon-system';
import { SocialShareService } from './social-share.service';

@Component({
  selector: 'web-social-share',
  standalone: true,
  imports: [IconComponent],
  providers: [SocialShareService],
  templateUrl: './social-share.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialShareComponent {
  readonly title = input.required<string>();

  private readonly socialShareService = inject(SocialShareService);

  protected shareOnSocial(platform: 'twitter' | 'linkedin'): void {
    this.socialShareService.shareOnSocial(platform, this.title());
  }

  protected async copyLink(): Promise<void> {
    await this.socialShareService.copyLink();
  }
}
