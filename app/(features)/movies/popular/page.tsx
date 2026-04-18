import type { Metadata } from "next";
import { movies as moviesApi } from "@/lib/tmdb";
import { MoviesInfiniteList } from "@/components/features/movies/movies-infinite-list";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Popular" };
export const revalidate = 3600;

export default async function PopularPage() {
  const data = await moviesApi.popular();
  return (
    <div className="px-4 py-10 md:px-8">
      <PageHeader eyebrow="Crowd favourites" title="Popular" />
      <MoviesInfiniteList category="popular" initialData={data} />
    </div>
  );
}
