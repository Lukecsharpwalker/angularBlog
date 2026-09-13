import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { IconComponent } from '@shared/pattern/icon-system';
import {
  DYNAMIC_DIALOG_DATA,
  DynamicDialogService,
  ModalCloseStatusEnum,
} from '@shared/pattern/dynamic-dialog';
import { CodeBlockModalData } from './code-block-modal.interface';

@Component({
  selector: 'web-code-block-modal',
  templateUrl: './code-block-modal.component.html',
  styleUrl: './code-block-modal.component.css',
  host: { class: 'block size-full' },
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [IconComponent],
})
export class CodeBlockModalComponent {
  protected data = inject<CodeBlockModalData>(DYNAMIC_DIALOG_DATA, {
    optional: true,
  });

  private readonly dialogService = inject(DynamicDialogService);

  protected close(): void {
    this.dialogService.closeDialog({ closeStatus: ModalCloseStatusEnum.CLOSED });
  }
}
