# OlaMax

An editorial take on film discovery — browse TMDB, collect a watchlist, keep a
private notebook of reviews. Built with Next.js 15, React 19, and Tailwind v4.

## Stack

- **Framework** · Next.js 15 (App Router, Turbopack), React 19, TypeScript strict
- **Auth** · [Neon Auth](https://neon.com/docs/neon-auth/overview) via `@neondatabase/auth` (Better-Auth-backed)
- **Database** · Neon Postgres + Drizzle ORM
- **Storage** · Vercel Blob (avatars)
- **Server state** · TanStack Query v5
- **Client state** · Zustand (feature-scoped)
- **UI** · shadcn/ui (`new-york`, neutral), Radix primitives, `lucide-react`
- **Type** · Instrument Serif (display) · Geist (body) · Geist Mono (metadata)

Third-party movie data courtesy of [TMDB](https://www.themoviedb.org).

## Getting started

```bash
pnpm install
cp env.example .env.local   # fill in values
pnpm db:push                # apply schema to Neon
pnpm dev                    # http://localhost:3010
```

### Required env vars

| Var | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon pooled Postgres connection string |
| `NEON_AUTH_BASE_URL` | Neon Auth endpoint from the Neon console → Auth |
| `NEON_AUTH_COOKIE_SECRET` | 32+ char random string for session cookies |
| `TMDB_API_KEY` | TMDB v3 key (server-only) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3010` in dev |

## Scripts

- `pnpm dev` — Turbopack, port 3010
- `pnpm build` / `pnpm start`
- `pnpm lint` / `pnpm lint:fix`
- `pnpm format` / `pnpm format:check`
- `pnpm check-types` — `tsc --noEmit`
- `pnpm db:generate` / `db:migrate` / `db:push` / `db:studio`

## Layout

```
app/
  (auth)/        sign-in, sign-up, account (Neon Auth <AuthView />)
  (features)/    movies, actors, genre, search, watchlist, reviews, profile
  api/           auth catch-all, watchlist, reviews, profile, avatar, tmdb proxy
components/
  ui/            shadcn primitives
  shared/        cross-feature pieces (movie-card, actor-card, rating-stars, …)
  layout/        navbar, footer, nav-user
  features/      auth, watchlist, reviews, profile, search
  providers/     providers.tsx (QueryClient)
lib/
  auth/          server.ts, client.ts
  db/            schema, queries, drizzle index
  tmdb/          server-only TMDB client + types
  blob.ts · query-client.ts · constants.ts · utils.ts
```

House conventions live in `CLAUDE.md`.
