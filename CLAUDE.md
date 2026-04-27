# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **ogkify**, a full-stack e-commerce application built with TanStack Start (React full-stack framework). It's an online store with admin dashboard for managing products, categories, colors, sizes, and orders.

## Key Technologies

- **Framework**: TanStack Start with TanStack Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Payment**: Stripe integration
- **File Upload**: Cloudinary
- **State Management**: TanStack Query
- **Package Manager**: pnpm

## Essential Commands

### Development

```bash
pnpm dev              # Start dev server on port 3000
pnpm dev:clean        # Clean start with cache cleared
pnpm build            # Build for production
pnpm start            # Start production server
pnpm test             # Run tests with Vitest
```

### Code Quality

```bash
pnpm lint             # Run ESLint
pnpm format           # Run Prettier
pnpm check            # Format and fix linting issues
```

### Database

```bash
pnpm db:push          # Push schema changes to database
pnpm db:studio        # Open Drizzle Studio for database management
```

## Architecture

### File-Based Routing

Routes are defined in `src/routes/` using TanStack Router:

- `_shop/` - Customer-facing routes (products, cart, checkout)
- `dashboard/` - Admin routes (manage products, orders, etc.)
- `auth.tsx` - Authentication page
- `api/` - API endpoints

### Database Schema

Located in `src/db/schema.ts` with comprehensive e-commerce entities:

- Users, authentication tables (Better Auth)
- Products with categories, colors, sizes (many-to-many relationships)
- Shopping cart and order management
- Images linked to products

### Component Organization

- `src/components/ui/` - shadcn/ui base components
- `src/components/auth/` - Authentication components
- `src/components/dashboard/` - Admin dashboard components
- `src/components/shop/` - Customer-facing components
- `src/components/shared/` - Reusable components

### Server Functions

Server-side logic in `src/server/` organized by feature:

- `*.server.ts` files handle data fetching and mutations
- Use Drizzle ORM for database operations
- Follow server/client data flow patterns

## Development Patterns

### Data Fetching

Use TanStack Query for client-side state management:

```tsx
const { data, isLoading } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
});
```

### Authentication

Better Auth is configured in `src/lib/auth.ts`. Use throughout the app for user management and session handling.

### Database Operations

Use Drizzle ORM with type-safe queries. Schema relationships are fully defined in `src/db/schema.ts`.

### Form Handling

Uses React Hook Form with Zod validation. See existing forms in dashboard components for patterns.

### Styling

- Tailwind CSS v4 with CSS variables for theming
- Use `cn()` utility from `src/lib/utils.ts` for conditional classes
- shadcn/ui components provide base UI elements

## Important Notes

- This is a full-stack application with both customer and admin interfaces
- Authentication is required for both shop (customers) and dashboard (admin)
- Database schema supports complex e-commerce relationships
- Payment processing is handled through Stripe
- File uploads use Cloudinary
- All forms use proper validation and error handling

## Testing

Run tests with `pnpm test` using Vitest. Test files follow standard naming conventions.
