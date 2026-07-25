import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  inject,
  input,
  OnInit,
  Signal,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
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
import { RouterModule } from '@angular/router';
import { Post, Tag } from '@shared/core/supabase';
import { ModalConfig, DynamicDialogService } from '@shared/pattern/dynamic-dialog';
import { PostInsert, PostUpdate } from './post-operations';
import { PostForm } from './post-form.interface';
import { AddImageComponent } from './add-image/add-image.component';
import { AddImageForm } from './add-image/add-image-controls.interface';
import { TagMultiSelectComponent } from './tag-multi-select/tag-multi-select.component';
import { loadQuillModules } from '../../core/utils/quill-configuration';
import { AddPostStore } from './add-post.store';
import { PostFormService } from './post-form.service';
import { ADD_POST_CONSTANTS, MODAL_CONFIG_DEFAULTS } from './add-post.constants';
import { ProcessedPostData } from './processed-post-data.interface';

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
  encapsulation: ViewEncapsulation.None,
})

//TODO: COMPLETLY REFACTOR THIS CRAP
export class AddPostComponent implements OnInit {
  protected blogForm: FormGroup<PostForm> = new FormGroup<PostForm>({
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
  protected readonly isEditMode: Signal<boolean> = computed(() => !!this.postId());
  protected readonly addPostStore = inject(AddPostStore);

  private viewContainerRef = inject(ViewContainerRef);
  private readonly quill: Signal<QuillEditorComponent> =
    viewChild.required<QuillEditorComponent>('quill');
  private dialogService = inject(DynamicDialogService<AddImageForm>);
  private postFormService = inject(PostFormService);
  private range: Range | null = null;

  async ngOnInit(): Promise<void> {
    await this.initPostFormIfPostExists();
    await this.initializeQuill();
    console.log(this.quill());
  }

  @HostListener('window:beforeunload', ['$event'])
  protected handleBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
  }

  //TODO split to two functions. But publish, should navigate to main page, draft should update store and navihate to edit
  protected async onSubmit(isDraft = false): Promise<void> {
    const processedData: ProcessedPostData | null = this.postFormService.processFormForSubmission(
      this.blogForm,
      isDraft,
      this.isEditMode(),
      this.postId()
    );

    if (!processedData) {
      return;
    }

    if (processedData.isUpdate) {
      await this.addPostStore.updatePost(
        processedData.postId!,
        processedData.formData as PostUpdate & { tags: Tag[] }
      );
    } else {
      await this.addPostStore.addPost(processedData.formData as PostInsert & { tags: Tag[] });
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
            const newValue: string = this.postFormService.insertStringAtIndex(
              this.blogForm.controls.content.value,
              this.blogForm.controls.content.value.toString().length,
              imgTag
            );
            this.blogForm.controls.content.setValue(newValue);
          }
        }
      });
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
    const currentPost: Post | null = this.addPostStore.currentPost();
    if (currentPost) {
      this.postFormService.initializeFormWithPost(this.blogForm, currentPost!);
    }
  }
}
