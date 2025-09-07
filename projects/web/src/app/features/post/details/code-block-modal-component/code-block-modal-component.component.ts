import { Component, inject } from '@angular/core';
import { DYNAMIC_DIALOG_DATA } from 'shared';

@Component({
  selector: 'web-code-block-modal',
  standalone: true,
  template: `
    <div class="code-modal-container" [class.large-code]="data.isLargeCode">
      <pre [class]="'language-' + data.language + ' ' + 'hljs'" class="code-block" 
           [class.large-code-block]="data.isLargeCode">
        <code [innerHTML]="data.code"></code>
      </pre>
      @if (data.isLargeCode) {
        <div class="code-info">
          <small class="text-gray-500">{{ data.lineCount }} lines</small>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        /* Force parent dialog to expand for large code */
        min-width: var(--code-modal-min-width, 320px);
        min-height: var(--code-modal-min-height, 200px);
      }

      .code-modal-container {
        width: 100%;
        height: 100%;
        max-height: 70vh;
        overflow: auto;
        padding: 0;
        position: relative;
      }

      .code-modal-container.large-code {
        max-height: 85vh;
        /* For large code, expand to almost full screen */
        width: calc(100vw - 4rem);
        max-width: 90vw;
        min-height: 60vh;
      }

      .code-block {
        margin: 0;
        padding: 1.5rem;
        border-radius: 0.75rem;
        font-size: 0.95rem;
        line-height: 1.5;
        width: 100%;
        min-height: 100%;
        box-sizing: border-box;
        overflow-x: auto;
        overflow-y: visible;
        white-space: pre;
        word-wrap: normal;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        /* Better scrollbars */
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
      }

      .code-block.large-code-block {
        font-size: 0.9rem;
        line-height: 1.4;
        padding: 2rem;
      }

      /* Custom scrollbar for code blocks */
      .code-block::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .code-block::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }

      .code-block::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
      }

      .code-block::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.5);
      }

      .code-info {
        position: absolute;
        bottom: 0.5rem;
        left: 1rem;
        background: rgba(255, 255, 255, 0.9);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .code-block {
          font-size: 1rem;
          padding: 1rem;
          line-height: 1.4;
        }
        
        .code-modal-container {
          max-height: 80vh;
        }

        .code-modal-container.large-code {
          width: calc(100vw - 2rem);
          max-width: 95vw;
          max-height: 90vh;
        }

        .code-block.large-code-block {
          font-size: 0.95rem;
          padding: 1.5rem;
        }
      }

      /* For very small screens */
      @media (max-width: 480px) {
        .code-block {
          font-size: 0.9rem;
          padding: 0.75rem;
        }

        .code-modal-container.large-code {
          width: calc(100vw - 1rem);
          max-width: 98vw;
          max-height: 95vh;
        }

        .code-block.large-code-block {
          font-size: 0.85rem;
          padding: 1rem;
        }
      }
    `,
  ],
})
export class CodeBlockModalComponent {
  public data: CodeBlockModalData = inject(DYNAMIC_DIALOG_DATA, {
    optional: true,
  }) as CodeBlockModalData;
}

interface CodeBlockModalData {
  code: string;
  language: string;
  isLargeCode?: boolean;
  lineCount?: number;
}
