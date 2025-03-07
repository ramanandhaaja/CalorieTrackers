# CLAUDE.md - Guidelines for CalorieTracker Project

## Build/Dev Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint checks
- `pnpm generate:types` - Generate TypeScript types
- `pnpm start` - Start production server
- `pnpm devsafe` - Clean .next directory and start dev server

## Code Style Guidelines
- **TypeScript**: Use strict mode, proper type definitions
- **Imports**: Group in order: React, Next.js, third-party, then local imports
- **Components**: Use functional components with proper type definitions
- **Naming**: PascalCase for components, camelCase for functions/variables
- **CSS**: Use Tailwind with proper class organization
- **Error Handling**: Use try/catch blocks for async operations
- **Path Aliases**: Use `@/*` for src directory imports, `@payload-config` for config
- **File Structure**: Components in `/src/components`, pages in app router format

## ESLint Exceptions
- `@typescript-eslint/ban-ts-comment`: Off
- `@typescript-eslint/no-explicit-any`: Off
- `react/no-unescaped-entities`: Off