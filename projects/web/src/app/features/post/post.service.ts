import { Injectable, afterNextRender } from '@angular/core';

@Injectable()
export class PostService {
  private processedNodes = new Set<HTMLElement>();

  initializeCodeBlockHandling(): void {
    afterNextRender(() => {
      this.processCodeBlocks();
    });
  }

  private processCodeBlocks(): void {
    const preElements = document.querySelectorAll<HTMLElement>('pre:not(.modal-code-block)');

    preElements.forEach(preElement => {
      if (!this.processedNodes.has(preElement)) {
        this.processedNodes.add(preElement);
        this.styleCodeBlock(preElement);
      }
    });
  }

  private styleCodeBlock(element: HTMLElement): void {
    element.classList.add('cursor-pointer', 'hover:opacity-80', 'transition-opacity');
  }
}
