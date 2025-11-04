IFRC Fleet Management (Next.js)

Overview
- Next.js App Router (TypeScript, Tailwind v4).
- Prisma + Neon Postgres. Generated client at `src/generated/prisma`.
- Server Actions for mutations (revalidation for SSR pages).
- Feature-first components under `src/components/*`.

Structure
- `src/app`: Routes, API routes, server actions entry.
- `src/components`
  - `layout`: app shell (sidebar, shells)
  - `admin`, `approvals`, `requests`, `schedule`, `auth`, `calendar`
  - `ui`: headless building blocks (button, input, field, table, dialog, etc.)
- `src/repositories`: thin data access wrappers (Prisma)
- `src/lib`: cross-cutting utils (auth, db, csv, roles, time, utils)
- `src/validation`: zod schemas for form parsing/validation

Server Actions
- Cohesive mutations are defined in `src/app/actions.ts` and imported across pages/components.
- Revalidation: actions call `revalidatePath` for routes that must refresh after a mutation.

Domain flow (key screens)
- Staff: `/my-requests` → submit request (with start/destination). Officer assigns vehicle/driver.
- Officer: `/requests` → approve & assign → updates `/schedule`.
- Driver: `/my-trips` → start/end trip (odometer + locations).
- Schedule: `/schedule` shows calendar + vehicle dashboard.

Conventions
- Feature-first folders under `components/*` for clarity.
- UI elements are headless, Tailwind-based; keep logic and markup small and composable.
- Keep server-only code out of client components (no `cookies()` or Prisma in client files).
- Prefer repositories for DB access from actions; avoid Prisma queries in components.

Local Development
- Dev server (Webpack dev): `npm run dev:web`
- Prisma Client: `npm run prisma:generate`
- Apply migrations: `npx prisma migrate deploy`
- Reset + seed (dev only): `npx prisma migrate reset --force && npm run prisma:seed`

Auth
- Simple session token (HMAC) in `src/lib/auth.ts`.
- Demo users (seed):
  - officer@example.com / secret123
  - driver1@example.com / secret123
  - staff1@example.com / secret123

Refactor roadmap (next)
- Optionally split server actions by domain: `src/actions/{requests,trips,admin}.ts` and re-export from `app/actions.ts`.
- Add stricter types for component props using minimal interfaces.
- Keep migrations and seeds consistent with schema changes.

