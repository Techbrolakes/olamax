import Link from "next/link";
import { TmdbImage } from "@/components/shared/tmdb-image";
import type { Season } from "@/lib/tmdb/types";
import { ROUTES } from "@/lib/constants";
import { formatYear } from "@/lib/utils";

export function SeasonStrip({ showId, seasons }: { showId: number; seasons: Season[] }) {
  const filtered = seasons.filter((s) => s.season_number > 0 || seasons.length === 1);
  if (!filtered.length) return null;
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between px-4 md:px-8">
        <h2 className="font-serif text-3xl tracking-[-0.02em] md:text-4xl">Seasons</h2>
        <p className="meta-label">{filtered.length} total</p>
      </div>
      <div className="scrollbar-thin flex gap-3 overflow-x-auto scroll-smooth px-4 pb-4 md:px-8">
        {filtered.map((s) => (
          <Link
            key={s.id}
            href={ROUTES.tv.season(showId, s.season_number)}
            className="group w-[160px] flex-none cursor-pointer md:w-[180px]"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-[3px] bg-muted ring-1 ring-border/40 transition-all duration-300 group-hover:ring-primary">
              <TmdbImage
                kind="poster"
                path={s.poster_path}
                alt={s.name}
                fallbackLabel={s.name}
                fill
                sizes="180px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-2 space-y-0.5">
              <p className="line-clamp-1 font-serif text-base leading-tight">{s.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {s.episode_count} eps{s.air_date ? ` · ${formatYear(s.air_date)}` : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
