import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ModalVariant } from '../modal-config';
import { VerticalSwipeDirective } from '../vertical-swipe.directive';
import { DialogViewTransitionService } from './dialog-view-transition.service';

@Component({
  selector: 'shared-dialog-shell',
  standalone: true,
  imports: [VerticalSwipeDirective],
  providers: [DialogViewTransitionService],
  templateUrl: './dialog-shell.component.html',
  styleUrl: './dialog-shell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-expanded]': 'expanded() || null',
    '[attr.data-dragging]': 'dragOffsetPx() !== null || null',
    '[style.--dialog-drag-offset.px]': 'dragOffsetPx()',
    '[style.--dialog-drag-start-height.px]': 'dragStartHeightPx()',
    '(click)': 'onBackdropClick($event)',
    '(keydown.escape)': 'onEscape($event)',
  },
})
export class DialogShellComponent {
  readonly variant = input.required<ModalVariant>();
  readonly transitionSource = input<HTMLElement>();
  readonly title = input<string>();
  readonly ariaLabel = input('Dialog');

  readonly dismissed = output<void>();

  protected readonly expanded = signal(false);
  protected readonly dragOffsetPx = signal<number | null>(null);
  protected readonly dragStartHeightPx = signal(0);

  private readonly card = viewChild.required<ElementRef<HTMLElement>>('dialogCard');
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogViewTransition = inject(DialogViewTransitionService);

  constructor() {
    afterNextRender(() => this.openModal());
  }

  protected dismiss(event: MouseEvent): void {
    event.stopPropagation();
    this.dismissed.emit();
  }

  protected updateDrag(offsetPx: number | null): void {
    if (offsetPx !== null && this.dragOffsetPx() === null) {
      this.dragStartHeightPx.set(this.card().nativeElement.getBoundingClientRect().height);
    }
    this.dragOffsetPx.set(offsetPx);
  }

  protected onSwipeDown(): void {
    const cardTopPx = this.card().nativeElement.getBoundingClientRect().top;
    const startPositionTopPx = this.dialog().nativeElement.clientHeight / 2;
    if (this.expanded() && cardTopPx < startPositionTopPx) {
      this.expanded.set(false);
    } else {
      this.dismissed.emit();
    }
  }

  protected onHandleClick(event: MouseEvent): void {
    if (event.detail === 0) {
      this.expanded.update(expanded => !expanded);
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    event.stopPropagation();
    if (event.target === this.dialog().nativeElement) {
      this.dismissed.emit();
    }
  }

  protected onEscape(event: KeyboardEvent): void {
    event.stopPropagation();
  }

  protected onCancel(event: Event): void {
    event.preventDefault();
    this.dismissed.emit();
  }

  private openModal(): void {
    const dialog = this.dialog().nativeElement;
    this.destroyRef.onDestroy(() => dialog.close());
    const source = this.variant() === 'immersive' ? this.transitionSource() : undefined;
    this.dialogViewTransition.run(dialog, source, () => this.show());
  }

  private show(): void {
    if (this.destroyRef.destroyed) {
      return;
    }
    this.dialog().nativeElement.showModal();
    this.card().nativeElement.focus({ preventScroll: true });
  }
}
