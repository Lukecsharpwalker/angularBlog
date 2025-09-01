import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  OnInit,
  signal,
  computed,
  HostListener,
  ElementRef,
  viewChild,
  effect,
  input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { Tag } from 'shared';
import { AddPostService } from '../add-post.service';
import { AddPostStore } from '../add-post.store';

@Component({
  selector: 'admin-tag-multi-select',
  standalone: true,
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagMultiSelectComponent),
      multi: true,
    },
  ],
  templateUrl: './tag-multi-select.component.html',
  styleUrl: './tag-multi-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagMultiSelectComponent implements ControlValueAccessor {
  readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');
  readonly allTags = input.required<Tag[]>();

  readonly selectedTags = signal<Tag[]>([]);
  readonly searchTerm = signal('');
  readonly isOpen = signal(false);
  readonly disabled = signal(false);
  readonly focusedTagId = signal<number | null>(null);
  readonly filteredTags = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const selected = this.selectedTags();
    return this.allTags().filter(
      tag => tag.name.toLowerCase().includes(search) && !selected.some(s => s.id === tag.id)
    );
  });

  private readonly isTouched = signal(false);

  private elementRef = inject(ElementRef);
  private searchSubject = new Subject<string>();
  private onChange: ((value: Tag[]) => void) | null = null;
  private onTouched: (() => void) | null = null;

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onInputFocus() {
    this.isOpen.set(true);
    this.focusedTagId.set(null);
  }

  onInputBlur() {
    setTimeout(() => {
      this.isOpen.set(false);
      this.markAsTouched();
    }, 150);
  }

  selectTag(tag: Tag): void {
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

  removeTag(tag: Tag) {
    const current = this.selectedTags();
    const updated = current.filter(t => t.id !== tag.id);
    this.selectedTags.set(updated);
    this.onChange?.(updated);
    this.markAsTouched();
  }

  isTagSelected(tag: Tag): boolean {
    return this.selectedTags().some(t => t.id === tag.id);
  }

  trackByTagId(index: number, tag: Tag): number {
    return tag.id;
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
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
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  writeValue(value: Tag[]): void {
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

  private markAsTouched() {
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouched?.();
    }
  }
}
