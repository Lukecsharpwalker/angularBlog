export interface Profile {
  avatar_url: string | null
  created_at: string | null
  id: string
  username: string
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
