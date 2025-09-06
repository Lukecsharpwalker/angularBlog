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
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import { QuillEditorComponent, Range } from 'ngx-quill';
import hljs from 'highlight.js';
import { RouterModule } from '@angular/router';
import { ModalConfig, PostInsert, PostUpdate, Tag } from 'shared';
import { DynamicDialogService } from 'shared';
import { PostForm } from './models/post-form.interface';
import { AddImageComponent } from './add-image/add-image.component';
import { AddImageForm } from './add-image/add-image-controls.interface';
import { TagMultiSelectComponent } from './tag-multi-select/tag-multi-select.component';
import { loadQuillModules } from '../../core/utils/quill-configuration';
import { AddPostStore } from './add-post.store';
import { ContentProcessorService } from './services/content-processor.service';
import { ADD_POST_CONSTANTS, MODAL_CONFIG_DEFAULTS } from './constants/add-post.constants';

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
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPostComponent implements OnInit {
  viewContainerRef = inject(ViewContainerRef);

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
    tags: new FormControl<Tag[]>([], {
      nonNullable: true,
      validators: [
        control => {
          const value = control.value;
          return value && value.length > 0 ? null : { required: true };
        },
      ],
    }),
  });

  protected readonly postId = input<string | undefined>();
  protected readonly addPostStore = inject(AddPostStore);

  private readonly quill = viewChild.required<QuillEditorComponent>('quill');
  private dialogService = inject(DynamicDialogService<AddImageForm>);
  private contentProcessor = inject(ContentProcessorService);
  private range: Range | null = null;

  async ngOnInit(): Promise<void> {
    await this.initPostFormIfPostExists();
    await this.initializeQuill();
  }

  @HostListener('window:beforeunload', ['$event'])
  protected handleBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
  }

  protected async onSubmit(isDraft = false): Promise<void> {
    this.highlightContent();
    if (!this.blogForm.controls.description.value) {
      this.blogForm.controls.description.setValue(
        this.blogForm.controls.content.value.toString().substring(0, ADD_POST_CONSTANTS.DESCRIPTION_MAX_LENGTH)
      );
    }

    if (this.blogForm.valid) {
      const rawContent = this.blogForm.controls.content.value;
      const cleanedContent = rawContent.replace(/(&nbsp;|\u00A0)/g, ' ');
      this.blogForm.controls.content.setValue(cleanedContent);
      this.blogForm.controls.is_draft.setValue(isDraft);

      if (!this.blogForm.controls.created_at.value) {
        this.blogForm.controls.created_at.setValue(null);
      }

      const formData = {
        ...this.blogForm.value,
        tags: this.blogForm.controls.tags.value,
      };

      if (this.postId()) {
        await this.addPostStore.updatePost(
          this.postId()!,
          formData as PostUpdate & { tags: Tag[] }
        );
      } else {
        await this.addPostStore.addPost(formData as PostInsert & { tags: Tag[] });
      }
    }
  }

  protected insertImage(): void {
    const modalConfig: ModalConfig = MODAL_CONFIG_DEFAULTS.ADD_IMAGE;
    this.range = this.quill().quillEditor.getSelection();
    this.dialogService
      .openDialog<AddImageComponent>(this.viewContainerRef, modalConfig, AddImageComponent)
      .subscribe(modalStatus => {
        if (modalStatus.data) {
          const imgTag = `<img src="${modalStatus.data.form.controls.src.value}" alt="${modalStatus.data.form.controls.alt.value}" style="${ADD_POST_CONSTANTS.IMAGE_MAX_WIDTH_STYLE}">`;
          if (this.range) {
            const newValue = this.contentProcessor.insertStringAtIndex(
              this.blogForm.controls.content.value,
              this.blogForm.controls.content.value.toString().length,
              imgTag
            );
            this.blogForm.controls.content.setValue(newValue);
          }
        }
      });
  }

  private highlightContent(): void {
    this.blogForm.controls.content.setValue(
      this.contentProcessor.processContent(this.blogForm.controls.content.value)
    );
  }

  private async initializeQuill(): Promise<void> {
    await loadQuillModules();
  }

  private async initPostFormIfPostExists(): Promise<void> {
    if (!this.postId()) {
      return;
    }

    await this.addPostStore.loadPost(this.postId()!);
    this.patchFormWithPostData();
  }

  private patchFormWithPostData(): void {
    const currentPost = this.addPostStore.currentPost();

    if (!currentPost) {
      return;
    }

    this.blogForm.patchValue({
      ...currentPost,
    });
  }
}
