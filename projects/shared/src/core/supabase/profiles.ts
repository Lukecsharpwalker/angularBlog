import { Roles } from '@shared/core/auth';

export interface Profile {
  avatar_url: string | null
  created_at: string | null
  id: string
  username: string
  role: Roles | null
}

export interface ProfileInsert {
  avatar_url?: string | null
  created_at?: string | null
  id: string
  username: string
}

export interface ProfileUpdate {
  avatar_url?: string | null
  created_at?: string | null
  id?: string
  username?: string
}

export type ProfileRelationships = []
