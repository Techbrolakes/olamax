# Sidebar Structural Reduction — Design

**Date:** 2026-04-18
**Status:** Draft — pending user review

## Problem

The app sidebar currently surfaces 12 nav items plus an AI CTA and user avatar. A user reported that the density of icons "feels too much." Inspection confirms the complaint: six of the twelve items are not peers — they are filters or sub-views of the same thing (browse movies), yet they sit at the same visual level as true top-level destinations like Home, Watchlist, and Reviews.

### Current sidebar inventory

**Discover (10):** Home, Search, Moods, Free to watch, Trending, Popular, Top rated, Upcoming, TV Shows, Actors
**You (2):** Watchlist, Reviews
**Bottom:** Ask OlaMax AI (CTA), user avatar

### Root cause

- `Trending`, `Popular`, `Top rated`, `Upcoming` are sub-pages of `/movies`. The `/movies` hub already renders these as chips and "See all" sections.
- `Search` is not a destination — it is a capability that should be available from any page.
- `Free to watch` is a filter/mode, not a peer destination.

These items were promoted to sidebar peers out of convenience, not hierarchy.

## Goals

1. Reduce visible sidebar items from 12 to ~7 without removing any routes.
2. Improve the signal-to-noise ratio when the rail is collapsed (icon-only state).
3. Preserve reachability — every current route remains accessible via a discoverable path.
4. Keep the editorial feel; do not introduce new UI patterns.

## Non-goals

- Redesigning the sidebar visuals (width, colors, typography, hover behavior).
- Redesigning hub pages. `/movies` already has the chip+section layout we rely on; `/tv` is analogous.
- Changing mobile navigation (`mobile-bar.tsx`, `mobile-header.tsx`) — out of scope.
- Changing the Ask OlaMax AI CTA or the user block.

## Proposed structure

### New sidebar

**Discover**
- Home → `/`
- Movies → `/movies` (replaces Trending, Popular, Top rated, Upcoming)
- TV → `/tv` (renamed from "TV Shows" for parity with "Movies")
- Actors → `/actors`
- Moods → `/mood`

**You**
- Watchlist → `/watchlist`
- Reviews → `/reviews`

**Bottom (unchanged)**
- Ask OlaMax AI CTA → `/concierge`
- User block (`SidebarUser`)

Total: 7 nav items + 1 CTA + user.

### Mapping

| Currently | Becomes |
|---|---|
| Home | Home (kept) |
| Search | Removed from sidebar. Lives as a ⌘K command bar accessible from any page. |
| Moods | Moods (kept — distinct discovery mode) |
| Free to watch | Removed from sidebar. Becomes a chip on `/movies` (and `/tv` if desired later). The `/watch` route remains. |
| Trending | Removed. Reachable via `/movies` chip + "See all" link. |
| Popular | Removed. Reachable via `/movies` chip + "See all" link. |
| Top rated | Removed. Reachable via `/movies` chip + "See all" link. |
| Upcoming | Removed. Reachable via `/movies` chip + "See all" link. |
| TV Shows | Renamed to "TV" (kept). |
| Actors | Actors (kept). |
| Watchlist | Watchlist (kept). |
| Reviews | Reviews (kept). |

## Components affected

- `components/layout/app-sidebar.tsx` — Trim `PRIMARY` array from 10 → 5, rename "TV Shows" to "TV". Remove `Search`, `Popcorn` (Free to watch), `Flame` (Trending), `Sparkles` (Popular), `Star` (Top rated), `Clapperboard` (Upcoming) imports.
- `app/(features)/movies/page.tsx` — Add "Free to watch" chip to `CATEGORIES` (pointing to `/watch`). No other changes; structure already matches what we need.
- **Search command bar (⌘K):** new component required. See next section.

## Search: the ⌘K command bar

Search cannot simply be deleted from the sidebar — it must move somewhere. Design:

- **Trigger:** `⌘K` / `Ctrl+K` globally, plus a visible button in the top bar (or top of sidebar) as the affordance. A small search icon or a faux input reading "Search films, actors…  ⌘K".
- **Surface:** a `shadcn/ui` `<CommandDialog>` opened via a client-side provider. Routes typed queries to `/search?q=…` on submit, or surfaces live results inline (V2, out of scope for this spec).
- **V1 scope:** open the dialog, type a query, hit enter → push `/search?q=<query>`. No live autocomplete yet. This is the minimum to remove search from the sidebar without regressing UX.
- **Placement of trigger:** inside the sidebar's top section (where the logo sits) OR in the existing `Navbar`. Existing `Navbar` is the better home since the sidebar is hover-expanded and a ⌘K trigger there is awkward when collapsed. Decision: **trigger lives in `Navbar`**. Confirm during implementation.

## Error handling & edge cases

- **Direct navigation to removed sidebar routes still works.** `/movies/trending`, `/movies/popular`, `/movies/top-rated`, `/movies/upcoming`, `/search`, `/watch` all remain valid routes. We are only changing what the sidebar promotes, not what the router serves.
- **Active-state highlighting for Movies.** The current `SidebarLink` logic highlights a link when `pathname === href || pathname.startsWith(`${href}/`)`. This means `/movies/trending` will highlight the new "Movies" sidebar item — which is the correct behavior. No change needed.
- **TV item renaming.** The label changes from "TV Shows" to "TV"; `aria-current` and `title` follow the label. Verify screen-reader output still reads naturally.
- **Command bar keyboard shortcut conflict.** `⌘K` is near-universal for command palettes (Linear, Notion, Vercel). Low risk; no change expected to browser defaults.

## Testing

- **Visual:** Open the app, confirm sidebar shows exactly 7 nav items in the stated order, plus the Ask OlaMax AI CTA and user block.
- **Navigation smoke:** Click each of the 7 items, confirm correct route loads and the item shows the active indicator.
- **Preserved reachability:** From `/movies`, click each chip (Trending, Popular, Top rated, Upcoming, Free to watch) → confirm navigation. Confirm "See all" links on home sections still work.
- **Command bar:** `⌘K` opens dialog; typing + Enter navigates to `/search?q=…`; Escape closes.
- **Active state on sub-routes:** Navigate to `/movies/trending` → confirm the "Movies" sidebar item is highlighted.
- **Mobile unaffected:** Confirm `mobile-bar.tsx` still renders its own set of tabs with no regressions.

## Rollout

Single PR. No feature flag — this is a layout change with no data migration. Verify on preview deployment before merging to main.

## Open questions

None at spec-write time. Two calls were confirmed during brainstorm:

1. Search moves to ⌘K. Approved.
2. Free to watch demoted to `/movies` chip. Approved.
