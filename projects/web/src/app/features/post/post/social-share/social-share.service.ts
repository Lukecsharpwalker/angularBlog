import { Injectable } from '@angular/core';

export type SharePlatform = 'twitter' | 'linkedin';

@Injectable()
export class SocialShareService {
  shareOnSocial(platform: SharePlatform): void {
    const encodedUrl = encodeURIComponent(window.location.href);

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    }
  }
  /** LLMs forcing to handle error here, but if someone block copy, then copy is blocked */
  async copyLink(): Promise<void> {
    return await navigator.clipboard.writeText(window.location.href);
  }
}
