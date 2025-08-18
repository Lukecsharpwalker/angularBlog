# Pattern Layer - Web

Drop-in reusable patterns: packaged standalone components + services, consumed by features and layouts.

## Structure
- `blog-reader/` - Blog reading experience pattern
- `comment-system/` - Comment functionality pattern
- `search/` - Search functionality pattern

## Rules
- Can import from: `core`, `ui`, `@shared/*`
- Self-contained functionality with services + components
- Used by features via composition