import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  input,
  OnInit,
  signal,
  Signal,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HighlightModule } from 'ngx-highlightjs';
import { QuillEditorComponent } from 'ngx-quill';
import { RouterModule } from '@angular/router';
import { Post } from '@shared/core/supabase';
import { DynamicDialogService } from '@shared/pattern/dynamic-dialog';
import { IconComponent } from '@shared/pattern/icon-system';
import { PanelCardComponent } from '../../ui/panel-card';
import { TagMultiSelectComponent } from './tag-multi-select/tag-multi-select.component';
import { loadQuillModules } from '../../core/utils/quill-configuration';
import { AddPostStore } from './add-post.store';
import { PostForm, PostFormService } from './post-form.service';
import { StatusChipComponent } from '../../ui/status-chip';
import { ADD_POST_CONSTANTS } from './add-post.constants';

@Component({
  selector: 'admin-add-post',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    FormsModule,
    QuillEditorComponent,
    HighlightModule,
    RouterModule,
    TagMultiSelectComponent,
    IconComponent,
    PanelCardComponent,
    StatusChipComponent,
  ],
  templateUrl: './add-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPostComponent implements OnInit {
  //TODO: Refactor, postId should be handled by router signal store, and this component should take computed id
  protected readonly postId = input<string | undefined>();
  protected readonly isEditMode: Signal<boolean> = computed(() => !!this.postId());
  protected readonly addPostStore = inject(AddPostStore);
  protected readonly postFormService = inject(PostFormService);
  protected readonly blogForm: FormGroup<PostForm> = this.postFormService.blogForm;
  protected readonly ADD_POST_CONSTANTS = ADD_POST_CONSTANTS;
  protected readonly quillReady = signal(false);

  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly dynamicDialogService = inject(DynamicDialogService<never>);

  ngOnInit(): void {
    this.initializeQuill().then(() => {
      this.quillReady.set(true);
    });
    //TODO: Move this to store, store can patch form
    void this.loadPost();
  }

  //TODO: Refactor, already task created
  @HostListener('window:beforeunload', ['$event'])
  protected handleBeforeUnload(event: BeforeUnloadEvent) {
    if (this.blogForm.dirty) {
      event.preventDefault();
    }
  }

  protected async onSubmit(asDraft = false): Promise<void> {
    await this.postFormService.submitPost(asDraft, this.postId());
  }

  protected insertImage(): void {
    this.postFormService.insertImage(this.viewContainerRef);
  }

  protected openCoverImagePreview(coverImage: string): void {
    this.dynamicDialogService.openDialog(this.viewContainerRef, {
      title: 'Cover image',
      image: coverImage,
    });
  }

  private async initializeQuill(): Promise<void> {
    await loadQuillModules();
  }

  private async loadPost(): Promise<void> {
    if (!this.postId()) {
      return;
    }

    await this.addPostStore.loadPost(this.postId()!);
    this.patchFormWithPostData();
  }

  private patchFormWithPostData(): void {
    const post: Post | null = this.addPostStore.post();
    if (post) {
      this.postFormService.initializeFormWithPost(post);
    }
  }
}
