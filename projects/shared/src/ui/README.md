# Shared UI Library

Pure presentational components shared across all applications.

## Structure
- `components/` - Reusable UI components
- `directives/` - Custom directives
- `pipes/` - Pure transformation pipes

## Rules
- Only @Input/@Output, no services
- No business logic
- Pure presentation only
- Used by all applications
- Export via public-api.ts

## Architecture
- Standalone components only
- Design system compliance
- Accessibility first
- Themeable with CSS custom properties