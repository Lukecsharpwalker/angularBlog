import { Profile } from './profiles';
import { PostTagList } from './post-tags';
import { Comment } from './comments';

export interface Post {
  content: string;
  created_at: Date | null;
  description: string;
  id: string;
  is_draft: boolean;
  title: string;
  user_id: string;
  author?: Profile;
  post_tags: PostTagList[];
  comments: Comment[];
  category: string | null;
  updated: string | null;
  readingTime: number | null;
  tableOfContents: [];
}

export interface PostInsert {
  content: string;
  created_at?: string | null;
  description: string;
  id?: string;
  is_draft?: boolean;
  title: string;
  user_id: string;
}

export interface PostUpdate {
  content?: string;
  created_at?: string | null;
  description?: string;
  id?: string;
  is_draft?: boolean;
  title?: string;
  user_id?: string;
}

export type PostRelationships = [
  {
    foreignKeyName: 'posts_user_id_fkey';
    columns: ['user_id'];
    isOneToOne: false;
    referencedRelation: 'profiles';
    referencedColumns: ['id'];
  },
];
