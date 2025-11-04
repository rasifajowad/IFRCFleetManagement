This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Next App Structure (Refactor Summary)

- `src/lib`
  - `auth.ts` – server-side session helpers (create/verify token, getCurrentUser)
  - `edge-auth.ts` – Edge-compatible token verification for middleware
  - `db.ts` – Prisma client
  - `time.ts` – date/hour utilities used by schedule
  - `csv.ts` – CSV escaping and builder
  - `roles.ts` – simple role helpers

- `src/components`
  - `Nav.tsx` – top navigation with session awareness
  - `schedule/Timeline.tsx` – reusable schedule timeline component
  - `requests/RequestForm.tsx` – staff request form
  - `approvals/RequestApprovalCard.tsx` – approval card with assign form
  - `admin/DriverList.tsx` – manage drivers
  - `admin/VehicleAssignmentList.tsx` – assign drivers to vehicles
  - `admin/BookingsTable.tsx` – bookings override + export button

- `src/app`
  - `actions.ts` – server actions (gated by role)
  - `schedule/page.tsx` – SSR schedule view using `Timeline`
  - `my-requests/page.tsx` – staff request view using `RequestForm`
  - `requests/page.tsx` – approvals view using `RequestApprovalCard`
  - `my-trips/page.tsx` – driver trip management
  - `admin/page.tsx` – admin view composed from components
  - `login`, `signup`, `admin/login` – auth screens
  - `api/auth/*` – login/signup/logout
  - `api/export/completed` – CSV export (officer only)

- `middleware.ts` – role-based routing for officer/driver/staff paths

This modular breakdown should make it easier for new contributors to navigate.
