import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import hljs from 'highlight.js';
import { Post, PostInsert, PostUpdate, Tag } from 'shared';
import { PostForm } from '../models/post-form.interface';
import { ADD_POST_CONSTANTS } from '../constants/add-post.constants';

export interface ProcessedPostData {
  formData: (PostInsert | PostUpdate) & { tags: Tag[] };
  isUpdate: boolean;
  postId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PostFormService {
  processFormForSubmission(
    form: FormGroup<PostForm>,
    isDraft: boolean,
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

    const formData = this.transformToApiFormat(form);

    return {
      formData,
      isUpdate: !!postId,
      postId,
    };
  }

  initializeFormWithPost(form: FormGroup<PostForm>, post: Post): void {
    if (!post) return;

    form.patchValue({
      ...post,
    });
  }

  processContent(htmlContent: string): string {
    let processedContent = this.extractAndHighlightHTML(htmlContent);
    processedContent = this.extractAndHighlightTS(processedContent);
    return processedContent;
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

  private extractAndHighlightHTML(htmlContent: string): string {
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

  private extractAndHighlightTS(htmlContent: string): string {
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
}
