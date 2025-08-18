# Core Layer - Web Application

Application-wide singletons, DI setup, domain services, state, and initialization logic.

## Structure
- `auth/` - Authentication services, guards, tokens
- `http/` - HTTP interceptors and global request/response handling
- `utils/` - Pure utility functions (dates, parsing, etc.)

## Rules
- Can import from: `@shared/data-access`, `@shared/models`, `@shared/utils`
- Cannot import from: features, UI components, patterns
- Provides application-level singletons via `provideCore()`