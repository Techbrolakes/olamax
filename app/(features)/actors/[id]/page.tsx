import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { people } from "@/lib/tmdb";
import { TmdbImage } from "@/components/shared/tmdb-image";
import { MovieGrid } from "@/components/shared/movie-grid";
import { formatYear } from "@/lib/utils";

export const revalidate = 3600;

type Params = { id: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const person = await people.details(Number(id));
    return { title: person.name, description: person.biography };
  } catch {
    return { title: "Actor" };
  }
}

export default async function ActorDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const personId = Number(id);
  if (!Number.isFinite(personId)) notFound();

  let person;
  let credits;
  try {
    [person, credits] = await Promise.all([people.details(personId), people.credits(personId)]);
  } catch {
    notFound();
  }

  const known = [...credits.cast]
    .filter((m) => m.poster_path)
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, 20);

  return (
    <div>
      <section className="border-b border-border/60">
        <div className="grid gap-10 px-4 py-10 md:grid-cols-[220px_1fr] md:px-8">
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted">
            <TmdbImage
              kind="profile"
              path={person.profile_path}
              alt={person.name}
              fallbackLabel={person.name}
              size="large"
              fill
              sizes="240px"
              priority
              className="object-cover"
            />
          </div>
          <div className="space-y-5">
            <p className="meta-label">{person.known_for_department}</p>
            <h1 className="font-serif text-5xl leading-[0.95] tracking-[-0.02em] md:text-7xl">
              <span className="italic">{person.name}</span>
            </h1>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {person.birthday ? <p className="meta-label">Born · {formatYear(person.birthday)}</p> : null}
              {person.place_of_birth ? <p className="meta-label">{person.place_of_birth}</p> : null}
            </div>
            {person.biography ? (
              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
                {person.biography.split("\n").slice(0, 3).join("\n\n")}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {known.length ? (
        <section className="px-4 py-10 md:px-8">
          <h2 className="font-serif text-3xl tracking-[-0.02em] md:text-4xl">Known for</h2>
          <div className="mt-8">
            <MovieGrid movies={known} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
