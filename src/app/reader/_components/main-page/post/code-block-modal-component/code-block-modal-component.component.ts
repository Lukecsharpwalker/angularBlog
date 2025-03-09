import { Component, inject, OnInit } from '@angular/core';
import { DYNAMIC_DIALOG_DATA } from '../../../../../shared/dynamic-dialog/dialog-data.token';

@Component({
  selector: 'app-code-block-modal',
  standalone: true,
  template: ` <pre
    [class]="data.language"
  ><code [innerHTML]="data.code"></code></pre>`,
  styles: [
    `
      pre {
        margin: 0;
        padding: 1rem;
        border-radius: 0.5rem;
      }
    `,
  ],
})
export class CodeBlockModalComponent implements OnInit {
  public data: CodeBlockModalData = inject(DYNAMIC_DIALOG_DATA, {
    optional: true,
  }) as CodeBlockModalData;

  ngOnInit(): void {
    console.log(this.data);
  }
}

interface CodeBlockModalData {
  code: string;
  language: string;
}
