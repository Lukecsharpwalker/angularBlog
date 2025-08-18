# Shared Models Library

TypeScript types, interfaces, and data models shared across all applications.

## Structure
- `blog/` - Blog-related types and interfaces
- `user/` - User and authentication types
- `api/` - API request/response types
- `ui/` - UI-specific types
- `supabase/` - Supabase-generated types

## Rules
- Pure TypeScript types only
- No runtime code
- Comprehensive documentation
- Backward compatibility considerations
- Export via public-api.ts

## Architecture
- Domain-driven type organization
- Generated types from Supabase
- Strict typing for all data