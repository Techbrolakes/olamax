import Link from "next/link";
import { TmdbImage } from "@/components/shared/tmdb-image";
import type { Person } from "@/lib/tmdb/types";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = {
  person: Pick<Person, "id" | "name" | "profile_path" | "known_for_department">;
  className?: string;
};

export function ActorCard({ person, className }: Props) {
  return (
    <Link
      href={ROUTES.actors.detail(person.id)}
      className={cn("group block cursor-pointer", className)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-muted ring-1 ring-border/40 transition-all duration-300 group-hover:ring-primary">
        <TmdbImage
          kind="profile"
          path={person.profile_path}
          alt={person.name}
          fallbackLabel={person.name}
          fill
          sizes="(min-width: 1024px) 14vw, (min-width: 768px) 20vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-2 space-y-0.5">
        <p className="line-clamp-1 text-[13px] font-medium leading-tight">{person.name}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {person.known_for_department}
        </p>
      </div>
    </Link>
  );
}
