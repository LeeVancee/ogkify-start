# ogkify

ogkify is a full-stack e-commerce application built with TanStack Start. It includes a customer-facing storefront, authentication, shopping cart, checkout flow, Stripe payments, and an admin dashboard for managing products, categories, colors, sizes, and orders.

## Features

- Storefront with home page, product listing, search, product detail pages, cart, checkout, profile, and order history
- Admin dashboard for products, categories, colors, sizes, and order management
- Email/password authentication powered by Better Auth
- PostgreSQL data layer with Drizzle ORM
- Product images and category images through Cloudinary upload widgets
- Stripe checkout/payment intent flow with webhook handling
- Tailwind CSS v4 and shadcn/ui-based interface
- TanStack Router file-based routing and TanStack Query data fetching

## Tech Stack

- **Framework**: TanStack Start, TanStack Router, React 19, Vite
- **Database**: PostgreSQL, Drizzle ORM, Drizzle Kit
- **Authentication**: Better Auth with admin plugin
- **Payments**: Stripe
- **Uploads**: Cloudinary upload widget, optional UploadThing token support
- **UI**: Tailwind CSS v4, shadcn/ui, Base UI, lucide-react, Sonner
- **Validation and Forms**: Zod, React Hook Form, TanStack Form
- **Tooling**: TypeScript, Vitest, oxlint, oxfmt, pnpm

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database
- Stripe account for payment testing
- Cloudinary account for image uploads

### Install Dependencies

```bash
pnpm install
```

### Configure Environment Variables

Create a local environment file:

```bash
cp .env.example .env
```

Fill in the required values:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

BETTER_AUTH_SECRET="your-auth-secret"

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."

VITE_BASE_URL="http://localhost:3000"

VITE_CLOUDINARY_CLOUD_NAME="your-cloud-name"
VITE_CLOUDINARY_UPLOAD_PRESET="your-upload-preset"

UPLOADTHING_TOKEN="optional-uploadthing-token"
```

`UPLOADTHING_TOKEN` is optional in the server environment schema. Cloudinary variables are required by the client-side upload components.

### Set Up the Database

Push the Drizzle schema to your database:

```bash
pnpm db:push
```

Optionally seed demo catalog data:

```bash
pnpm db:seed
```

Open Drizzle Studio when you need to inspect or edit records:

```bash
pnpm db:studio
```

### Run the App

```bash
pnpm dev
```

The development server runs at:

```txt
http://localhost:3000
```

If Vite cache causes stale behavior, start with a clean cache:

```bash
pnpm dev:clean
```

## Common Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server on port 3000 |
| `pnpm dev:clean` | Clear Vite cache and start the dev server |
| `pnpm build` | Build the production application |
| `pnpm start` | Run the built production server |
| `pnpm start:local` | Run the built server with `.env` loaded |
| `pnpm test` | Run Vitest tests |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm lint` | Run oxlint |
| `pnpm lint:fix` | Fix lint issues with oxlint |
| `pnpm format` | Check formatting with oxfmt |
| `pnpm format:fix` | Format files with oxfmt |
| `pnpm check` | Fix lint issues and format files |
| `pnpm db:push` | Push Drizzle schema changes |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm db:seed` | Seed demo catalog data |

## Project Structure

```txt
src/
  components/
    dashboard/       Admin dashboard UI
    shop/            Storefront, product, cart, checkout, and order UI
    shared/          Shared application components
    ui/              shadcn/ui primitives
  db/
    schema.ts        Drizzle schema and relations
    seed.ts          Demo data seed script
  env/
    client.ts        Public client environment schema
    server.ts        Server-only environment schema
  lib/
    auth.ts          Better Auth configuration
  routes/
    (auth)/          Login and signup routes
    (shop)/          Customer storefront routes
    api/             API endpoints and webhooks
    dashboard/       Admin dashboard routes
  server/
    *.ts             Server functions for data queries and mutations
```

## Routing

Routes are file-based through TanStack Router:

- `src/routes/(shop)` contains the storefront, product listing, cart, checkout, profile, and customer order pages.
- `src/routes/dashboard` contains admin pages for managing catalog resources and orders.
- `src/routes/(auth)` contains login and signup pages.
- `src/routes/api/auth.$.ts` exposes Better Auth handlers.
- `src/routes/api/webhooks/stripe.ts` handles Stripe webhook events.

## Data Model

The database schema is defined in `src/db/schema.ts`. Core tables include:

- `user`, `session`, `account`, `verification` for Better Auth
- `products`, `categories`, `images`
- `colors`, `sizes`, and product relationship tables
- `carts`, `cart_items`
- `orders`, `order_items`

Order status and payment status are represented with PostgreSQL enums.

## Authentication and Admin Access

Authentication is configured in `src/lib/auth.ts` with Better Auth email/password login and the admin plugin. Dashboard routes should be protected by the existing server-side admin/session checks.

## Payments and Webhooks

Stripe keys are required for checkout and payment status updates. In local development, forward Stripe webhook events to:

```txt
http://localhost:3000/api/webhooks/stripe
```

Then set the generated webhook signing secret as `STRIPE_WEBHOOK_SECRET`.

## Production Build

Build the app:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

For local production testing with `.env` loaded:

```bash
pnpm start:local
```

## Development Notes

- Use server functions in `src/server` for database-backed operations.
- Use Drizzle ORM for type-safe database queries.
- Keep customer-facing UI in `src/components/shop` and admin UI in `src/components/dashboard`.
- Use Tailwind CSS utilities and `cn()` from `src/lib/utils.ts` for conditional classes.
- Prefer existing shadcn/ui components in `src/components/ui` before adding new UI primitives.
