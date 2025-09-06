import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { map, of } from 'rxjs';
import { ModalCloseStatusEnum } from 'shared';
import { DynamicDialogService } from 'shared';
import { AddPostComponent } from '../add-post.component';
import { MODAL_CONFIG_DEFAULTS } from '../constants/add-post.constants';

export const unsavedChangesGuard: CanDeactivateFn<AddPostComponent> = (
  component: AddPostComponent
) => {
  const dynamicDialogService = inject(DynamicDialogService);
  if (component.blogForm.dirty) {
    return dynamicDialogService
      .openDialog(component.viewContainerRef, MODAL_CONFIG_DEFAULTS.UNSAVED_CHANGES)
      .pipe(
        map(status => {
          return status.closeStatus === ModalCloseStatusEnum.ACCEPTED;
        })
      );
  } else {
    return of(true);
  }
};
