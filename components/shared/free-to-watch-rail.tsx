import Link from "next/link";
import { Play } from "lucide-react";
import { listFreeToWatch } from "@/lib/public-domain";
import { movies as moviesApi } from "@/lib/tmdb";
import { TmdbImage } from "@/components/shared/tmdb-image";
import { ROUTES } from "@/lib/constants";

export async function FreeToWatchRail() {
  const films = listFreeToWatch();
  if (!films.length) return null;

  const hydrated = await Promise.all(
    films.map(async (f) => ({
      film: f,
      details: await moviesApi.details(f.tmdbId).catch(() => null),
    }))
  );

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between px-4 md:px-8">
        <div>
          <p className="meta-label mb-1 text-primary">Free to watch</p>
          <h2 className="font-serif text-2xl tracking-[-0.02em] md:text-3xl">
            <span className="italic">Public domain</span> classics
          </h2>
        </div>
        <Link href={ROUTES.watch.index} className="meta-label cursor-pointer hover:text-foreground">
          See all →
        </Link>
      </div>

      <div className="scrollbar-thin flex gap-3 overflow-x-auto scroll-smooth px-4 pb-4 md:px-8">
        {hydrated.map(({ film, details }) => (
          <Link
            key={film.slug}
            href={ROUTES.watch.detail(film.slug)}
            className="group w-[128px] flex-none cursor-pointer md:w-[150px] lg:w-[170px]"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-[3px] bg-muted ring-1 ring-border/40 transition-all duration-300 group-hover:ring-primary">
              <TmdbImage
                kind="poster"
                path={details?.poster_path ?? film.posterPath}
                alt={film.title}
                fallbackLabel={film.title}
                fill
                sizes="(min-width: 1024px) 12vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-sm bg-primary/90 px-1.5 py-0.5 font-mono text-[10px] text-primary-foreground">
                <Play className="h-2.5 w-2.5 fill-current" />
                FREE
              </span>
            </div>
            <div className="mt-2 space-y-0.5">
              <p className="line-clamp-1 text-[13px] font-medium leading-tight">{film.title}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {film.year}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
