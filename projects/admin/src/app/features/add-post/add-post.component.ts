import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  inject,
  input,
  OnInit,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import { QuillEditorComponent, Range } from 'ngx-quill';
import hljs from 'highlight.js';
import { RouterModule } from '@angular/router';
import { PostForm } from './models/post-from.inteface';
import { AddImageComponent } from './add-image/add-image.component';
import { AddImageForm } from './add-image/add-image-controls.interface';
import { AdminApiService } from '../../core/services/admin-api.service';
import { TagMultiSelectComponent } from './tag-multi-select/tag-multi-select.component';
import { loadQuillModules } from '../../core/utils/quill-configuration';
import { ModalConfig, PostInsert, PostUpdate, Tag } from '../../../../../shared/src/models';
import { DynamicDialogService } from '../../../../../shared/src/pattern';

@Component({
  selector: 'admin-add-post',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    QuillEditorComponent,
    HighlightModule,
    RouterModule,
    TagMultiSelectComponent,
  ],
  providers: [AdminApiService, NgModel],
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPostComponent implements OnInit {
  public readonly postId = input<string | undefined>();
  readonly quill = viewChild.required<QuillEditorComponent>('quill');

  viewContainerRef = inject(ViewContainerRef);
  dialogService = inject(DynamicDialogService<AddImageForm>);

  blogForm: FormGroup<PostForm> = new FormGroup<PostForm>({
    title: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    content: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    created_at: new FormControl<Date | null>(null),
    description: new FormControl<string | null>(null),
    is_draft: new FormControl(false, { nonNullable: true }),
    tags: new FormControl<Tag[]>([], { nonNullable: true }),
  });
  range: Range | null = null;

  private apiService = inject(AdminApiService);

  ngOnInit(): void {
    this.loadPostIfIdExists();
    this.initializeQuill();
  }

  private loadPostIfIdExists(): void {
    if (this.postId()) {
      this.apiService.getPostById(this.postId()!).subscribe(post => {
        if (post) {
          this.blogForm.patchValue(post);
          console.log(this.blogForm.value);
        }
      });
    }
  }

  async initializeQuill() {
    await loadQuillModules();
  }

  onSubmit(isDraft = false): void {
    this.highlightContent();
    // Test for description
    if (!this.blogForm?.controls?.description?.value) {
      this.blogForm.controls?.description?.setValue(
        this.blogForm.controls.content.value.toString().substring(0, 150)
      );
    }

    if (this.blogForm.valid) {
      const rawContent = this.blogForm.controls.content.value as string;
      const cleanedContent = rawContent.replace(/(&nbsp;|\u00A0)/g, ' ');
      this.blogForm.controls.content.setValue(cleanedContent);
      this.blogForm.controls.is_draft.setValue(isDraft);

      if (!this.blogForm.controls.created_at.value) {
        this.blogForm.controls.created_at.setValue(null);
      }

      // Extract form data including tags
      const formData = {
        ...this.blogForm.value,
        tags: this.blogForm.controls.tags.value,
      };

      if (this.postId) {
        this.apiService.updatePost(this.postId(), formData as PostUpdate & { tags: Tag[] });
      } else {
        this.apiService.addPost(formData as PostInsert & { tags: Tag[] });
      }
    }
  }

  highlightContent(): void {
    this.blogForm.controls.content.setValue(
      this.extractAndHighlightHTML(this.blogForm.controls.content.value as string)
    );
    this.blogForm.controls.content.setValue(
      this.extractAndHighlightTS(this.blogForm.controls.content.value as string)
    );
  }

  extractAndHighlightHTML(htmlContent: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const codeBlocksHTML = tempDiv.querySelectorAll('pre[data-language="xml"]');
    codeBlocksHTML.forEach(block => {
      const language = 'xml';
      const codeElement = document.createElement('code');
      codeElement.className = language;
      codeElement.innerHTML = hljs.highlight(block.textContent || '', {
        language,
      }).value;
      block.innerHTML = '';
      block.appendChild(codeElement);
    });

    return tempDiv.innerHTML;
  }

  extractAndHighlightTS(htmlContent: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const codeBlocksTS = tempDiv.querySelectorAll('pre[data-language="typescript"]');
    codeBlocksTS.forEach(block => {
      const language = 'typescript';
      const codeElement = document.createElement('code');
      codeElement.className = language;
      codeElement.innerHTML = hljs.highlight(block.textContent || '', {
        language,
      }).value;
      block.innerHTML = '';
      block.appendChild(codeElement);
    });

    return tempDiv.innerHTML;
  }

  // Function to insert an image into Quill editor
  insertImage() {
    const modalConfig: ModalConfig = {
      title: 'Add Image',
      primaryButton: 'Insert',
      secondaryButton: 'Cancel',
    };
    this.range = this.quill().quillEditor.getSelection();
    this.dialogService
      .openDialog<AddImageComponent>(this.viewContainerRef, modalConfig, AddImageComponent)
      .subscribe(modalStatus => {
        if (modalStatus.data) {
          const imgTag = `<img src="${modalStatus.data.form.controls.src.value}" alt="${modalStatus.data.form.controls.alt.value}" style="max-width: 100%;">`;
          if (this.range) {
            const newValue = this.insertString(
              this.blogForm.controls.content.value as string,
              this.blogForm.controls.content.value.toString().length,
              imgTag
            );
            this.blogForm.controls.content.setValue(newValue);
          }
        }
      });
  }

  insertString(originalString: string, index: number, stringToInsert: string): string {
    return [
      ...originalString.slice(0, index),
      ...stringToInsert,
      ...originalString.slice(index),
    ].join('');
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
  }
}
