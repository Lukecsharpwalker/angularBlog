import { FormControl } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';

export interface PostForm {
  title: FormControl<string>;
  content: FormControl<string | SafeHtml>;
  is_draft: FormControl<boolean>;
  created_at: FormControl<Date | null>;
  description?: FormControl<string | null>;
  tags: FormControl<string[] | null>;
}
