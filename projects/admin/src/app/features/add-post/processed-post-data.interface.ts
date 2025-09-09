import { Tag } from 'shared';
import { PostInsert, PostUpdate } from './post-operations';

export interface ProcessedPostData {
  formData: (PostInsert | PostUpdate) & { tags: Tag[] };
  isUpdate: boolean;
  postId?: string;
}