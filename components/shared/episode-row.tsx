import { TmdbImage } from "@/components/shared/tmdb-image";
import type { Episode } from "@/lib/tmdb/types";
import { formatRuntime } from "@/lib/utils";

export function EpisodeRow({ episode }: { episode: Episode }) {
  return (
    <article className="grid grid-cols-[120px_1fr] gap-4 border-t border-border/60 py-6 md:grid-cols-[220px_1fr] md:gap-6">
      <div className="relative aspect-video overflow-hidden rounded-[3px] bg-muted ring-1 ring-border/40">
        <TmdbImage
          kind="still"
          path={episode.still_path}
          alt={episode.name}
          fallbackLabel={episode.name}
          fill
          sizes="(min-width: 768px) 220px, 120px"
          className="object-cover"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            E{String(episode.episode_number).padStart(2, "0")}
          </span>
          {episode.runtime ? (
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {formatRuntime(episode.runtime)}
            </span>
          ) : null}
          {typeof episode.vote_average === "number" && episode.vote_average > 0 ? (
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              ★ {episode.vote_average.toFixed(1)}
            </span>
          ) : null}
        </div>
        <h3 className="font-serif text-xl leading-tight md:text-2xl">{episode.name}</h3>
        {episode.overview ? (
          <p className="line-clamp-3 text-sm text-muted-foreground md:line-clamp-none md:text-base">
            {episode.overview}
          </p>
        ) : null}
      </div>
    </article>
  );
}
