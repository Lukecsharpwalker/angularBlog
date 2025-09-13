import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import hljs from 'highlight.js';
import { Post, Tag } from '@shared/core/supabase';
import { PostInsert, PostUpdate } from './post-operations';
import { PostForm } from './post-form.interface';
import { ProcessedPostData } from './processed-post-data.interface';
import { ADD_POST_CONSTANTS } from './add-post.constants';

@Injectable({
  providedIn: 'root',
})
export class PostFormService {
  processFormForSubmission(
    form: FormGroup<PostForm>,
    isDraft: boolean,
    isEditMode: boolean,
    postId?: string
  ): ProcessedPostData | null {
    if (!form.valid) {
      return null;
    }

    this.applyContentProcessing(form);
    this.generateDescriptionIfMissing(form);
    this.cleanContentForApi(form);
    this.setDraftStatus(form, isDraft);
    this.normalizeCreatedDate(form);

    const formData: (PostInsert | PostUpdate) & { tags: Tag[] } = this.transformToApiFormat(form);

    return {
      formData,
      isUpdate: isEditMode,
      postId,
    } as ProcessedPostData;
  }

  initializeFormWithPost(form: FormGroup<PostForm>, post: Post): void {
    if (!post) return;

    form.patchValue({
      ...post,
    });
  }

  processContent(htmlContent: string): string {
    return this.extractAndHighlightAllCodeBlocks(htmlContent);
  }

  insertStringAtIndex(originalString: string, index: number, stringToInsert: string): string {
    return [
      ...originalString.slice(0, index),
      ...stringToInsert,
      ...originalString.slice(index),
    ].join('');
  }

  private applyContentProcessing(form: FormGroup<PostForm>): void {
    const processedContent = this.processContent(form.controls.content.value);
    form.controls.content.setValue(processedContent);
  }

  private generateDescriptionIfMissing(form: FormGroup<PostForm>): void {
    if (!form.controls.description.value) {
      const contentText = form.controls.content.value.toString();
      const autoDescription = contentText.substring(0, ADD_POST_CONSTANTS.DESCRIPTION_MAX_LENGTH);
      form.controls.description.setValue(autoDescription);
    }
  }

  private cleanContentForApi(form: FormGroup<PostForm>): void {
    const rawContent = form.controls.content.value;
    const cleanedContent = rawContent.replace(/(&nbsp;|\u00A0)/g, ' ');
    form.controls.content.setValue(cleanedContent);
  }

  private setDraftStatus(form: FormGroup<PostForm>, isDraft: boolean): void {
    form.controls.is_draft.setValue(isDraft);
  }

  private normalizeCreatedDate(form: FormGroup<PostForm>): void {
    if (!form.controls.created_at.value) {
      form.controls.created_at.setValue(null);
    }
  }

  private transformToApiFormat(
    form: FormGroup<PostForm>
  ): (PostInsert | PostUpdate) & { tags: Tag[] } {
    return {
      ...form.value,
      tags: form.controls.tags.value,
    } as (PostInsert | PostUpdate) & { tags: Tag[] };
  }

  private extractAndHighlightAllCodeBlocks(htmlContent: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const allPreBlocks = tempDiv.querySelectorAll('pre');
    allPreBlocks.forEach(block => {
      const rawText = block.textContent || '';
      const language = this.detectLanguage(rawText);

      const codeElement = document.createElement('code');
      codeElement.className = language;
      codeElement.innerHTML = hljs.highlight(rawText, { language }).value;

      block.innerHTML = '';
      block.appendChild(codeElement);
    });

    return tempDiv.innerHTML;
  }

  private detectLanguage(code: string): string {
    const lowerCode = code.toLowerCase();

    if (
      (lowerCode.includes('name:') && lowerCode.includes('on:')) ||
      lowerCode.includes('uses:') ||
      lowerCode.includes('runs-on:')
    ) {
      return 'yaml';
    }
    if (
      lowerCode.includes('select') &&
      (lowerCode.includes('from') ||
        lowerCode.includes('where') ||
        lowerCode.includes('insert') ||
        lowerCode.includes('update'))
    ) {
      return 'sql';
    }
    if (
      code.includes('import') &&
      (code.includes(': ') ||
        code.includes('interface') ||
        code.includes('type ') ||
        code.includes('<T>'))
    ) {
      return 'typescript';
    }
    if (code.includes('import') && code.includes('test') && code.includes('@playwright')) {
      return 'typescript';
    }
    if (code.includes('import') && (code.includes('=>') || code.includes('function'))) {
      return 'typescript';
    }
    if (code.includes('<') && code.includes('>') && (code.includes('=') || code.includes('</'))) {
      return 'xml';
    }
    if (code.includes('function') || code.includes('const') || code.includes('let')) {
      return 'javascript';
    }
    return 'javascript';
  }
}
