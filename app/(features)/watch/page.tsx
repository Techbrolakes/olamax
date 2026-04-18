import type { Metadata } from "next";
import Link from "next/link";
import { PlayIcon } from "@phosphor-icons/react/ssr";
import { listFreeToWatch } from "@/lib/public-domain";
import { movies as moviesApi } from "@/lib/tmdb";
import { TmdbImage } from "@/components/shared/tmdb-image";
import { PageHeader } from "@/components/shared/page-header";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Free to watch",
  description: "Public-domain films streaming free on OlaMax — courtesy of the Internet Archive.",
};

export const revalidate = 3600;

export default async function WatchIndexPage() {
  const films = listFreeToWatch();
  const hydrated = await Promise.all(
    films.map(async (f) => ({
      film: f,
      details: await moviesApi.details(f.tmdbId).catch(() => null),
    }))
  );

  return (
    <div className="px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Free to watch"
        title="Public domain"
        description="A small shelf of films that have passed into the public domain — streaming straight from the Internet Archive, no sign-in required."
      />

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {hydrated.map(({ film, details }) => (
          <Link
            key={film.slug}
            href={ROUTES.watch.detail(film.slug)}
            className="group block cursor-pointer"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-[3px] bg-muted ring-1 ring-border/40 transition-all duration-300 group-hover:ring-primary">
              <TmdbImage
                kind="poster"
                path={details?.poster_path ?? film.posterPath}
                alt={film.title}
                fallbackLabel={film.title}
                size="large"
                fill
                sizes="(min-width: 1024px) 18vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
                  <PlayIcon className="h-5 w-5" weight="fill" />
                </span>
              </div>
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-sm bg-primary/90 px-1.5 py-0.5 font-mono text-[10px] text-primary-foreground">
                <PlayIcon className="h-2.5 w-2.5" weight="fill" /> FREE
              </span>
            </div>
            <div className="mt-3 space-y-1">
              <p className="line-clamp-1 font-serif text-lg italic leading-tight">{film.title}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {film.year}
                {film.director ? ` · ${film.director}` : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
