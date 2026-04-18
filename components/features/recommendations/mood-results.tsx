"use client";

import { useEffect, useState } from "react";
import { MovieCard } from "@/components/shared/movie-card";
import type { Movie } from "@/lib/tmdb/types";

type Props = { slug: string };

type Response =
  | { mood: { slug: string; name: string }; picks: Movie[] }
  | { error: string };

export function MoodResults({ slug }: Props) {
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "ready"; picks: Movie[] }
    | { status: "empty" }
    | { status: "error"; message: string }
  >({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setState({ status: "loading" });
      try {
        const res = await fetch(`/api/ai/mood/${slug}`);
        const data: Response = await res.json();
        if (cancelled) return;
        if (!res.ok || "error" in data) {
          setState({
            status: "error",
            message:
              "error" in data
                ? `Couldn't load (${data.error})`
                : "Couldn't load this mood.",
          });
          return;
        }
        if (data.picks.length === 0) {
          setState({ status: "empty" });
          return;
        }
        setState({ status: "ready", picks: data.picks });
      } catch {
        if (!cancelled) setState({ status: "error", message: "Network error." });
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.status === "loading") {
    return (
      <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="block" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="relative aspect-[2/3] overflow-hidden rounded-[3px] bg-muted/60 ring-1 ring-border/40">
              <div className="skeleton-shine absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/[0.07] to-transparent" />
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="animate-pulse-dim h-2.5 w-4/5 rounded-sm bg-muted/70" />
              <div className="animate-pulse-dim h-2 w-2/5 rounded-sm bg-muted/50" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (state.status === "error") {
    return <p className="text-sm text-muted-foreground">{state.message}</p>;
  }

  if (state.status === "empty") {
    return (
      <div className="rounded-[6px] border border-border/60 bg-card/40 p-5 text-sm text-muted-foreground">
        <p>
          Couldn&rsquo;t find matches for this mood right now. Try another — or come back in a
          minute while OlaMax finishes indexing the catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
      {state.picks.map((movie, i) => (
        <MovieCard key={movie.id} movie={movie} priority={i < 5} />
      ))}
    </div>
  );
}
