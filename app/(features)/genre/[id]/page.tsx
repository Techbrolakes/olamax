import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { movies as moviesApi } from "@/lib/tmdb";
import { MovieGrid } from "@/components/shared/movie-grid";
import { PageHeader } from "@/components/shared/page-header";

export const revalidate = 3600;

type Params = { id: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const { genres } = await moviesApi.genres();
    const genre = genres.find((g) => g.id === Number(id));
    return { title: genre?.name ?? "Genre" };
  } catch {
    return { title: "Genre" };
  }
}

export default async function GenrePage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const genreId = Number(id);
  if (!Number.isFinite(genreId)) notFound();

  const [{ genres }, data] = await Promise.all([moviesApi.genres(), moviesApi.byGenre(genreId)]);
  const genre = genres.find((g) => g.id === genreId);
  if (!genre) notFound();

  return (
    <div className="px-4 py-10 md:px-8">
      <PageHeader eyebrow="Genre" title={genre.name} />
      <MovieGrid movies={data.results} priorityCount={5} />
    </div>
  );
}
