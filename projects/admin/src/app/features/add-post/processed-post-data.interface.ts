import { Tag } from '@shared/core/supabase';
import { PostInsert, PostUpdate } from './post-operations';

export interface ProcessedPostData {
  formData: (PostInsert | PostUpdate) & { tags: Tag[] };
  isUpdate: boolean;
  postId?: string;
}
