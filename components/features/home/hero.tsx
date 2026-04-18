import Link from "next/link";
import { ArrowUpRightIcon, PlayIcon } from "@phosphor-icons/react/ssr";
import { movies as moviesApi } from "@/lib/tmdb";
import { TmdbImage } from "@/components/shared/tmdb-image";
import { ROUTES } from "@/lib/constants";
import { formatRating, formatYear } from "@/lib/utils";
import { safe } from "./safe";

export async function Hero() {
  const trending = await safe(moviesApi.trending("week"), {
    page: 1,
    results: [],
    total_pages: 0,
    total_results: 0,
  });
  const hero = trending.results[0];
  if (!hero) return null;

  return (
    <section className="relative isolate h-[78vh] min-h-[520px] overflow-hidden">
      <TmdbImage
        kind="backdrop"
        path={hero.backdrop_path}
        alt=""
        size="original"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="relative flex h-full flex-col justify-end gap-4 px-4 pb-16 md:max-w-2xl md:px-10">
        <p className="meta-label">Featured · Trending this week</p>
        <h1 className="font-serif text-5xl leading-[0.95] tracking-[-0.02em] md:text-7xl">
          <span className="italic">{hero.title}</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="meta-label">{formatYear(hero.release_date)}</span>
          <span className="meta-label">★ {formatRating(hero.vote_average)}</span>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {hero.overview}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={ROUTES.movies.detail(hero.id)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
          >
            <PlayIcon className="h-4 w-4" weight="fill" />
            Details
          </Link>
          <Link
            href={ROUTES.movies.trending}
            className="meta-label inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border/60 px-5 py-2.5 hover:border-border hover:text-foreground"
          >
            More like this <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
