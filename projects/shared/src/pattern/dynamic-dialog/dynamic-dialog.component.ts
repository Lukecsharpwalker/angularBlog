import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  OnInit,
  Type,
  ViewContainerRef,
  inject,
  input,
  viewChild,
  HostListener,
} from '@angular/core';
import { DynamicDialogService } from './dynamic-dialog.service';
import { ModalConfig } from './modal-config';
import { ModalCloseStatusEnum, ModalStatus } from './modal-status';

@Component({
  selector: 'shared-dynamic-dialog',
  standalone: true,
  imports: [],
  providers: [],
  templateUrl: './dynamic-dialog.component.html',
  styleUrl: './dynamic-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicDialogComponent<C = unknown> implements OnInit {
  readonly component = input<Type<C>>();
  readonly modalConfig = input<ModalConfig>();

  readonly divEl = viewChild.required('dynamicComponentContainer', {
    read: ViewContainerRef,
  });

  dynamicDialogService = inject(DynamicDialogService);
  componentRef?: ComponentRef<C>;
  ModalCloseStatusEnum = ModalCloseStatusEnum;

  ngOnInit(): void {
    this.createDynamicComponent();
  }

  @HostListener('document:keydown', ['$event'])
  handleEscapeKey(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeDialog();
    }
  }

  closeDialog(modalCloseStatus: ModalCloseStatusEnum = ModalCloseStatusEnum.CLOSED) {
    const status = {
      data: this.componentRef?.instance,
      closeStatus: modalCloseStatus,
    } as ModalStatus;

    this.dynamicDialogService.closeDialog(status);
  }

  onOverlayClick() {
    this.closeDialog();
  }

  private createDynamicComponent(): void {
    if (this.divEl() && this.component()) {
      this.componentRef = this.divEl().createComponent(this.component()!);
    }
  }
}
