import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaretLeftIcon } from "@phosphor-icons/react/ssr";
import { tv as tvApi } from "@/lib/tmdb";
import { TmdbImage } from "@/components/shared/tmdb-image";
import { EpisodeRow } from "@/components/shared/episode-row";
import { ROUTES } from "@/lib/constants";
import { formatYear } from "@/lib/utils";

export const revalidate = 3600;

type Params = { id: string; seasonNumber: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id, seasonNumber } = await params;
  try {
    const [show, season] = await Promise.all([
      tvApi.details(Number(id)),
      tvApi.season(Number(id), Number(seasonNumber)),
    ]);
    return { title: `${show.name} · ${season.name}` };
  } catch {
    return { title: "Season" };
  }
}

export default async function SeasonPage({ params }: { params: Promise<Params> }) {
  const { id, seasonNumber } = await params;
  const tvId = Number(id);
  const sNum = Number(seasonNumber);
  if (!Number.isFinite(tvId) || !Number.isFinite(sNum)) notFound();

  let show, season;
  try {
    [show, season] = await Promise.all([tvApi.details(tvId), tvApi.season(tvId, sNum)]);
  } catch {
    notFound();
  }

  return (
    <div className="px-4 py-10 md:px-8">
      <Link
        href={ROUTES.tv.detail(tvId)}
        className="meta-label inline-flex cursor-pointer items-center gap-1 hover:text-foreground"
      >
        <CaretLeftIcon className="h-3.5 w-3.5" /> {show.name}
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-[200px_1fr]">
        <div className="relative aspect-[2/3] w-[160px] overflow-hidden rounded-sm bg-muted ring-1 ring-border/40 md:w-[200px]">
          <TmdbImage
            kind="poster"
            path={season.poster_path ?? show.poster_path}
            alt={season.name}
            fallbackLabel={season.name}
            size="large"
            fill
            sizes="200px"
            className="object-cover"
          />
        </div>
        <div className="space-y-3">
          <p className="meta-label">
            Season {season.season_number} · {season.episodes.length} episodes
            {season.air_date ? ` · ${formatYear(season.air_date)}` : ""}
          </p>
          <h1 className="font-serif text-4xl leading-tight tracking-[-0.02em] md:text-6xl">
            <span className="italic">{season.name}</span>
          </h1>
          {season.overview ? (
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              {season.overview}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-12">
        {season.episodes.map((ep) => (
          <EpisodeRow key={ep.id} episode={ep} />
        ))}
      </div>
    </div>
  );
}
