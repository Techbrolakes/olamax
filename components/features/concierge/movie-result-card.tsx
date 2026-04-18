import Link from "next/link";
import { TmdbImage } from "@/components/shared/tmdb-image";
import { ROUTES } from "@/lib/constants";

export type MovieResult = {
  id: number;
  title: string;
  year: string | null;
  posterPath: string | null;
  overview: string;
  voteAverage: number;
  similarity?: number;
};

export function MovieResultCard({ movie }: { movie: MovieResult }) {
  return (
    <Link
      href={ROUTES.movies.detail(movie.id)}
      className="group flex cursor-pointer gap-3 rounded-[4px] border border-border/60 bg-card/40 p-3 transition-colors hover:border-border hover:bg-card/70 active:bg-card/80 md:gap-4"
    >
      <div className="relative h-[120px] w-[80px] flex-shrink-0 overflow-hidden rounded-sm bg-muted ring-1 ring-border/40 md:h-[135px] md:w-[90px]">
        <TmdbImage
          kind="poster"
          path={movie.posterPath}
          alt={movie.title}
          fallbackLabel={movie.title}
          size="medium"
          fill
          sizes="(max-width: 768px) 80px, 90px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        <p className="meta-label text-muted-foreground">
          {movie.year ?? "—"}
          {movie.voteAverage ? ` · ${movie.voteAverage.toFixed(1)}` : ""}
        </p>
        <h3 className="font-serif text-lg leading-tight tracking-[-0.01em] text-foreground group-hover:underline md:text-xl">
          {movie.title}
        </h3>
        <p className="line-clamp-3 text-[13px] leading-relaxed text-muted-foreground md:text-sm">
          {movie.overview}
        </p>
      </div>
    </Link>
  );
}
