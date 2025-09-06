import { PostInsert, PostUpdate, Tag } from 'shared';

export interface ProcessedPostData {
  formData: (PostInsert | PostUpdate) & { tags: Tag[] };
  isUpdate: boolean;
  postId?: string;
}