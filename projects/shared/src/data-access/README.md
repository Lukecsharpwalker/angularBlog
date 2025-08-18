# Shared Data Access Layer

API clients, repositories, and data access services shared across applications.

## Structure
- `supabase/` - Supabase client configuration and services
- `api/` - REST API clients
- `repositories/` - Data repository patterns
- `stores/` - NgRx SignalStore implementations

## Rules
- No UI dependencies
- Pure data operations
- Environment-aware (PostgREST vs supabase-js)
- Export via public-api.ts

## Architecture
- Repository pattern for data access
- NgRx SignalStore for state management
- Environment-specific clients