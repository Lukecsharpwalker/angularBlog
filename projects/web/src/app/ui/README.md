# UI Layer - Web

Generic, state-free standalone components using only @Input/@Output. No business logic or services.

## Structure
- `components/` - Reusable UI components
- `directives/` - Custom directives
- `pipes/` - Pure transformation pipes

## Rules
- Only @Input/@Output, no services
- Pure presentation components
- Can import from: `@shared/ui`, `@shared/models` (for types)
- Extract to @shared/ui after 3+ uses across features