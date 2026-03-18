import { Injectable, ViewContainerRef, DestroyRef, afterNextRender } from '@angular/core';
import hljs from 'highlight.js';
import { DynamicDialogService } from '@shared/pattern/dynamic-dialog';
import { CodeBlockModalComponent } from './post/code-block-modal/code-block-modal.component';

@Injectable()
export class PostService {
  private processedNodes = new Set<HTMLElement>();
  private observer?: MutationObserver;
  private dialogService?: DynamicDialogService<CodeBlockModalComponent>;
  private viewContainerRef?: ViewContainerRef;

  initializeCodeBlockHandling(
    dialogService: DynamicDialogService<CodeBlockModalComponent>,
    viewContainerRef: ViewContainerRef,
    destroyRef: DestroyRef
  ): void {
    this.dialogService = dialogService;
    this.viewContainerRef = viewContainerRef;

    afterNextRender(() => {
      this.processCodeBlocks();

      this.observer = new MutationObserver(() => this.processCodeBlocks());

      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      destroyRef.onDestroy(() => {
        this.observer?.disconnect();
        this.processedNodes.clear();
      });
    });
  }

  private processCodeBlocks(): void {
    const preElements = document.querySelectorAll<HTMLElement>('pre:not(.modal-code-block)');

    preElements.forEach(preElement => {
      if (!this.processedNodes.has(preElement)) {
        this.processedNodes.add(preElement);
        this.styleCodeBlock(preElement);
        this.attachClickHandler(preElement);
      }
    });
  }

  private styleCodeBlock(element: HTMLElement): void {
    element.classList.add('cursor-pointer', 'hover:opacity-80', 'transition-opacity');

    const codeElement = element.querySelector<HTMLElement>('code');
    if (codeElement) {
      hljs.highlightElement(codeElement);
    }
  }

  private attachClickHandler(preElement: HTMLElement): void {
    preElement.addEventListener('click', () => this.showCodeModal(preElement));
  }

  private showCodeModal(preElement: HTMLElement): void {
    if (!this.dialogService || !this.viewContainerRef) {
      return;
    }

    const codeElement = preElement.querySelector<HTMLElement>('code');
    const code = codeElement?.innerHTML || '';
    const language = this.extractLanguage(codeElement);

    this.dialogService.openDialog(
      this.viewContainerRef,
      {
        title: 'Code',
        primaryButton: 'Close',
        data: { code, language },
      },
      CodeBlockModalComponent
    );
  }

  private extractLanguage(codeElement: HTMLElement | null): string {
    if (!codeElement) {
      return 'code';
    }

    const languageClass = Array.from(codeElement.classList).find(
      cls => cls.startsWith('language-') || cls.startsWith('hljs-')
    );

    return languageClass
      ? languageClass.replace('language-', '').replace('hljs-', '')
      : 'code';
  }
}
