import { Profile } from './profiles';
import { PostTagList } from './post-tags';
import { Comment } from './comments';
import { Tag } from './tags';

export interface Post {
  content: string;
  cover_image: string;
  created_at: string | null;
  description: string;
  id: string;
  is_draft: boolean;
  title: string;
  user_id: string;
  author?: Profile;
  post_tags: PostTagList[];
  tags: Tag[];
  comments?: Comment[];
  category: string | null;
  updated: string | null;
  tableOfContents: [];
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
