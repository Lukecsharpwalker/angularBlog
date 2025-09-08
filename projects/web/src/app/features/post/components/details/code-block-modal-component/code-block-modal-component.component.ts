import { Component, inject } from '@angular/core';
import { DYNAMIC_DIALOG_DATA } from 'shared';

@Component({
  selector: 'web-code-block-modal',
  standalone: true,
  template: `
    <div class="code-modal-container">
      <pre [class]="'language-' + data.language + ' ' + 'hljs'" class="code-block modal-code-block">
        <code [innerHTML]="data.code"></code>
      </pre>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .code-modal-container {
        width: 100%;
        height: 100%;
        max-height: 60vh;
        max-width: 80vw;
        overflow: auto;
        padding: 0;
        position: relative;
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
        background: #1a1a1a !important;
        color: #f8f8f2 !important;
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        text-align: left;
      }

      .code-block code {
        display: block;
        text-indent: 0 !important;
        margin-left: 0 !important;
        padding-left: 0 !important;
      }

      .code-block code * {
        text-indent: 0 !important;
        margin-left: 0 !important;
        padding-left: 0 !important;
      }

      .modal-code-block {
        cursor: default !important;
        pointer-events: none;
      }

      .modal-code-block * {
        pointer-events: none;
      }

      .code-block::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .code-block::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }

      .code-block::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
      }

      .code-block::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.5);
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .code-modal-container {
          max-height: 70vh;
          max-width: 90vw;
        }

        .code-block {
          font-size: 0.9rem;
          padding: 1rem;
          line-height: 1.4;
        }
      }

      /* For very small screens */
      @media (max-width: 480px) {
        .code-modal-container {
          max-height: 80vh;
          max-width: 95vw;
        }

        .code-block {
          font-size: 0.85rem;
          padding: 0.75rem;
        }
      }
    `,
  ],
})
export class CodeBlockModalComponent {
  data: CodeBlockModalData = inject(DYNAMIC_DIALOG_DATA, {
    optional: true,
  }) as CodeBlockModalData;
}

interface CodeBlockModalData {
  code: string;
  language: string;
}
