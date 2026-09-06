import { inject, Injectable, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import hljs from 'highlight.js/lib/core';
import { filter, map, take } from 'rxjs/operators';
import { QuillEditorComponent } from 'ngx-quill';
import { Post, Tag } from '@shared/core/supabase';
import { DynamicDialogService, ModalCloseStatusEnum } from '@shared/pattern/dynamic-dialog';
import { TableOfContents } from '@shared/core/toc';
import { ADD_POST_CONSTANTS } from './add-post.constants';
import { AddImageComponent } from './add-image/add-image.component';
import { AddImageForm } from './add-image/add-image-controls.interface';

//TODO: Forms types from supabase types
export interface PostForm {
  title: FormControl<string>;
  content: FormControl<string>;
  is_draft: FormControl<boolean>;
  created_at: FormControl<string | null>;
  description: FormControl<string>;
  cover_image: FormControl<string>;
  tags: FormControl<Tag[]>;
  table_of_contents: FormControl<TableOfContents>;
}

//TODO: COMPLETLY REFACTOR THIS (already less) CRAP, partialy done, prepare an router signal store to handle id, and handle redirect after save
//From move to FORM service, and process, move to post process service
@Injectable()
export class PostFormService {
  readonly addPostForm: FormGroup<PostForm> = new FormGroup<PostForm>({
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
      validators: [
        Validators.required,
        Validators.maxLength(ADD_POST_CONSTANTS.DESCRIPTION_MAX_LENGTH),
      ],
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
    table_of_contents: new FormControl<TableOfContents>({}, { nonNullable: true }),
  });

  private readonly dialogService = inject(DynamicDialogService<AddImageForm>);

  processPost(asDraft: boolean, quill: QuillEditorComponent): void {
    this.createToc(quill);
    //TODO: Refactor, do not mutate form value directly, pass content to POST from var not from form control
    this.extractAndHighlightAllCodeBlocks(this.addPostForm.controls.content.value);
    this.normalizeNonBreakingSpaces();
    this.setDraftStatus(asDraft);
    this.setCreatedAtForPublish(asDraft);
  }

  //TODO: Refactor - not mutate control, use Quill Delta
  insertImage(viewContainerRef: ViewContainerRef): void {
    this.dialogService
      .openDialog<AddImageComponent>(
        viewContainerRef,
        { title: 'Add Image', size: 'casual', primaryButton: 'Insert', secondaryButton: 'Cancel' },
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
        const content = this.addPostForm.controls.content;

        content.setValue(content.value + imgTag);
      });
  }

  initializeFormWithPost(post: Post): void {
    this.addPostForm.patchValue(post);
  }

  /**
   * Normalize non-breaking spaces in the content to regular spaces.
   * This is a Quill issue, a lot of tickets on the repo.
   * But still shouldn't mutate from control.
   * Fix is to save as an object not html
   */
  private normalizeNonBreakingSpaces(): void {
    const rawContent = this.addPostForm.controls.content.value;
    const cleanedContent = rawContent.replace(/(&nbsp;|\u00A0)/g, ' ');
    this.addPostForm.controls.content.setValue(cleanedContent);
  }

  private setDraftStatus(asDraft: boolean): void {
    this.addPostForm.controls.is_draft.setValue(asDraft);
  }

  private setCreatedAtForPublish(asDraft: boolean): void {
    const createdAt = asDraft
      ? null
      : (this.addPostForm.controls.created_at.value ?? new Date().toISOString());

    this.addPostForm.controls.created_at.setValue(createdAt);
  }

  private extractAndHighlightAllCodeBlocks(htmlContent: string): void {
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

    this.addPostForm.controls.content.setValue(tempDiv.innerHTML);
  }

  //Used Quill eachline() to get all lines.
  //Then filtered of headers only.
  //Used Record with quill index as a key, to be sure it's always properly ordered from top to bottom.
  private createToc(quill: QuillEditorComponent): void {
    const toc: TableOfContents = {};
    let quillIndex = 0;

    quill.quillEditor.getContents()?.eachLine((line, attributes, index) => {
      const id = line.ops
        .map(x => x.insert)
        .join('')
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase();

      if (attributes['header']) {
        const rec: Record<string, unknown> = {
          id,
        };
        quill.quillEditor.formatLine(quillIndex, 0, rec, 'user');
        toc[index] = {
          content: line.ops.map(x => x.insert).join(''),
          header: attributes['header'] as number,
          id,
        };
        //Remove id if header is removed, to avoid duplicate ids in the document
      } else if (attributes['id']) {
        quill.quillEditor.formatLine(quillIndex, 0, 'id', false, 'user');
      }
      quillIndex += line.length() + 1;
    });
    this.addPostForm.controls.table_of_contents.setValue(toc);
  }
}
