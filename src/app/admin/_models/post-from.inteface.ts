import { FormControl } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';
import { Tag } from '../../types/supabase';

export interface PostForm {
  title: FormControl<string>;
  content: FormControl<string>;
  is_draft: FormControl<boolean>;
  created_at: FormControl<Date | null>;
  description: FormControl<string | null>;
  tags: FormControl<Tag[]>;
}
