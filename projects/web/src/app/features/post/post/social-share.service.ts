import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocialShareService {

  shareOnSocial(platform: 'twitter' | 'linkedin', title: string, url?: string): void {
    const currentUrl = url || window.location.href;
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

  async copyLink(url?: string): Promise<boolean> {
    const linkToCopy = url || window.location.href;

    try {
      await navigator.clipboard.writeText(linkToCopy);
      return true;
    } catch (error) {
      console.error('Failed to copy link:', error);
      return this.fallbackCopyLink(linkToCopy);
    }
  }

  private fallbackCopyLink(text: string): boolean {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (error) {
      console.error('Fallback copy failed:', error);
      return false;
    }
  }
}
