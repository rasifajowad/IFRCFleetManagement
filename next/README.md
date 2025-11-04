# IFRC Fleet Management

Fleet scheduling and trip management for IFRC, built with Next.js (App Router), Prisma, and Neon Postgres.

## Getting Started

From `next/`:

```
npm i
npm run dev:web
```

Environment: set `DATABASE_URL` (Neon) and `AUTH_SECRET` in `next/.env`.

## Structure

- `src/lib`: auth, db, time, csv, roles
- `src/components`: Nav, schedule Timeline, requests/approvals/Admin components
- `src/app`: pages, server actions, API routes
- `middleware.ts`: role-based gating

## Roles & Pages

- Staff: `/my-requests`, `/profile`
- Driver: `/my-trips`, `/profile`
- Officer: `/requests`, `/admin`, CSV at `/api/export/completed`
- Public: `/` (landing), `/schedule`

