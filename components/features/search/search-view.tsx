"use client";

import { Search as SearchIcon } from "lucide-react";
import { use, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearch } from "./use-search";
import { MovieCard } from "@/components/shared/movie-card";
import { TvCard } from "@/components/shared/tv-card";
import { ActorCard } from "@/components/shared/actor-card";
import { PageHeader } from "@/components/shared/page-header";

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
    <div className="px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Find"
        title="Search"
        description="Films, shows, and the people who make them."
      />

      <div className="relative mb-12">
        <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a film, a show, an actor…"
          className="w-full rounded-full border border-border/60 bg-card py-4 pl-12 pr-6 text-lg text-foreground outline-none transition-colors focus:border-primary"
        />
      </div>

      {!debounced ? (
        <p className="meta-label">Type at least two characters to search.</p>
      ) : isFetching ? (
        <p className="meta-label">Searching…</p>
      ) : (
        <div className="space-y-16">
          {data?.movies.length ? (
            <section className="space-y-6">
              <h2 className="font-serif text-3xl tracking-[-0.02em]">Films</h2>
              <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
                {data.movies.slice(0, 24).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          ) : null}

          {data?.shows.length ? (
            <section className="space-y-6">
              <h2 className="font-serif text-3xl tracking-[-0.02em]">Shows</h2>
              <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
                {data.shows.slice(0, 24).map((show) => (
                  <TvCard key={show.id} show={show} />
                ))}
              </div>
            </section>
          ) : null}

          {data?.people.length ? (
            <section className="space-y-6">
              <h2 className="font-serif text-3xl tracking-[-0.02em]">People</h2>
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
