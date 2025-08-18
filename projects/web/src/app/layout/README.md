# Layout Layer - Web

Eager shell components that frame routed features. Consumes core services and shared UI components.

## Structure
- `main/` - Main application shell with navigation
- `blog/` - Blog-specific layout wrapper

## Rules
- Can import from: `core`, `@shared/ui`, `@shared/pattern`, `@shared/models`
- Cannot import from: features directly
- Should be eager-loaded shell components