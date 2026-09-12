import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PageScrollService {
  private readonly document = inject(DOCUMENT);

  private scrollBlocked = false;
  private previousHtmlStyles = { left: '', top: '' };
  private previousScroll = { left: 0, top: 0 };

  /** Blocks page-level scroll while the dialog is open. */
  blockPageScroll(): void {
    const root = this.document.documentElement;
    if (this.scrollBlocked || !this.isScrollable(root)) {
      return;
    }

    this.previousScroll = { left: root.scrollLeft, top: root.scrollTop };
    // Cache the previous inline styles in case the user had set them.
    this.previousHtmlStyles = { left: root.style.left, top: root.style.top };

    // Note: we're using the `html` node, instead of the `body`, because the `body` may
    // have the user agent margin, whereas the `html` is guaranteed not to have one.
    root.style.left = `-${this.previousScroll.left}px`;
    root.style.top = `-${this.previousScroll.top}px`;
    // eslint-disable-next-line no-restricted-syntax
    root.classList.add('page-scroll-blocked');
    this.scrollBlocked = true;
  }

  /** Unblocks page-level scroll once the dialog is closed. */
  releasePageScroll(): void {
    if (!this.scrollBlocked) {
      return;
    }

    const root = this.document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    this.scrollBlocked = false;
    root.style.left = this.previousHtmlStyles.left;
    root.style.top = this.previousHtmlStyles.top;
    // eslint-disable-next-line no-restricted-syntax
    root.classList.remove('page-scroll-blocked');

    // Disable user-defined smooth scrolling temporarily while we restore the scroll position.
    // See https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior
    root.style.scrollBehavior = 'auto';
    root.scrollTo(this.previousScroll.left, this.previousScroll.top);
    root.style.scrollBehavior = previousScrollBehavior;
  }

  private isScrollable(root: HTMLElement): boolean {
    return root.scrollHeight > root.clientHeight || root.scrollWidth > root.clientWidth;
  }
}
