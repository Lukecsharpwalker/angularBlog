import { Directive, HostListener, inject, ViewContainerRef } from '@angular/core';
import { DynamicDialogService } from '@shared/pattern/dynamic-dialog';
import { CodeBlockModalComponent } from './code-block-modal/code-block-modal.component';

@Directive({
  selector: '[webOpenCodeBlockModal]',
  standalone: true,
})
export class OpenCodeBlockModalDirective {
  private dialogService = inject(DynamicDialogService);
  private viewContainerRef = inject(ViewContainerRef);

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const preElement = target.closest('pre');
    if (!preElement) {
      return;
    }

    const codeElement = preElement.querySelector<HTMLElement>('code');
    if (!codeElement) {
      return;
    }

    const code = codeElement.innerHTML || preElement.innerHTML;
    const language = preElement.getAttribute('data-language') ?? '';

    this.dialogService.openDialog(
      this.viewContainerRef,
      {
        title: 'Code',
        variant: 'immersive',
        primaryButton: 'Close',
        data: { code, language },
      },
      CodeBlockModalComponent
    );
  }
}
