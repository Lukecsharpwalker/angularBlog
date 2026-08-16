import { Injectable } from '@angular/core';

@Injectable()
export class SocialShareService {
  shareOnSocial(platform: 'twitter' | 'linkedin', title: string): void {
    const currentUrl = window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl);
    const text = encodeURIComponent(`Check out this article: "${title}"`);

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`;
        break;
      case 'linkedin':
        shareUrl = `https://linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    }
  }

  async copyLink(): Promise<void> {
    const linkToCopy = window.location.href;

    //TODO: test error, how it behave on error
    return await navigator.clipboard.writeText(linkToCopy);
  }
}
