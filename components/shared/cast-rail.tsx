import Link from "next/link";
import { TmdbImage } from "@/components/shared/tmdb-image";
import type { Cast } from "@/lib/tmdb/types";
import { ROUTES } from "@/lib/constants";

export function CastRail({ cast }: { cast: Cast[] }) {
  if (!cast.length) return null;
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between px-4 md:px-8">
        <h2 className="font-serif text-3xl tracking-[-0.02em] md:text-4xl">Cast</h2>
        <p className="meta-label">{cast.length} credited</p>
      </div>
      <div className="scrollbar-thin flex gap-3 overflow-x-auto scroll-smooth px-4 pb-3 md:px-8">
        {cast.map((person) => (
          <Link
            key={person.credit_id}
            href={ROUTES.actors.detail(person.id)}
            className="group flex w-[140px] flex-none cursor-pointer flex-col"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-muted ring-1 ring-border/40 transition-all duration-300 group-hover:ring-primary">
              <TmdbImage
                kind="profile"
                path={person.profile_path}
                alt={person.name}
                fallbackLabel={person.name}
                fill
                sizes="140px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-2 space-y-0.5">
              <p className="line-clamp-1 text-[13px] font-medium leading-tight">{person.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground line-clamp-1">
                {person.character}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
