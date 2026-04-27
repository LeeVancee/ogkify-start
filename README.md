# ogkify

ogkify is a full-stack e-commerce application built with TanStack Start. It provides a customer storefront for browsing and purchasing products, plus an admin dashboard for managing the store catalog and orders.

## Project Features

- Customer storefront with product listing, product details, search, cart, checkout, profile, and order history
- Admin dashboard for managing products, categories, colors, sizes, and orders
- Email and password authentication with Better Auth
- Product catalog stored in PostgreSQL using Drizzle ORM
- Product image upload support through Cloudinary
- Stripe payment integration with webhook support
- Responsive UI built with Tailwind CSS v4 and shadcn/ui components

## Tech Stack

- **Framework**: TanStack Start, TanStack Router, React, Vite
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM, Drizzle Kit
- **Authentication**: Better Auth
- **Payments**: Stripe
- **Image Uploads**: Cloudinary
- **UI**: Tailwind CSS v4, shadcn/ui, Base UI, lucide-react
- **Forms and Validation**: React Hook Form, TanStack Form, Zod
- **Data Fetching**: TanStack Query
- **Testing**: Vitest
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

Make sure you have the following installed or prepared:

- Node.js 20 or later
- pnpm
- A PostgreSQL database
- A Stripe account for payment testing
- A Cloudinary account for image uploads

### Install Dependencies

```bash
pnpm install
```

### Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then fill in the values in `.env`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

BETTER_AUTH_SECRET="your-better-auth-secret"

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."

VITE_BASE_URL="http://localhost:3000"

VITE_CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
VITE_CLOUDINARY_UPLOAD_PRESET="your-cloudinary-upload-preset"
```

### Environment Variable Reference

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Drizzle |
| `BETTER_AUTH_SECRET` | Yes | Secret key used by Better Auth |
| `STRIPE_SECRET_KEY` | Yes | Stripe server-side secret key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key used on the client |
| `VITE_BASE_URL` | Yes | Base URL of the app, usually `http://localhost:3000` in development |
| `VITE_CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name for image uploads |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Yes | Cloudinary unsigned upload preset |

## Database Setup

Push the Drizzle schema to your database:

```bash
pnpm db:push
```

Seed demo data:

```bash
pnpm db:seed
```

Open Drizzle Studio:

```bash
pnpm db:studio
```

## Run the Project

Start the development server:

```bash
pnpm dev
```

The app will run at:

```txt
http://localhost:3000
```

If you need a clean Vite cache:

```bash
pnpm dev:clean
```

## Build for Production

Create a production build:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

Run the production server locally with `.env` loaded:

```bash
pnpm start:local
```

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server on port 3000 |
| `pnpm dev:clean` | Clear Vite cache and start the dev server |
| `pnpm build` | Build the app for production |
| `pnpm start` | Start the production server |
| `pnpm start:local` | Start the production server with `.env` loaded |
| `pnpm test` | Run tests with Vitest |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm lint` | Run oxlint |
| `pnpm lint:fix` | Fix lint issues |
| `pnpm format` | Check formatting with oxfmt |
| `pnpm format:fix` | Format files |
| `pnpm check` | Fix lint issues and format files |
| `pnpm db:push` | Push database schema changes |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm db:seed` | Seed demo data |

## Project Structure

```txt
src/
  components/
    dashboard/       Admin dashboard components
    shop/            Customer storefront components
    shared/          Shared components
    ui/              Reusable UI primitives
  db/
    schema.ts        Database schema and relations
    seed.ts          Demo data seed script
  env/
    client.ts        Client environment variable schema
    server.ts        Server environment variable schema
  lib/
    auth.ts          Better Auth configuration
  routes/
    (auth)/          Login and signup routes
    (shop)/          Customer-facing routes
    api/             API routes and webhooks
    dashboard/       Admin dashboard routes
  server/
    *.ts             Server-side queries and mutations
```

## Stripe Webhook

For local Stripe webhook testing, forward events to:

```txt
http://localhost:3000/api/webhooks/stripe
```

Set the generated webhook signing secret as `STRIPE_WEBHOOK_SECRET` in `.env`.
