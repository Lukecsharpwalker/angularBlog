import { CanDeactivateFn } from '@angular/router';
import { DynamicDialogService } from 'shared';
import { inject } from '@angular/core';
import { ModalCloseStatusEnum } from 'shared';
import { map, of } from 'rxjs';
import { AddPostComponent } from '../../features/add-post/add-post.component';

export const unsavedChangesGuard: CanDeactivateFn<AddPostComponent> = (
  component: AddPostComponent
) => {
  const dynamicDialogService = inject(DynamicDialogService);
  if (component.blogForm.dirty) {
    return dynamicDialogService
      .openDialog(component.viewContainerRef, {
        primaryButton: 'Yes',
        secondaryButton: 'No',
        title: 'You have unsaved changes',
        content: 'Are you sure you want to leave this page?',
      })
      .pipe(
        map(status => {
          if (status.closeStatus === ModalCloseStatusEnum.ACCEPTED) {
            return true;
          } else {
            return false;
          }
        })
      );
  } else {
    return of(true);
  }
};
