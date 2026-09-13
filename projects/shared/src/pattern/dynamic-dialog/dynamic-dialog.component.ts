import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  inject,
  input,
  OnInit,
  Type,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { DialogShellComponent } from './dialog-shell/dialog-shell.component';
import { DynamicDialogService } from './dynamic-dialog.service';
import { ModalConfig } from './modal-config';
import { ModalCloseStatusEnum, ModalStatus } from './modal-status';

@Component({
  selector: 'shared-dynamic-dialog',
  standalone: true,
  templateUrl: './dynamic-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogShellComponent],
})
export class DynamicDialogComponent<C = unknown> implements OnInit {
  readonly component = input<Type<C>>();
  readonly modalConfig = input.required<ModalConfig>();

  protected readonly ModalCloseStatusEnum = ModalCloseStatusEnum;

  private readonly contentContainer = viewChild.required('dynamicComponentContainer', {
    read: ViewContainerRef,
  });
  private readonly dynamicDialogService = inject(DynamicDialogService);
  private componentRef?: ComponentRef<C>;

  ngOnInit(): void {
    const component = this.component();
    if (component) {
      this.componentRef = this.contentContainer().createComponent(component);
    }
  }

  closeDialog(modalCloseStatus: ModalCloseStatusEnum = ModalCloseStatusEnum.CLOSED): void {
    const status: ModalStatus = {
      data: this.componentRef?.instance,
      closeStatus: modalCloseStatus,
    };

    this.dynamicDialogService.closeDialog(status);
  }
}
