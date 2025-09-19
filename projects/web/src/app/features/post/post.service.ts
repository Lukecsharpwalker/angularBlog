import { Injectable, ViewContainerRef, DestroyRef, afterNextRender } from '@angular/core';
import { DynamicDialogService } from '@shared/pattern/dynamic-dialog';
import { CodeBlockModalComponent } from './post/code-block-modal/code-block-modal.component';

@Injectable()
export class PostService {
  private processedNodes = new Set<Node>();
  private observer?: MutationObserver;

  initializeCodeBlockHandling(
    dialogService: DynamicDialogService<CodeBlockModalComponent>,
    viewContainerRef: ViewContainerRef,
    destroyRef: DestroyRef
  ): void {
    afterNextRender(() => {
      setTimeout(() => {
        const processCodeBlocks = (): void => {
          const preElements: NodeListOf<Element> = document.querySelectorAll(
            'pre:not(.modal-code-block)'
          );

          preElements.forEach(preElement => {
            if (!this.processedNodes.has(preElement) && preElement instanceof HTMLElement) {
              this.processedNodes.add(preElement);
              this.styleCodeBlock(preElement);
              preElement.addEventListener('click', e =>
                this.showCodeModal(e, dialogService, viewContainerRef)
              );
            }
          });
        };

        processCodeBlocks();

        this.observer = new MutationObserver(() => {
          processCodeBlocks();
        });

        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        destroyRef.onDestroy(() => {
          this.observer?.disconnect();
          this.processedNodes.clear();
        });
      }, 100);
    });
  }

  private styleCodeBlock(element: HTMLElement): void {
    element.classList.add('cursor-pointer', 'hover:opacity-80', 'transition-opacity');
  }

  private showCodeModal(
    event: Event,
    dialogService: DynamicDialogService<CodeBlockModalComponent>,
    viewContainerRef: ViewContainerRef
  ): void {
    const preElement = event.currentTarget as HTMLElement;
    const codeElement: HTMLElement | null = preElement.querySelector('code');
    const code = codeElement?.innerHTML || '';

    let language = 'code';
    if (codeElement) {
      const languageClass: string | undefined = Array.from(codeElement.classList).find(
        cls => cls.startsWith('language-') || cls.startsWith('hljs-')
      );
      if (languageClass) {
        language = languageClass.replace('language-', '').replace('hljs-', '');
      }
    }

    dialogService.openDialog(
      viewContainerRef,
      {
        title: `Code`,
        primaryButton: 'Close',
        data: {
          code,
          language,
        },
      },
      CodeBlockModalComponent
    );
  }
}
