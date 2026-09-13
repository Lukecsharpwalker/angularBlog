import { ComponentRef, inject, Injectable, Injector, Type, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { DynamicDialogComponent } from './dynamic-dialog.component';
import { ModalConfig } from './modal-config';
import { ModalStatus } from './modal-status';
import { DYNAMIC_DIALOG_DATA } from './dialog-data.token';
import { PageScrollService } from './page-scroll.service';

@Injectable({ providedIn: 'root' })
export class DynamicDialogService<T> {
  private readonly pageScrollService = inject(PageScrollService);

  private componentRef?: ComponentRef<DynamicDialogComponent>;
  private closeRef$ = new Subject<ModalStatus<T>>();

  //TODO: For now need to use with take(1) to avoid memory leak. Need to find a better way to handle this. By service?
  openDialog<C>(
    viewContainerRef: ViewContainerRef,
    modalConfig: ModalConfig,
    component?: Type<C>
  ): Subject<ModalStatus<T>> {
    if (this.componentRef) {
      return this.closeRef$;
    }

    const dialogInjector = Injector.create({
      providers: [{ provide: DYNAMIC_DIALOG_DATA, useValue: modalConfig.data }],
      parent: viewContainerRef.injector,
    });

    this.componentRef = viewContainerRef.createComponent(DynamicDialogComponent, {
      injector: dialogInjector,
    });

    this.componentRef.setInput('component', component);
    this.componentRef.setInput('modalConfig', modalConfig);

    this.pageScrollService.blockPageScroll();
    this.componentRef.onDestroy(() => this.pageScrollService.releasePageScroll());

    return this.closeRef$;
  }

  closeDialog(status: ModalStatus<T>) {
    this.componentRef?.destroy();
    this.componentRef = undefined;
    this.closeRef$.next(status);
  }
}
