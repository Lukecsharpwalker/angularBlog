<<<<<<< HEAD
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  inject,
  Input,
  OnInit,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminApiService } from '../../_services/admin-api.service';
import { HighlightModule } from 'ngx-highlightjs';
import { QuillEditorComponent, Range } from 'ngx-quill';
import { PostForm } from '../../_models/post-from.inteface';
import hljs from 'highlight.js';
import { RouterModule } from '@angular/router';
import { loadQuillModules } from '../../../utlis/quill-configuration';
import { DynamicDialogService } from '../../../shared/dynamic-dialog/dynamic-dialog.service';
import { ModalConfig } from '../../../shared/_models/modal-config.intreface';
import { AddImageComponent } from './add-image/add-image.component';
import { AddImageForm } from './add-image/add-image-controls.interface';
<<<<<<< HEAD
=======
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../_services/api.service';
import { Firestore, FirestoreModule} from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
>>>>>>> ab739b9 (nothing special)
=======
import { Post } from '../../../types/supabase';
>>>>>>> fca8c97 (ngrx signal store fixes)

@Component({
  selector: 'blog-add-post',
  standalone: true,
<<<<<<< HEAD
  imports: [
    ReactiveFormsModule,
    FormsModule,
    QuillEditorComponent,
    HighlightModule,
    RouterModule,
  ],
  providers: [AdminApiService, NgModel],
=======
  imports: [ReactiveFormsModule, FirestoreModule, AsyncPipe],
  providers: [ApiService, HttpClient],
>>>>>>> ab739b9 (nothing special)
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPostComponent implements OnInit {
  @Input() postId?: string;
  quill = viewChild.required<QuillEditorComponent>('quill');

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
    date: new FormControl<Date | null>(null),
    description: new FormControl<string | null>(null),
    isDraft: new FormControl(false, { nonNullable: true }),
  });
  range: Range | null = null;

  private apiService = inject(AdminApiService);

<<<<<<< HEAD
  constructor() {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
<<<<<<< HEAD
<<<<<<< HEAD
      date: new Timestamp(0, 0),
=======
      date: null,
>>>>>>> 34e7e50 (supabase added, firebase removed)
      description: [null],
      isDraft: [false],
    }) as FormGroup<PostForm>;
=======
    });
>>>>>>> ab739b9 (nothing special)
=======
  ngOnInit(): void {
    this.loadPostIfIdExists();
    this.initializeQuill();
>>>>>>> cbcd61c (fix lame code)
  }

  private loadPostIfIdExists(): void {
    if (this.postId) {
      this.apiService.getPostById(this.postId).subscribe((post) => {
        if (post) {
          this.blogForm.patchValue(post);
        }
      });
    }
  }

  async initializeQuill() {
    await loadQuillModules();
  }

  onSubmit(isDraft = false): void {
    this.highlightContent();
    if (this.blogForm.valid) {
      const rawContent = this.blogForm.controls.content.value as string;
      const cleanedContent = rawContent.replace(/(&nbsp;|\u00A0)/g, ' ');
      this.blogForm.controls.content.setValue(cleanedContent);
      this.blogForm.controls.isDraft.setValue(isDraft);
      if (!this.blogForm.controls.date.value) {
        this.blogForm.controls.date.setValue(null);
      }
      if (this.postId) {
        this.apiService.updatePost(this.postId, this.blogForm.value as Post);
      } else {
        this.apiService.addPost(this.blogForm.value as Post);
      }
    }
  }

  highlightContent(): void {
    this.blogForm.controls.content.setValue(
      this.extractAndHighlightHTML(
        this.blogForm.controls.content.value as string,
      ),
    );
    this.blogForm.controls.content.setValue(
      this.extractAndHighlightTS(
        this.blogForm.controls.content.value as string,
      ),
    );
  }

  extractAndHighlightHTML(htmlContent: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const codeBlocksHTML = tempDiv.querySelectorAll('pre[data-language="xml"]');
    codeBlocksHTML.forEach((block) => {
      let language = 'xml';
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

    const codeBlocksTS = tempDiv.querySelectorAll(
      'pre[data-language="typescript"]',
    );
    codeBlocksTS.forEach((block) => {
      let language = 'typescript';
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
      .openDialog<AddImageComponent>(
        this.viewContainerRef,
        modalConfig,
        AddImageComponent,
      )
      .subscribe((modalStatus) => {
        if (modalStatus.data) {
          const imgTag = `<img src="${modalStatus.data.form.controls.src.value}" alt="${modalStatus.data.form.controls.alt.value}" style="max-width: 100%;">`;
          if (this.range) {
            const newValue = this.insertString(
              this.blogForm.controls.content.value as string,
              this.blogForm.controls.content.value.toString().length,
              imgTag,
            );
            this.blogForm.controls.content.setValue(newValue);
          }
        }
      });
  }

  insertString(
    originalString: string,
    index: number,
    stringToInsert: string,
  ): string {
    const result = [
      ...originalString.slice(0, index),
      ...stringToInsert,
      ...originalString.slice(index),
    ].join('');
    return result;
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
  }
}
