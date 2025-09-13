import { Tag } from './tags';

export interface PostTag {
  post_id: string;
  tag_id: number;
}

export interface PostTagList {
  tags: Tag;
}

export interface PostTagInsert {
  post_id: string;
  tag_id: number;
}

export interface PostTagUpdate {
  post_id?: string;
  tag_id?: number;
}

export type PostTagRelationships = [
  {
    foreignKeyName: 'post_tags_post_id_fkey';
    columns: ['post_id'];
    isOneToOne: false;
    referencedRelation: 'posts';
    referencedColumns: ['id'];
  },
  {
    foreignKeyName: 'post_tags_tag_id_fkey';
    columns: ['tag_id'];
    isOneToOne: false;
    referencedRelation: 'tags';
    referencedColumns: ['id'];
  },
];
