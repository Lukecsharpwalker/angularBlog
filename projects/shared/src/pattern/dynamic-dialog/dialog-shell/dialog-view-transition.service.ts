import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable } from '@angular/core';

@Injectable()
export class DialogViewTransitionService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  run(dialog: HTMLDialogElement, source: HTMLElement | undefined, update: () => void): void {
    const target = dialog.querySelector<HTMLElement>('[data-dialog-transition]');
    if (!source || !target || !this.isSupported()) {
      update();
      return;
    }

    const restoreNames = this.preserveTransitionNames(source, target);
    this.markTransitionStarted(dialog);
    this.claimSharedName(source);

    const transition = this.document.startViewTransition(() => {
      restoreNames();
      this.claimSharedName(target);
      update();
    });

    this.skipOnDestroy(transition);
    this.cleanUpWhenDone(transition, dialog, restoreNames);
  }

  private isSupported(): boolean {
    return (
      !!this.document.startViewTransition &&
      !!this.document.defaultView?.matchMedia(
        '(width < 48rem) and (prefers-reduced-motion: no-preference)'
      ).matches
    );
  }

  private preserveTransitionNames(source: HTMLElement, target: HTMLElement): () => void {
    const sourceName = source.style.viewTransitionName;
    const targetName = target.style.viewTransitionName;
    return () => {
      source.style.viewTransitionName = sourceName;
      target.style.viewTransitionName = targetName;
    };
  }

  private markTransitionStarted(dialog: HTMLDialogElement): void {
    this.document.documentElement.dataset['dialogTransition'] = '';
    dialog.dataset['viewTransition'] = '';
  }

  private claimSharedName(element: HTMLElement): void {
    element.style.viewTransitionName = 'dialog-content';
  }

  private skipOnDestroy(transition: ViewTransition): void {
    this.destroyRef.onDestroy(() => transition.skipTransition());
  }

  private cleanUpWhenDone(
    transition: ViewTransition,
    dialog: HTMLDialogElement,
    restoreNames: () => void
  ): void {
    void transition.ready.catch(() => dialog.removeAttribute('data-view-transition'));
    const cleanup = () => {
      restoreNames();
      delete this.document.documentElement.dataset['dialogTransition'];
    };
    void transition.finished.then(cleanup, cleanup);
  }
}
