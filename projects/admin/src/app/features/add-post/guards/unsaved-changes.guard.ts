import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { map, of } from 'rxjs';
import { ModalCloseStatusEnum } from 'shared';
import { DynamicDialogService } from 'shared';
import { AddPostComponent } from '../add-post.component';

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
          return status.closeStatus === ModalCloseStatusEnum.ACCEPTED;
        })
      );
  } else {
    return of(true);
  }
};
