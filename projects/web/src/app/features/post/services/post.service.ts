import { Injectable, ViewContainerRef, DestroyRef, afterNextRender } from '@angular/core';
import { DynamicDialogService } from 'shared';
import { CodeBlockModalComponent } from '../components/details/code-block-modal-component/code-block-modal-component.component';

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
          const preElements = document.querySelectorAll('pre:not(.modal-code-block)');

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

    const isOneLiner =
      !element.textContent?.includes('\n') || element.textContent?.trim().split('\n').length === 1;

    if (isOneLiner) {
      element.classList.add('inline-block', 'px-2', 'py-1', 'text-sm');
      element.style.display = 'inline-block';
      element.style.margin = '0 2px';
    } else {
      element.classList.add('block', 'my-4');
    }
  }

  private showCodeModal(
    event: Event,
    dialogService: DynamicDialogService<CodeBlockModalComponent>,
    viewContainerRef: ViewContainerRef
  ): void {
    const preElement = event.currentTarget as HTMLElement;
    const codeElement = preElement.querySelector('code');
    const code = codeElement?.innerHTML || '';

    let language = 'code';
    if (codeElement) {
      const languageClass = Array.from(codeElement.classList).find(
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
        content: '',
        primaryButton: 'Close',
        data: {
          code,
          language,
        },
      },
      CodeBlockModalComponent
    );
  }

  private formatLanguageForDisplay(language: string): string {
    const languageMap: Record<string, string> = {
      js: 'JavaScript',
      ts: 'TypeScript',
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      html: 'HTML',
      css: 'CSS',
      scss: 'SCSS',
      json: 'JSON',
      xml: 'XML',
      bash: 'Bash',
      sh: 'Shell',
      cmd: 'Command',
      powershell: 'PowerShell',
      sql: 'SQL',
      python: 'Python',
      py: 'Python',
      java: 'Java',
      c: 'C',
      cpp: 'C++',
      csharp: 'C#',
      php: 'PHP',
      ruby: 'Ruby',
      go: 'Go',
      rust: 'Rust',
      swift: 'Swift',
      kotlin: 'Kotlin',
      dart: 'Dart',
      yaml: 'YAML',
      yml: 'YAML',
      markdown: 'Markdown',
      md: 'Markdown',
      text: 'Plain Text',
      code: 'Code',
    };

    return (
      languageMap[language.toLowerCase()] || language.charAt(0).toUpperCase() + language.slice(1)
    );
  }
}