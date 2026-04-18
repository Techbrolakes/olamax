import Link from "next/link";
import type { Movie } from "@/lib/tmdb/types";
import { MovieCard } from "./movie-card";

type Props = {
  title: string;
  seeAllHref?: string;
  movies: Movie[];
  priority?: boolean;
};

export function MovieRail({ title, seeAllHref, movies, priority }: Props) {
  if (!movies.length) return null;
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between px-4 md:px-8">
        <h2 className="font-serif text-2xl tracking-[-0.02em] md:text-3xl">{title}</h2>
        {seeAllHref ? (
          <Link href={seeAllHref} className="meta-label cursor-pointer hover:text-foreground">
            See all →
          </Link>
        ) : null}
      </div>
      <div className="relative">
        <div className="scrollbar-thin flex gap-3 overflow-x-auto scroll-smooth px-4 pb-4 md:px-8">
          {movies.map((movie, i) => (
            <div
              key={movie.id}
              className="w-[128px] flex-none md:w-[150px] lg:w-[170px]"
            >
              <MovieCard movie={movie} priority={priority && i < 6} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
