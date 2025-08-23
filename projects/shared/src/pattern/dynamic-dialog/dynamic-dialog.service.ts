import {
  Injectable,
  EnvironmentInjector,
  inject,
  ComponentRef,
  Type,
  Injector,
} from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { DynamicDialogComponent } from './dynamic-dialog.component';
import { ModalConfig, ModalStatus } from '../../models';
import { DYNAMIC_DIALOG_DATA } from './dialog-data.token';

@Injectable({ providedIn: 'root' })
export class DynamicDialogService<T> {
  private envInjector = inject(EnvironmentInjector);
  private componentRef!: ComponentRef<DynamicDialogComponent>;
  private closeRef$ = new Subject<ModalStatus<T>>();
  private injector = inject(Injector);

  openDialog<C>(
    viewContainerRef: ViewContainerRef,
    modalConfig?: ModalConfig,
    component?: Type<C>
  ): Subject<ModalStatus<T>> {
    const dialogInjector = Injector.create({
      providers: [{ provide: DYNAMIC_DIALOG_DATA, useValue: modalConfig?.data }],
      parent: this.injector,
    });

    this.componentRef = viewContainerRef.createComponent(DynamicDialogComponent, {
      environmentInjector: this.envInjector,
      injector: dialogInjector,
    });
    if (component) {
      this.componentRef.setInput('component', component);
    }
    if (modalConfig) {
      this.componentRef.setInput('modalConfig', modalConfig);
    }
    return this.closeRef$;
  }

  closeDialog(status: ModalStatus<T>) {
    this.componentRef.destroy();
    this.closeRef$.next(status);
  }
}
