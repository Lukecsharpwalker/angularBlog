import { User } from '@supabase/supabase-js';
import { Roles } from '@shared/core/auth/roles';

interface AppMetadata {
  role?: Roles;
}

export interface UserWithRole extends User {
  app_metadata: AppMetadata;
}
