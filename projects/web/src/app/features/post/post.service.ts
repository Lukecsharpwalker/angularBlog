import { Injectable, ViewContainerRef, DestroyRef, afterNextRender } from '@angular/core';
import hljs from 'highlight.js';
import { DynamicDialogService } from '@shared/pattern/dynamic-dialog';
import { CodeBlockModalComponent } from './post/code-block-modal/code-block-modal.component';

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
