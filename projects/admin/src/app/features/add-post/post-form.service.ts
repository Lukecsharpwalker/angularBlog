import { inject, Injectable, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import hljs from 'highlight.js/lib/core';
import { filter, map, take } from 'rxjs/operators';
import { Post, Tag } from '@shared/core/supabase';
import { DynamicDialogService, ModalCloseStatusEnum } from '@shared/pattern/dynamic-dialog';
import { ADD_POST_CONSTANTS, MODAL_CONFIG_DEFAULTS } from './add-post.constants';
import { AddPostStore } from './add-post.store';
import { AddImageComponent } from './add-image/add-image.component';
import { AddImageForm } from './add-image/add-image-controls.interface';

export interface PostForm {
  title: FormControl<string>;
  content: FormControl<string>;
  is_draft: FormControl<boolean>;
  created_at: FormControl<string | null>;
  description: FormControl<string>;
  cover_image: FormControl<string>;
  tags: FormControl<Tag[]>;
}

//TODO: COMPLETLY REFACTOR THIS CRAP, partialy done, prepare an router signal store to handle id, and handle redirect after save
//Forms types from supabase types
@Injectable()
export class PostFormService {
  readonly blogForm: FormGroup<PostForm> = new FormGroup<PostForm>({
    title: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    content: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    created_at: new FormControl<string | null>(null),
    description: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(ADD_POST_CONSTANTS.DESCRIPTION_MAX_LENGTH)],
      nonNullable: true,
    }),
    cover_image: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    is_draft: new FormControl(true, { nonNullable: true }),
    tags: new FormControl<Tag[]>([], {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  private readonly addPostStore = inject(AddPostStore);
  private readonly dialogService = inject(DynamicDialogService<AddImageForm>);

  //TODO split to two functions. But publish, should navigate to main page, draft should update store and navihate to edit
  async submitPost(asDraft: boolean, postId?: string): Promise<void> {
    this.applyContentProcessing();
    this.normalizeNonBreakingSpaces();
    this.setDraftStatus(asDraft);

    const createdAt = this.blogForm.controls.created_at;
    createdAt.setValue(asDraft ? null : (createdAt.value ?? new Date().toISOString()));

    const payload = this.blogForm.getRawValue();

    await (postId
      ? this.addPostStore.updatePost(postId, payload)
      : this.addPostStore.addPost(payload));
  }

  insertImage(viewContainerRef: ViewContainerRef): void {
    this.dialogService
      .openDialog<AddImageComponent>(
        viewContainerRef,
        MODAL_CONFIG_DEFAULTS.ADD_IMAGE,
        AddImageComponent
      )
      .pipe(
        take(1),
        filter(({ closeStatus }) => closeStatus === ModalCloseStatusEnum.ACCEPTED),
        map(modalStatus => modalStatus.data?.form.getRawValue())
      )
      .subscribe(form => {
        if (!form?.src) {
          return;
        }
        const { src, alt } = form;
        //TODO: convert to ngSrc directive, but for now, just add max-width style to the image tag
        const imgTag = `<img src="${src}" alt="${alt}" style="${ADD_POST_CONSTANTS.IMAGE_MAX_WIDTH_STYLE}">`;
        const content = this.blogForm.controls.content;

        content.setValue(content.value + imgTag);
      });
  }

  initializeFormWithPost(post: Post): void {
    this.blogForm.patchValue(post);
  }

  private applyContentProcessing(): void {
    const processedContent = this.extractAndHighlightAllCodeBlocks(
      this.blogForm.controls.content.value
    );
    //TODO: Refactor, do not mutate form value directly, pass content to POST from var not from form control
    this.blogForm.controls.content.setValue(processedContent);
  }

  //TODO: Refactor, I think this could be done onPaste
  private normalizeNonBreakingSpaces(): void {
    const rawContent = this.blogForm.controls.content.value;
    const cleanedContent = rawContent.replace(/(&nbsp;|\u00A0)/g, ' ');
    this.blogForm.controls.content.setValue(cleanedContent);
  }

  private setDraftStatus(asDraft: boolean): void {
    this.blogForm.controls.is_draft.setValue(asDraft);
  }

  private extractAndHighlightAllCodeBlocks(htmlContent: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const allPreBlocks = tempDiv.querySelectorAll('pre');
    allPreBlocks.forEach(block => {
      const rawText = block.textContent || '';
      const language = block.getAttribute('data-language') ?? 'plaintext';

      const codeElement = document.createElement('code');

      codeElement.className = `hljs language-${language}`;
      codeElement.innerHTML = hljs.highlight(rawText, { language }).value;

      block.innerHTML = '';
      block.appendChild(codeElement);
    });

    return tempDiv.innerHTML;
  }
}
