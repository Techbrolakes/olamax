"use client";

import { useState } from "react";
import Link from "next/link";
import { Dices, RefreshCw, X } from "lucide-react";
import { TmdbImage } from "@/components/shared/tmdb-image";
import type { Movie } from "@/lib/tmdb/types";
import { ROUTES } from "@/lib/constants";
import { formatYear } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Source = "personalized" | "trending";

type Response = {
  picks?: Movie[];
  source?: Source;
  error?: string;
};

export function PickForMe() {
  const [picks, setPicks] = useState<Movie[]>([]);
  const [source, setSource] = useState<Source | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/pick", { cache: "no-store" });
      const data: Response = await res.json();
      if (!res.ok || !data.picks) {
        throw new Error(data.error ?? "Couldn't pick right now");
      }
      setPicks(data.picks);
      setSource(data.source ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't pick right now");
    } finally {
      setLoading(false);
    }
  }

  function dismiss() {
    setPicks([]);
    setSource(null);
    setError(null);
  }

  const hasPicks = picks.length > 0;

  return (
    <section className="px-4 pt-8 pb-4 md:px-10">
      {/* Compact CTA bar */}
      <div className="flex items-center justify-between gap-3 rounded-[5px] border border-border/60 bg-card/40 px-4 py-3 md:px-5 md:py-3.5">
        <div className="min-w-0">
          <p className="meta-label text-primary">OlaMax AI</p>
          <p className="font-serif text-[15px] leading-tight tracking-[-0.01em] text-foreground md:text-base">
            Don&rsquo;t know what to watch?
          </p>
        </div>

        <button
          type="button"
          onClick={pick}
          disabled={loading}
          className={cn(
            "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-[0_4px_14px_-4px_hsl(var(--primary)/0.7)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          {hasPicks ? (
            <>
              <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
              {loading ? "Shuffling" : "Shuffle"}
            </>
          ) : (
            <>
              <Dices className={cn("h-3 w-3", loading && "animate-spin")} />
              {loading ? "Picking" : "Pick for me"}
            </>
          )}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

      {hasPicks && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="meta-label text-muted-foreground">
              {source === "personalized"
                ? "Tuned to your taste"
                : "Handpicked from what's trending"}
            </p>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss picks"
              className="meta-label inline-flex cursor-pointer items-center gap-1 rounded-full border border-border/60 px-2.5 py-1 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              <X className="h-3 w-3" />
              <span>Close</span>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {picks.map((movie) => (
              <PickCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function PickCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={ROUTES.movies.detail(movie.id)}
      className="group block cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-[4px] bg-muted ring-1 ring-border/40 transition-all duration-300 group-hover:ring-primary">
        <TmdbImage
          kind="poster"
          path={movie.poster_path}
          alt={movie.title}
          fallbackLabel={movie.title}
          fill
          sizes="(min-width: 768px) 30vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {typeof movie.vote_average === "number" && movie.vote_average > 0 ? (
          <span className="absolute top-1.5 left-1.5 rounded-sm bg-background/80 px-1.5 py-0.5 font-mono text-[10px] backdrop-blur-sm">
            {movie.vote_average.toFixed(1)}
          </span>
        ) : null}
      </div>
      <div className="mt-2 space-y-0.5">
        <p className="line-clamp-1 text-[13px] font-medium leading-tight text-foreground">
          {movie.title}
        </p>
        <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          {formatYear(movie.release_date)}
        </p>
      </div>
    </Link>
  );
}
