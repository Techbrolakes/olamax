import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { ArrowUpRightIcon, PlayIcon } from "@phosphor-icons/react/ssr";
import { movies as moviesApi } from "@/lib/tmdb";
import { TmdbImage } from "@/components/shared/tmdb-image";
import { MovieRail } from "@/components/shared/movie-rail";
import { CastRail } from "@/components/shared/cast-rail";
import { ScoreDial } from "@/components/shared/score-dial";
import { TrailerButton } from "@/components/shared/trailer-hero";
import { MediaTabs } from "@/components/shared/media-tabs";
import { WatchProvidersPanel } from "@/components/shared/watch-providers-panel";
import { WatchlistToggle } from "@/components/features/watchlist/watchlist-toggle";
import { ReviewPanel } from "@/components/features/reviews/review-panel";
import { WhyYoullLoveThis } from "@/components/features/recommendations/why-youll-love-this";
import { DeepDive } from "@/components/features/recommendations/deep-dive";
import { getFreeToWatchByTmdbId } from "@/lib/public-domain/queries";
import { formatRuntime, formatYear } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

export const revalidate = 3600;

type Params = { id: string };

async function loadMovie(id: number) {
  try {
    return await Promise.all([
      moviesApi.details(id),
      moviesApi.credits(id),
      moviesApi.similar(id),
      moviesApi.watchProviders(id).catch(() => ({ id, results: {} })),
    ]);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await moviesApi.details(Number(id));
    return { title: movie.title, description: movie.overview };
  } catch {
    return { title: "Movie" };
  }
}

function formatMoney(amount: number) {
  if (!amount) return "—";
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(2)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${amount.toLocaleString()}`;
}

function formatDate(date?: string | null) {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
}

export default async function MovieDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const movieId = Number(id);
  if (!Number.isFinite(movieId)) notFound();

  const loaded = await loadMovie(movieId);
  if (!loaded) notFound();
  const [movie, credits, similar, watchProviders] = loaded;

  const h = await headers();
  const defaultRegion = (h.get("x-vercel-ip-country") ?? "US").toUpperCase();
  const freeFilm = getFreeToWatchByTmdbId(movieId);

  const director = credits.crew.find((c) => c.job === "Director")?.name ?? null;
  const writers = credits.crew
    .filter((c) => c.job === "Screenplay" || c.job === "Writer" || c.department === "Writing")
    .slice(0, 3)
    .map((c) => c.name);
  const cast = credits.cast.slice(0, 20);

  const trailer =
    movie.videos?.results
      .filter((v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"))
      .sort((a, b) => Number(b.official) - Number(a.official))[0] ?? null;

  const hasMedia =
    (movie.videos?.results?.length ?? 0) + (movie.images?.backdrops?.length ?? 0) > 0;
  const hasProviders = Object.keys(watchProviders.results ?? {}).length > 0;

  return (
    <div>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <TmdbImage
            kind="backdrop"
            path={movie.backdrop_path}
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

        <div className="relative grid gap-10 px-4 pb-14 pt-20 md:grid-cols-[260px_1fr] md:px-8 md:pb-16 md:pt-28 lg:grid-cols-[300px_1fr]">
          <div className="relative mx-auto w-[220px] md:mx-0 md:w-[260px] lg:w-[300px]">
            <div className="relative aspect-[2/3] overflow-hidden rounded-sm bg-muted ring-1 ring-border/40 shadow-2xl">
              <TmdbImage
                kind="poster"
                path={movie.poster_path}
                alt={movie.title}
                fallbackLabel={movie.title}
                size="large"
                fill
                sizes="300px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <p className="meta-label">
                {formatYear(movie.release_date)}
                {movie.runtime ? ` · ${formatRuntime(movie.runtime)}` : ""}
                {movie.status && movie.status !== "Released" ? ` · ${movie.status}` : ""}
              </p>
              {movie.adult ? (
                <span className="rounded-sm border border-border/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]">
                  18+
                </span>
              ) : null}
            </div>

            <h1 className="font-serif text-5xl leading-[0.92] tracking-[-0.02em] md:text-7xl lg:text-[80px]">
              <span className="italic">{movie.title}</span>
            </h1>
            {movie.original_title && movie.original_title !== movie.title ? (
              <p className="meta-label">Original · {movie.original_title}</p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => (
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
              {movie.overview}
            </p>

            <div className="flex items-center gap-5 pt-2">
              <ScoreDial value={movie.vote_average} />
              <div className="space-y-0.5 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">
                    {movie.vote_count.toLocaleString()}
                  </span>{" "}
                  votes
                </p>
                <p className="meta-label">TMDB</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {freeFilm ? (
                <Link
                  href={ROUTES.watch.detail(freeFilm.slug)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <PlayIcon className="h-4 w-4" weight="fill" />
                  Watch free
                </Link>
              ) : null}
              <TrailerButton videoKey={trailer?.key} title={`${movie.title} — trailer`} />
              <WatchlistToggle movieId={movie.id} />
              {movie.homepage ? (
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="meta-label inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border/60 px-4 py-2.5 text-foreground/80 transition-colors hover:border-foreground hover:text-foreground"
                >
                  Official <ArrowUpRightIcon className="h-3.5 w-3.5" />
                </a>
              ) : null}
              {movie.imdb_id ? (
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="meta-label inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border/60 px-4 py-2.5 text-foreground/80 transition-colors hover:border-foreground hover:text-foreground"
                >
                  IMDb <ArrowUpRightIcon className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* WHY YOU'LL LOVE THIS — personalized editorial pitch */}
      <section className="px-4 pt-8 md:px-8">
        <div className="mx-auto max-w-4xl">
          <Suspense fallback={null}>
            <WhyYoullLoveThis movieId={movie.id} />
          </Suspense>
        </div>
      </section>

      {/* TAGLINE */}
      {movie.tagline ? (
        <section className="border-y border-border/60 bg-surface/40 px-4 py-12 md:px-8 md:py-16">
          <p className="mx-auto max-w-4xl text-center font-serif text-2xl italic leading-tight tracking-[-0.02em] md:text-4xl">
            &ldquo;{movie.tagline}&rdquo;
          </p>
        </section>
      ) : null}

      {/* WATCH PROVIDERS */}
      {hasProviders ? (
        <section className="px-4 py-12 md:px-8">
          <WatchProvidersPanel
            movieId={movie.id}
            initial={watchProviders}
            defaultRegion={defaultRegion}
          />
        </section>
      ) : null}

      {/* CAST */}
      {cast.length ? (
        <section className={hasProviders ? "border-t border-border/60 py-12" : "py-12"}>
          <CastRail cast={cast} />
        </section>
      ) : null}

      {/* MEDIA */}
      {hasMedia ? (
        <section className="border-t border-border/60 px-4 py-12 md:px-8">
          <MediaTabs
            title={movie.title}
            videos={movie.videos?.results ?? []}
            images={{
              backdrops: movie.images?.backdrops ?? [],
              posters: movie.images?.posters ?? [],
            }}
          />
        </section>
      ) : null}

      {/* DEEP DIVE */}
      <section className="border-t border-border/60 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-4xl">
          <DeepDive movieId={movie.id} />
        </div>
      </section>

      {/* REVIEWS */}
      <section className="border-t border-border/60 px-4 py-12 md:px-8">
        <ReviewPanel movieId={movie.id} />
      </section>

      {/* SIMILAR */}
      {similar.results.length ? (
        <section className="border-t border-border/60 py-12">
          <MovieRail title="Further watching" movies={similar.results} />
        </section>
      ) : null}

      {/* COLOPHON — Facts + Production */}
      <section className="border-t border-border/60 bg-surface/30 px-4 py-14 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="meta-label mb-6">Details</p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3">
              <Fact label="Released" value={formatDate(movie.release_date)} />
              <Fact label="Runtime" value={movie.runtime ? formatRuntime(movie.runtime) : "—"} />
              <Fact label="Language" value={movie.spoken_languages?.[0]?.english_name ?? "—"} />
              {director ? <Fact label="Director" value={director} /> : null}
              {writers.length ? <Fact label="Writing" value={writers.join(", ")} /> : null}
              <Fact label="Status" value={movie.status || "—"} />
              <Fact label="Budget" value={formatMoney(movie.budget)} />
              <Fact label="Box office" value={formatMoney(movie.revenue)} />
            </dl>
          </div>

          {movie.production_companies?.length ? (
            <div>
              <p className="meta-label mb-6">Produced by</p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
                {movie.production_companies.slice(0, 6).map((c) =>
                  c.logo_path ? (
                    <div
                      key={c.id}
                      title={c.name}
                      className="relative h-7 w-24 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0 md:w-28"
                    >
                      <TmdbImage
                        kind="logo"
                        path={c.logo_path}
                        alt={c.name}
                        size="xl"
                        fill
                        sizes="112px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span key={c.id} className="text-sm text-muted-foreground">
                      {c.name}
                    </span>
                  )
                )}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-border/60 pt-3">
      <dt className="meta-label">{label}</dt>
      <dd className="mt-1.5 line-clamp-2 font-serif text-base text-foreground md:text-lg">{value}</dd>
    </div>
  );
}
