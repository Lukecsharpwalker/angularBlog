import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  signal,
  computed,
  HostListener,
  ElementRef,
  viewChild,
  input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Tag } from '@shared/core/supabase';

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
  styleUrl: './tag-multi-select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
//TODO: Refactor component (CDK overlay?)
export class TagMultiSelectComponent implements ControlValueAccessor {
  readonly allTags = input.required<Tag[]>();

  protected readonly selectedTags = signal<Tag[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly isOpen = signal(false);
  protected readonly disabled = signal(false);
  protected readonly focusedTagId = signal<number | null>(null);

  protected readonly filteredTags = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const selected = this.selectedTags();
    return this.allTags().filter(
      tag => tag.name.toLowerCase().includes(search) && !selected.some(s => s.id === tag.id)
    );
  });

  private readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');
  private elementRef = inject(ElementRef);
  private onChange: ((value: Tag[]) => void) | null = null;
  private onTouched: (() => void) | null = null;

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
  }

  protected onInputFocus(): void {
    this.isOpen.set(true);
    this.focusedTagId.set(null);
  }

  protected onInputBlur(): void {
    setTimeout(() => {
      this.isOpen.set(false);
      this.onTouched?.();
    }, 150);
  }

  protected selectTag(tag: Tag): void {
    if (!this.selectedTags().find(t => t.id === tag.id)) {
      this.selectedTags.update(tags => [...tags, tag]);
      this.onChange?.(this.selectedTags());
      this.onTouched?.();

      this.searchTerm.set('');
      this.searchInput().nativeElement.value = '';
      this.isOpen.set(true);

      setTimeout(() => {
        this.searchInput().nativeElement.focus();
      }, 0);
    }
  }

  protected removeTag(tag: Tag): void {
    this.selectedTags.update(tags => tags.filter(t => t.id !== tag.id));
    this.onChange?.(this.selectedTags());
    this.onTouched?.();
  }

  protected isTagSelected(tag: Tag): boolean {
    return this.selectedTags().some(t => t.id === tag.id);
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
        this.focusedTagId.set(filtered[nextIndex]?.id || null);
        break;
      }

      case 'ArrowUp': {
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : filtered.length - 1;
        this.focusedTagId.set(filtered[prevIndex]?.id || null);
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
        this.searchInput().nativeElement.blur();
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }
}
