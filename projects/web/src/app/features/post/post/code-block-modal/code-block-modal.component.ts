import { Component, inject } from '@angular/core';
import { DYNAMIC_DIALOG_DATA } from '@shared/pattern/dynamic-dialog';
import { CodeBlockModalData } from './code-block-modal.interface';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'web-code-block-modal',
  templateUrl: './code-block-modal.component.html',
  styleUrl: './code-block-modal.component.scss',
  imports: [],
})
export class CodeBlockModalComponent {
  protected data = inject<CodeBlockModalData>(DYNAMIC_DIALOG_DATA, {
    optional: true,
  });
}
