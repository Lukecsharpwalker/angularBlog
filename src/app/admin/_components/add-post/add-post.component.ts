import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, inject, Input, OnInit, viewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminApiService } from '../../_services/admin-api.service';
import { FirestoreModule, Timestamp } from '@angular/fire/firestore';
import { AsyncPipe } from '@angular/common';
import { EditorModule } from 'primeng/editor';
import { HighlightModule } from 'ngx-highlightjs';
import { QuillEditorComponent, Range } from 'ngx-quill'
import { Post } from '../../../shared/_models/post.interface';
import { PostForm } from '../../_models/post-from.inteface';
import hljs from 'highlight.js';
import { RouterModule } from '@angular/router';
import { loadQuillModules } from '../../../utlis/quill-configuration';
import { DynamicDialogService } from '../../../shared/dynamic-dialog/dynamic-dialog.service';
import { ModalConfig } from '../../../shared/_models/modal-config.intreface';
import { AddImageComponent } from './add-image/add-image.component';
import { AddImageForm } from './add-image/add-image-controls.interface';

@Component({
  selector: 'blog-add-post',
  standalone: true,
  imports: [ReactiveFormsModule, FirestoreModule, AsyncPipe, FormsModule, EditorModule, QuillEditorComponent, HighlightModule, RouterModule],
  providers: [AdminApiService, NgModel],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPostComponent implements OnInit {
  @Input() postId?: string;
  quill = viewChild.required<QuillEditorComponent>('quill');

  blogForm: FormGroup<PostForm>;
  range: Range | null = null;

  viewContainerRef = inject(ViewContainerRef);
  dialogService = inject(DynamicDialogService);

  private fb = inject(FormBuilder);
  private apiService = inject(AdminApiService);

  constructor() {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      date: new Timestamp(0, 0),
      description: [null],
      isDraft: [false],
    }) as FormGroup<PostForm>;


  }


  ngOnInit(): void {
    if (this.postId) {
      this.apiService.getPostById(this.postId).subscribe((post) => {
        if (post) {
          this.blogForm.patchValue(post);
        }
      });
    }
    this.initializeQuill();
  }
  async initializeQuill() {
    await loadQuillModules();
  }

  onSubmit(isDraft = false): void {
    this.highlightContent();
    if (this.blogForm.valid) {
      this.blogForm.controls.isDraft.setValue(isDraft);
      if (!this.blogForm.controls.date.value) {
        this.blogForm.controls.date.setValue(Timestamp.fromDate(new Date()));
      }
      if (this.postId) {
        this.apiService.updatePost(this.postId, this.blogForm.value as Post);
      } else {
        this.apiService.addPost(this.blogForm.value as Post);
      }
    }
  }

  highlightContent(): void {
    this.blogForm.controls.content.setValue(this.extractAndHighlight(this.blogForm.controls.content.value as string));
  }

  extractAndHighlight(htmlContent: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const codeBlocks = tempDiv.querySelectorAll('pre');
    codeBlocks.forEach((block) => {
      let language = block.getAttribute('data-language') || 'plaintext';
      const codeElement = document.createElement('code');
      codeElement.className = language;
      if (language === 'plain') {
        language = 'plaintext';
      }
      codeElement.innerHTML = hljs.highlight(block.textContent || '', { language }).value;
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
    }
    this.range = this.quill().quillEditor.getSelection();
    this.dialogService.openDialog<AddImageComponent, AddImageForm>
      (this.viewContainerRef, modalConfig, AddImageComponent).subscribe((modalStatus) => {
        if (modalStatus.data) {
          const imgTag = `<img src="${modalStatus.data.form.controls.src.value}" alt="Image" style="max-width: 100%;">`;
          if (this.range) {
            this.quill().quillEditor.clipboard.dangerouslyPasteHTML(this.range.index, imgTag); // Insert the <img> tag
            this.blogForm.controls.content.setValue(this.quill().quillEditor.root.innerHTML); // Update the form control
          }
        }
      });
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
  }
}
