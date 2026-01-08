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

## Day 22 – Cleanup

- Verified no code paths reference legacy `counter` table
- Dropped `counter` table from Supabase
- Confirmed app functions unchanged using `counters` table

# Environment Contract

## Browser (public)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Used only for auth UI. Never for database reads/writes.

## Server (user-scoped, RLS enforced)
- SUPABASE_URL
- SUPABASE_ANON_KEY

Used in API routes with session cookies. RLS is always on.

## Server (admin)
- SUPABASE_SERVICE_ROLE_KEY

Not used in this project yet.
Reserved for future admin/background tasks only.
Forbidden for user-owned data paths.


Admin vs User Boundary (Frozen)

This system enforces a strict separation between user-scoped actions and admin/system actions.

User actions

Initiated by the browser

Identity derived only from the session cookie

Handled by Next.js API routes

Always scoped by auth.uid()

Enforced by Row Level Security (RLS)

Never use service role credentials

Never accept userId from the client

If identity matters, RLS must be the final authority.

Admin / system actions

Initiated by the server only

No browser context

No user impersonation

May use service role credentials

Reserved for:

background jobs

webhooks

migrations

system-wide maintenance

Admin paths are not shortcuts for user logic.

Architectural Invariants (Do Not Violate)

The frontend is untrusted

The backend derives identity

The database enforces ownership

Middleware is UX, not security

There is one source of truth per responsibility

No feature may bypass the flow:
Browser → API → Database (RLS)

Any change that violates these rules is a bug, not a feature.

Growth Without Entropy

Before adding new systems (payments, jobs, webhooks):

Existing boundaries must remain intact

No duplicate sources of truth may be introduced

No “temporary” shortcuts are allowed

If something feels unclear, reduce scope instead of adding abstraction

Infrastructure is considered frozen unless explicitly changed on purpose.