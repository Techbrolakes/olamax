# OlaMax

**Editorial film discovery with an AI concierge.**

Describe a vibe and let the AI find your next film. OlaMax mixes a restrained, editorial browsing experience (TMDB data, Instrument Serif typography, Geist body) with an AI layer that recommends from your taste profile, writes deep-dive articles on any movie, and curates films by mood.

## Highlights

- **🎬 AI Film Concierge** — chat-based film search at `/concierge`. Ask for a vibe ("slow-burn neo-noir with a female lead"), a reference ("something like Memories of Murder but lighter"), or a mood, and get grounded recommendations rendered as tappable movie cards. Chat history persists across reloads via localStorage.
- **✨ "For you" taste profile** — weighted embedding centroid built from your ratings + watchlist (pgvector on Neon). Personalised "Tuned to your taste" rail on `/movies`, and a streaming editorial blurb on every movie page referencing your loved films by name.
- **🎲 Pick for me** — one-click shuffle on the home page that mixes trending, popular, top-rated, now-playing, upcoming + your taste vector via stratified sampling, so each click genuinely varies.
- **📖 AI deep dives** — per-movie structured article (pitch · context · worth noticing · pair it with) that streams on first view and caches in Postgres for instant subsequent loads.
- **🎨 Browse by mood** — curated moods (Cozy, Pulse-pounding, Cerebral, Melancholic, Epic, Romantic, Twisted, Uplifting). Each renders up to 24 films matched by semantic similarity against a pre-embedded seed prompt. Catalog self-heals on cold start.
- **🔍 Smart search pivot** — natural-language queries on `/search` get a one-tap upgrade to the AI concierge (`/concierge?q=…` auto-sends on load).
- **🎞 Classical browsing too** — TV shows, actors, genres, infinite-scroll lists for every category, rich movie/TV detail pages with cast, trailers, watch providers.
- **🔐 Personal surfaces** — sign in with Neon Auth, build a watchlist, keep a private notebook of reviews, upload avatars.

## Stack

- **Framework** · Next.js 15.5 (App Router, Turbopack), React 19, TypeScript strict
- **Auth** · [Neon Auth](https://neon.com/docs/neon-auth/overview) via `@neondatabase/auth` (Better-Auth-backed)
- **Database** · Neon Postgres + Drizzle ORM + **pgvector** for semantic search
- **AI** · [Vercel AI SDK](https://sdk.vercel.ai) (`ai` + `@ai-sdk/react`) via the [AI Gateway](https://vercel.com/docs/ai-gateway) — Anthropic Claude for chat/blurbs, OpenAI `text-embedding-3-small` for embeddings
- **Storage** · Vercel Blob (avatars)
- **Server state** · TanStack Query v5
- **Client state** · Zustand (feature-scoped)
- **UI** · shadcn/ui (`new-york`, neutral), Radix primitives, `@phosphor-icons/react`, `react-markdown` + `remark-gfm`
- **Type** · Instrument Serif (display) · Geist (body) · Geist Mono (metadata)

Third-party movie data courtesy of [TMDB](https://www.themoviedb.org).

## Getting started

```bash
pnpm install
cp env.example .env.local   # fill in values
pnpm db:enable-pgvector     # one-time: enable vector extension on Neon
pnpm db:push                # apply schema
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
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway key (from the Vercel dashboard → AI Gateway → API Keys) |
| `CRON_SECRET` | Shared secret Vercel Cron sends as `Authorization: Bearer <secret>` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3010` in dev, production URL in prod |

### Warm the embedding catalog (optional)

The AI features work best once some movies are embedded into pgvector. A daily cron at `/api/cron/embed-trending` handles this automatically. To warm it immediately:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3010/api/cron/embed-trending
```

Mood pages also self-heal on cold catalogs — first visit embeds 2 pages of trending + popular (~40 titles) inline.

## Scripts

- `pnpm dev` — Turbopack, port 3010
- `pnpm build` / `pnpm start`
- `pnpm lint` / `pnpm lint:fix`
- `pnpm format` / `pnpm format:check`
- `pnpm check-types` — `tsc --noEmit`
- `pnpm db:generate` / `db:migrate` / `db:push` / `db:studio`
- `pnpm db:enable-pgvector` — one-time extension enable on Neon

## Layout

```
app/
  (auth)/                    sign-in, sign-up, account (Neon Auth <AuthView />)
  (features)/
    movies, actors, tv,      browsing surfaces
    genre, search, watch     (with infinite scroll on dedicated list pages)
    mood, concierge          AI surfaces
    watchlist, reviews,      personal surfaces
    profile
  api/
    ai/                      concierge, pick, blurb, deep-dive, mood
    tmdb/                    TMDB proxies
    cron/                    embed-trending
    auth, watchlist,         personal endpoints
    reviews, profile

components/
  ui/                        shadcn primitives
  shared/                    cross-feature (movie-card, actor-card, rails, …)
  layout/                    app-sidebar, mobile-bar (floating pill with AI hump),
                             mobile-header, concierge fab
  features/
    auth, watchlist,         domain modules
    reviews, profile, search
    concierge, recommendations  AI UI surfaces

lib/
  ai/                        gateway, embeddings, taste-vector, concierge-agent,
                             moods, warm-catalog
  auth/                      server.ts, client.ts
  db/
    schema/                  drizzle schemas incl. pgvector tables
    queries/                 typed data access
  tmdb/                      server-only client + types
  blob.ts · query-client.ts · constants.ts · utils.ts
```

House conventions live in [`CLAUDE.md`](./CLAUDE.md).

## License

Private project. All movie metadata © TMDB contributors.
