import { FormControl } from '@angular/forms';
import { Tag } from '../../../../../../shared/src/models';

export interface PostForm {
  title: FormControl<string>;
  content: FormControl<string>;
  is_draft: FormControl<boolean>;
  created_at: FormControl<Date | null>;
  description: FormControl<string | null>;
  tags: FormControl<Tag[]>;
}
