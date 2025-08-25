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
} from '@angular/core';
import { DynamicDialogService } from './dynamic-dialog.service';
import { 
  ModalConfig, 
  ModalCloseStatusEnum, 
  ModalStatus 
} from '../../models';

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

  closeDialog(
    modalCloseStatus: ModalCloseStatusEnum = ModalCloseStatusEnum.CLOSED,
  ) {
    const status = {
      data: this.componentRef?.instance,
      closeStatus: modalCloseStatus,
    } as ModalStatus;

    this.dynamicDialogService.closeDialog(status);
  }

  onOverlayClick() {
    // Handle overlay click if needed
  }

  private createDynamicComponent(): void {
    if (this.divEl() && this.component()) {
      this.componentRef = this.divEl().createComponent(this.component()!);
    }
  }
}
