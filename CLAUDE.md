# OlaMax — Engineering Conventions

Editorial film-discovery app. Next.js 15 App Router + React 19 + TS strict.

## Stack

- **Auth**: Neon Auth via `@neondatabase/auth` (Better Auth). Server in `lib/auth/server.ts` (`createNeonAuth`), client in `lib/auth/client.ts` (`createAuthClient`). Handler at `app/api/auth/[...path]/route.ts`. Prebuilt UI: `<AuthView />` at `/sign-in` + `/sign-up`.
- **DB**: Neon Postgres + Drizzle. Schemas in `lib/db/schema/`, queries in `lib/db/queries/`.
- **Storage**: Vercel Blob (`@vercel/blob`) for avatars.
- **TMDB**: Server-only client in `lib/tmdb/`. `TMDB_API_KEY` never leaks to the client; client components go through `app/api/*` proxies.
- **Data fetching**: TanStack Query v5 (client) + RSC fetch (server).
- **Client state**: Zustand, feature-scoped.
- **UI**: shadcn/ui (new-york, neutral, CSS vars), Radix primitives, `lucide-react` (no `Icon` suffix).

## Typography

- `font-serif` → Instrument Serif (headings, hero, movie titles).
- `font-sans` → Geist (body, UI).
- `font-mono` → Geist Mono (metadata, years, runtimes).

Headings default to `font-serif` (see `globals.css`). Metadata rows use the `meta-label` utility.

## Structure

```
app/                      route groups (marketing)/(app), handler/, api/
components/
  ui/                     shadcn primitives
  reusables/              form controls
  shared/                 cross-feature pieces (movie-card, rating-stars, carousel)
  layout/                 navbar, footer, app-sidebar
  providers/              providers.tsx
  features/<name>/        {components,use-<name>.ts,<name>-store.ts,schemas.ts,types.ts}
lib/                      stack, db, tmdb, blob, query-client, utils, constants
hooks/                    cross-cutting hooks
types/                    ApiResponse, ApiError, PaginatedResponse
drizzle/                  migrations
```

## Rules

- **Filenames kebab-case**. PascalCase exports.
- **No `src/`**. `@/*` alias only.
- **No barrel files** — direct imports.
- **No feature-to-feature imports**. Share via `components/shared/` or `lib/`.
- **Every interactive element gets `cursor-pointer`**.
- Always `next/image`, never `<img>`.
- Lucide icons without `Icon` suffix: `import { X, Check } from "lucide-react"`.
- `cn()` for every conditional class.
- Register routes in `lib/constants.ts` → `ROUTES` before linking.
- Forms: RHF + zodResolver + shadcn `<Form>`. Surface async errors via `form.setError("root", …)`.
- Server code imports `server-only` at the top.
- `no-console` — use `console.warn`/`console.error` only.

## Scripts

- `pnpm dev` — Turbopack, port 3010.
- `pnpm check-types` — `tsc --noEmit`.
- `pnpm lint` / `pnpm lint:fix`.
- `pnpm format` / `pnpm format:check`.
- `pnpm db:generate` / `db:migrate` / `db:push` / `db:studio`.

## Env

See `env.example`. `TMDB_API_KEY` is **server-only** — never `NEXT_PUBLIC_`.
