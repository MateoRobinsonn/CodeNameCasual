# Íntimo y Casual

Lencería y ropa interior — tienda en línea para una vendedora en Colombia,
precios en COP, pensada primero para Android Chrome. Ver [AGENTS.md](./AGENTS.md)
para el brief completo de producto y las reglas de negocio.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Supabase (Postgres,
Auth, Storage) · Wompi Colombia (checkout hospedado)

## Estructura

```
app/                  storefront (Spanish routes) + /admin route group
components/           shared UI (header, footer, WhatsApp button)
lib/supabase/         browser/server/admin Supabase clients + generated types
lib/payments/         payment provider adapter (Wompi implementation)
supabase/migrations/  SQL schema + RLS policies
supabase/seed.sql     sample catalog for local dev
scripts/bootstrap-admin.ts   one-time admin user creation (no public signup)
```

## Local setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in the Supabase and Wompi
   values (see "Accounts and setup outside this repo" below).
3. `npm run db:push` to apply migrations to your linked Supabase project
   (or `npm run db:start` first if you're using the local Supabase stack).
4. `npm run db:seed` to load sample products.
5. `npm run bootstrap-admin` to create the single admin user.
6. `npm run dev` and open http://localhost:3000. Admin panel at `/admin/login`.

Without `.env.local` configured, the storefront still renders (catalog shows
an empty state) but `/admin` will say Supabase isn't configured.

## What's built vs. what's next

This scaffold covers step 1 of the AGENTS.md implementation sequence:
Next.js/Tailwind app, Spanish design system shell, database schema, RLS,
admin bootstrap, and seed products. Catalog browsing, cart, checkout,
Wompi webhook wiring, and shipment/notification flows are not implemented
yet — `lib/payments/` only defines the adapter interface and a Wompi
implementation it isn't wired into any route.

## Accounts and setup outside this repo

Creating third-party accounts, verifying a merchant identity, and entering
production secrets isn't something that can be done from the repo. Create a
Supabase project, a Wompi merchant account, and a hosting project (Vercel or
similar), then fill in `.env.local` / the host's environment variables
accordingly.
