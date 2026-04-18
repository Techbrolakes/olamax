import Link from "next/link";
import { TmdbImage } from "@/components/shared/tmdb-image";
import type { Movie } from "@/lib/tmdb/types";
import { ROUTES } from "@/lib/constants";
import { formatYear } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Props = {
  movie: Pick<Movie, "id" | "title" | "poster_path" | "release_date" | "vote_average">;
  priority?: boolean;
  className?: string;
};

export function MovieCard({ movie, priority, className }: Props) {
  return (
    <Link
      href={ROUTES.movies.detail(movie.id)}
      className={cn("group block cursor-pointer", className)}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-[3px] bg-muted ring-1 ring-border/40 transition-all duration-300 group-hover:ring-primary">
        <TmdbImage
          kind="poster"
          path={movie.poster_path}
          alt={movie.title}
          fallbackLabel={movie.title}
          fill
          priority={priority}
          sizes="(min-width: 1536px) 12vw, (min-width: 1024px) 14vw, (min-width: 768px) 20vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {typeof movie.vote_average === "number" && movie.vote_average > 0 ? (
          <span className="absolute left-1.5 top-1.5 rounded-sm bg-background/80 px-1.5 py-0.5 font-mono text-[10px] backdrop-blur-sm">
            {movie.vote_average.toFixed(1)}
          </span>
        ) : null}
      </div>
      <div className="mt-2 space-y-0.5">
        <p className="line-clamp-1 text-[13px] font-medium leading-tight text-foreground">
          {movie.title}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {formatYear(movie.release_date)}
        </p>
      </div>
    </Link>
  );
}
