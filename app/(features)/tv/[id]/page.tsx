import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { tv as tvApi } from "@/lib/tmdb";
import { TmdbImage } from "@/components/shared/tmdb-image";
import { SeasonStrip } from "@/components/shared/season-strip";
import { ScoreDial } from "@/components/shared/score-dial";
import { TrailerButton } from "@/components/shared/trailer-hero";
import { TvRail } from "@/components/shared/tv-rail";
import { MediaTabs } from "@/components/shared/media-tabs";
import { ROUTES } from "@/lib/constants";
import { formatYear } from "@/lib/utils";

export const revalidate = 3600;

type Params = { id: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const show = await tvApi.details(Number(id));
    return { title: show.name, description: show.overview };
  } catch {
    return { title: "TV Show" };
  }
}

export default async function TvDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const tvId = Number(id);
  if (!Number.isFinite(tvId)) notFound();

  let show, credits, similar;
  try {
    [show, credits, similar] = await Promise.all([
      tvApi.details(tvId),
      tvApi.credits(tvId).catch(() => null),
      tvApi.similar(tvId).catch(() => ({ results: [] })),
    ]);
  } catch {
    notFound();
  }

  const creators = show.created_by?.map((c) => c.name) ?? [];
  const trailer =
    show.videos?.results
      .filter((v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"))
      .sort((a, b) => Number(b.official) - Number(a.official))[0] ?? null;

  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <TmdbImage
            kind="backdrop"
            path={show.backdrop_path}
            alt=""
            size="original"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="relative grid gap-10 px-4 pb-14 pt-20 md:grid-cols-[260px_1fr] md:px-8 md:pb-20 md:pt-28 lg:grid-cols-[300px_1fr]">
          <div className="relative mx-auto w-[220px] md:mx-0 md:w-[260px] lg:w-[300px]">
            <div className="relative aspect-[2/3] overflow-hidden rounded-sm bg-muted ring-1 ring-border/40 shadow-2xl">
              <TmdbImage
                kind="poster"
                path={show.poster_path}
                alt={show.name}
                fallbackLabel={show.name}
                size="large"
                fill
                sizes="300px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="space-y-6">
            <p className="meta-label">
              {formatYear(show.first_air_date)}
              {show.last_air_date && show.in_production === false
                ? `–${formatYear(show.last_air_date)}`
                : ""}
              {show.status ? ` · ${show.status}` : ""}
              {show.number_of_seasons ? ` · ${show.number_of_seasons} seasons` : ""}
            </p>

            <h1 className="font-serif text-5xl leading-[0.92] tracking-[-0.02em] md:text-7xl lg:text-[88px]">
              <span className="italic">{show.name}</span>
            </h1>

            <div className="flex flex-wrap gap-2">
              {show.genres.map((g) => (
                <Link
                  key={g.id}
                  href={ROUTES.genre(g.id)}
                  className="meta-label cursor-pointer rounded-full border border-border/60 px-3 py-1.5 transition-colors hover:border-foreground hover:text-foreground"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            <p className="max-w-2xl text-base leading-relaxed text-foreground/90 md:text-lg">
              {show.overview}
            </p>

            <div className="flex flex-wrap items-center gap-6 border-t border-border/60 pt-6">
              <ScoreDial value={show.vote_average} />
              <Stat label="Votes" value={show.vote_count.toLocaleString()} />
              {creators.length ? <Stat label="Created by" value={creators.join(", ")} /> : null}
              {show.networks?.length ? (
                <Stat label="Network" value={show.networks.map((n) => n.name).join(", ")} />
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <TrailerButton videoKey={trailer?.key} title={`${show.name} — trailer`} />
              {show.homepage ? (
                <a
                  href={show.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="meta-label inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border/60 px-4 py-2.5 text-foreground/80 transition-colors hover:border-foreground hover:text-foreground"
                >
                  Official site <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {show.tagline ? (
        <section className="border-y border-border/60 bg-surface/40 px-4 py-14 md:px-8 md:py-20">
          <p className="mx-auto max-w-4xl text-center font-serif text-3xl italic leading-tight tracking-[-0.02em] md:text-5xl">
            &ldquo;{show.tagline}&rdquo;
          </p>
        </section>
      ) : null}

      {show.seasons.length ? (
        <section className="py-12">
          <SeasonStrip showId={show.id} seasons={show.seasons} />
        </section>
      ) : null}

      {(show.videos?.results?.length ?? 0) + (show.images?.backdrops?.length ?? 0) > 0 ? (
        <section className="border-t border-border/60 px-4 py-14 md:px-8">
          <MediaTabs
            title={show.name}
            videos={show.videos?.results ?? []}
            images={{ backdrops: show.images?.backdrops ?? [], posters: show.images?.posters ?? [] }}
          />
        </section>
      ) : null}

      {credits?.cast.length ? (
        <section className="border-t border-border/60 py-12">
          <div className="flex items-end justify-between px-4 md:px-8">
            <h2 className="font-serif text-3xl tracking-[-0.02em] md:text-4xl">Principal cast</h2>
            <p className="meta-label">{credits.cast.length} credited</p>
          </div>
          <div className="scrollbar-thin mt-6 flex gap-3 overflow-x-auto scroll-smooth px-4 pb-4 md:px-8">
            {credits.cast.slice(0, 20).map((person) => (
              <div
                key={person.id}
                className="flex w-[140px] flex-none flex-col"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-muted ring-1 ring-border/40">
                  <TmdbImage
                    kind="profile"
                    path={person.profile_path}
                    alt={person.name}
                    fallbackLabel={person.name}
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                </div>
                <div className="mt-2 space-y-0.5">
                  <p className="line-clamp-1 text-[13px] font-medium leading-tight">{person.name}</p>
                  <p className="line-clamp-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {person.roles?.[0]?.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {similar.results.length ? (
        <section className="border-t border-border/60 py-14">
          <TvRail title="Further watching" shows={similar.results} />
        </section>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="meta-label">{label}</p>
      <p className="line-clamp-2 max-w-[22ch] text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
