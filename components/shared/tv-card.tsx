import Link from "next/link";
import { TmdbImage } from "@/components/shared/tmdb-image";
import type { TvShow } from "@/lib/tmdb/types";
import { ROUTES } from "@/lib/constants";
import { formatYear } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Props = {
  show: Pick<TvShow, "id" | "name" | "poster_path" | "first_air_date" | "vote_average">;
  priority?: boolean;
  className?: string;
};

export function TvCard({ show, priority, className }: Props) {
  return (
    <Link
      href={ROUTES.tv.detail(show.id)}
      className={cn("group block cursor-pointer", className)}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-[3px] bg-muted ring-1 ring-border/40 transition-all duration-300 group-hover:ring-primary">
        <TmdbImage
          kind="poster"
          path={show.poster_path}
          alt={show.name}
          fallbackLabel={show.name}
          fill
          priority={priority}
          sizes="(min-width: 1536px) 12vw, (min-width: 1024px) 14vw, (min-width: 768px) 20vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {typeof show.vote_average === "number" && show.vote_average > 0 ? (
          <span className="absolute left-1.5 top-1.5 rounded-sm bg-background/80 px-1.5 py-0.5 font-mono text-[10px] backdrop-blur-sm">
            {show.vote_average.toFixed(1)}
          </span>
        ) : null}
      </div>
      <div className="mt-2 space-y-0.5">
        <p className="line-clamp-1 text-[13px] font-medium leading-tight text-foreground">
          {show.name}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {formatYear(show.first_air_date)}
        </p>
      </div>
    </Link>
  );
}
