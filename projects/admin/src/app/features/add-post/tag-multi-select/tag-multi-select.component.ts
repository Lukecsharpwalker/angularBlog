import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  signal,
  computed,
  HostListener,
  input,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import { Tag } from '@shared/core/supabase';
import { ChipComponent } from '@shared/ui/chip';

@Component({
  selector: 'admin-tag-multi-select',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagMultiSelectComponent),
      multi: true,
    },
  ],
  templateUrl: './tag-multi-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [ChipComponent, CdkConnectedOverlay, CdkOverlayOrigin],
})
export class TagMultiSelectComponent implements ControlValueAccessor {
  // TODO: REfactor with signal forms, AS FIRST. PRIORITY
  readonly allTags = input.required<Tag[]>();

  protected readonly selectedTags = signal<Tag[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly isOpen = signal(false);
  protected readonly disabled = signal(false);
  protected readonly focusedTagId = signal<number | null>(null);


  //TODO: test if singal woulnd't update this
  //Tested, with button click, changing this signal, is updating postion, but now working with seltect tags, need to inwestigate
  protected readonly overlayPositions: WritableSignal<ConnectedPosition[]> = signal([
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  ]);


  //TODO: Maybe some set?
  protected readonly filteredTags = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const selected = this.selectedTags();
    return this.allTags().filter(
      tag => tag.name.toLowerCase().includes(search) && !selected.some(s => s.id === tag.id)
    );
  });

  private readonly connectedOverlay = viewChild(CdkConnectedOverlay);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private onChange: ((value: Tag[]) => void) | null = null;
  private onTouched: (() => void) | null = null;

  constructor() {
    //TODO: In Angular 22 use https://angular.dev/guide/aria/multiselect
    this.keepOverlayAlignedWithInput();
  }

  writeValue(value: Tag[] | null): void {
    this.selectedTags.set(value || []);
  }

  registerOnChange(fn: (value: Tag[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.searchTerm.set(value);
    this.isOpen.set(true);
  }

  protected onInputFocus(): void {
    this.isOpen.set(true);
    this.focusedTagId.set(null);
  }

  protected onInputBlur(): void {
    this.isOpen.set(false);
    this.focusedTagId.set(null);
    this.onTouched?.();
  }

  protected selectTag(tag: Tag): void {
    this.selectedTags.update(tags => [...tags, tag]);
    this.onChange?.(this.selectedTags());
    this.onTouched?.();

    this.searchTerm.set('');
  }

  protected removeTag(tag: Tag): void {
    this.selectedTags.update(tags => tags.filter(t => t.id !== tag.id));
    this.onChange?.(this.selectedTags());
    this.onTouched?.();
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen() || this.disabled()) return;

    const filtered = this.filteredTags();
    const currentIndex = filtered.findIndex(tag => tag.id === this.focusedTagId());

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex = currentIndex < filtered.length - 1 ? currentIndex + 1 : 0;
        this.focusedTagId.set(filtered[nextIndex]?.id ?? null);
        break;
      }

      case 'ArrowUp': {
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : filtered.length - 1;
        this.focusedTagId.set(filtered[prevIndex]?.id ?? null);
        break;
      }

      case 'Enter': {
        event.preventDefault();
        const focusedTag = filtered.find(tag => tag.id === this.focusedTagId());
        if (focusedTag) {
          this.selectTag(focusedTag);
        }
        break;
      }

      case 'Escape':
        event.preventDefault();
        this.isOpen.set(false);
        this.focusedTagId.set(null);
        break;
    }
  }

  // When user selects a tag, we want to keep the overlay aligned with the input field.
  // After select input field drifts down and overlay position is not updated.
  private keepOverlayAlignedWithInput(): void {
    const resizeObserver = new ResizeObserver(() =>
      this.connectedOverlay()?.overlayRef?.updatePosition()
    );

    resizeObserver.observe(this.elementRef.nativeElement);
    this.destroyRef.onDestroy(() => resizeObserver.disconnect());
  }
}
