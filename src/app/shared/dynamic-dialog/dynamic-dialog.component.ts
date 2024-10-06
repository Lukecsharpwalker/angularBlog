import { ChangeDetectionStrategy, Component, ComponentRef, Input, OnInit, Type, ViewContainerRef, inject, viewChild } from '@angular/core';
import { DynamicDialogService } from './dynamic-dialog.service';
import { ModalConfig } from '../_models/modal-config.intreface';
import { ModalCloseStatusEnum, ModalStatus } from '../_models/modal-status.interface';

@Component({
  selector: 'app-dynamic-dialog',
  standalone: true,
  imports: [],
  providers: [],
  templateUrl: './dynamic-dialog.component.html',
  styleUrl: './dynamic-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicDialogComponent<C = unknown> implements OnInit{
  @Input() component?: Type<C>;
  @Input() modalConfig?: ModalConfig;

  divEl = viewChild.required('dynamicComponentContainer', {read: ViewContainerRef});

  dynamicDialogService = inject(DynamicDialogService);
  viewContainerRef = inject(ViewContainerRef);
  componentRef?: ComponentRef<C>;
  ModalCloseStatusEnum = ModalCloseStatusEnum;

  ngOnInit(): void {
    if (this.divEl() && this.component) {
      this.componentRef = this.divEl().createComponent(this.component);
    }
  }

  closeDialog(modalCloseStatus: ModalCloseStatusEnum) {
    // console.log((this.componentRef?.instance.form));
    let test = this.componentRef?.instance as C;
    const status = {} as ModalStatus;
    status.closeStatus = modalCloseStatus;
    if (status.closeStatus === ModalCloseStatusEnum.ACCEPTED
      // && this.hasForm(this.componentRef!.instance)) {
      && this.hasForm()) {
      console.log((this.componentRef?.instance));
      console.log(this.componentRef);
    }
    this.dynamicDialogService.closeDialog(status);
  }
  hasForm() {
    return true;
  }
  // hasForm(instance: unknown): instance is HasForm {
  //   return (instance as HasForm).form !== undefined;
  // }
}
