# Features Layer - Web

Lazy-loaded business capabilities, fully isolated. Each feature is a black box exposed only through routes.

## Structure
- `home/` - Landing page feature
- `blog/` - Blog listing and post features
- `about/` - About page feature
- `contact/` - Contact form feature

## Rules
- All features are lazy-loaded
- No cross-feature TypeScript imports
- Can import from: `core`, `layout`, `ui`, `pattern`, `@shared/*`
- Feature-scoped services via route providers
- Each has its own routes file