# Core Layer - Admin Application

Application-wide singletons, DI setup, domain services, state, and initialization logic.

## Structure
- `auth/` - Admin authentication and authorization
- `http/` - HTTP interceptors for admin API calls
- `utils/` - Admin-specific utilities

## Rules
- Can import from: `@shared/data-access`, `@shared/models`, `@shared/utils`
- Provides admin-level singletons
- Supabase client configuration for admin operations