import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DynamicDialogService, ModalCloseStatusEnum } from '@shared/pattern/dynamic-dialog';
import { TableOfContentsComponent } from './table-of-contents.component';

@Component({
  selector: 'web-table-of-contents-dialog',
  standalone: true,
  imports: [TableOfContentsComponent],
  templateUrl: './table-of-contents-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full min-h-0' },
})
export class TableOfContentsDialogComponent {
  private readonly dynamicDialogService = inject(DynamicDialogService<string>);

  protected closeWithSection(sectionId: string): void {
    this.dynamicDialogService.closeDialog({
      closeStatus: ModalCloseStatusEnum.ACCEPTED,
      data: sectionId,
    });
  }
}
