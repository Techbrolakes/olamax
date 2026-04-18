"use client";

import Link from "next/link";
import { MagicWandIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { use, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearch } from "./use-search";
import { MovieCard } from "@/components/shared/movie-card";
import { TvCard } from "@/components/shared/tv-card";
import { ActorCard } from "@/components/shared/actor-card";
import { PageHeader } from "@/components/shared/page-header";
import { ROUTES } from "@/lib/constants";

export function SearchView({ initial }: { initial: Promise<{ q?: string }> }) {
  const searchParams = use(initial);
  const [query, setQuery] = useState(searchParams.q ?? "");
  const debounced = useDebounce(query, 250);
  const { data, isFetching } = useSearch(debounced);

  useEffect(() => {
    if (!debounced) return;
    const url = new URL(window.location.href);
    url.searchParams.set("q", debounced);
    window.history.replaceState(null, "", url.toString());
  }, [debounced]);

  const hasResults = Boolean(
    data?.movies.length || data?.shows.length || data?.people.length
  );

  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <PageHeader
        eyebrow="Find"
        title="Search"
        description="Films, shows, and the people who make them."
      />

      <div className="relative mb-3">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a film, show, actor…"
          className="w-full rounded-full border border-border/60 bg-card py-3.5 pl-11 pr-5 text-base text-foreground outline-none transition-colors focus:border-primary md:py-4 md:pl-12 md:pr-6 md:text-lg"
        />
      </div>

      <div className="mb-10 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <p className="meta-label text-muted-foreground">
          Exact titles, cast, and keywords.
        </p>
        {debounced.trim().length > 0 ? (
          <Link
            href={`${ROUTES.concierge}?q=${encodeURIComponent(debounced.trim())}`}
            aria-label="Describe a vibe instead — ask OlaMax AI"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-[12px] font-medium text-primary transition-colors hover:border-primary/70 hover:bg-primary/15"
          >
            <MagicWandIcon className="h-3.5 w-3.5 flex-none" aria-hidden />
            <span aria-hidden className="md:hidden">
              Describe a vibe → AI
            </span>
            <span aria-hidden className="hidden md:inline">
              Describe a vibe instead — ask OlaMax AI →
            </span>
          </Link>
        ) : (
          <Link
            href={ROUTES.concierge}
            aria-label="Ask OlaMax AI"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border/60 px-3.5 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-border hover:text-foreground"
          >
            <MagicWandIcon className="h-3.5 w-3.5 flex-none" aria-hidden />
            <span aria-hidden className="md:hidden">
              Ask OlaMax AI
            </span>
            <span aria-hidden className="hidden md:inline">
              Looking for a vibe? Ask OlaMax AI
            </span>
          </Link>
        )}
      </div>

      {!debounced ? (
        <p className="meta-label">Type at least two characters to search.</p>
      ) : isFetching ? (
        <p className="meta-label">Searching…</p>
      ) : (
        <div className="space-y-10 md:space-y-16">
          {data?.movies.length ? (
            <section className="space-y-6">
              <h2 className="font-serif text-2xl tracking-[-0.02em] md:text-3xl">Films</h2>
              <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
                {data.movies.slice(0, 24).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          ) : null}

          {data?.shows.length ? (
            <section className="space-y-6">
              <h2 className="font-serif text-2xl tracking-[-0.02em] md:text-3xl">Shows</h2>
              <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
                {data.shows.slice(0, 24).map((show) => (
                  <TvCard key={show.id} show={show} />
                ))}
              </div>
            </section>
          ) : null}

          {data?.people.length ? (
            <section className="space-y-6">
              <h2 className="font-serif text-2xl tracking-[-0.02em] md:text-3xl">People</h2>
              <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
                {data.people.slice(0, 24).map((person) => (
                  <ActorCard key={person.id} person={person} />
                ))}
              </div>
            </section>
          ) : null}

          {!hasResults ? (
            <p className="meta-label">Nothing turned up for &ldquo;{debounced}&rdquo;.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
