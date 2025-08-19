export interface Tag {
  color: string;
  icon: string;
  id: number;
  name: string;
}

export interface TagInsert {
  color: string;
  icon: string;
  id?: number;
  name: string;
}

export interface TagUpdate {
  color?: string;
  icon?: string;
  id?: number;
  name?: string;
}

export type TagRelationships = [];
