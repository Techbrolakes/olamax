import type { Metadata } from "next";
import { movies as moviesApi } from "@/lib/tmdb";
import { MoviesInfiniteList } from "@/components/features/movies/movies-infinite-list";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Top rated" };
export const revalidate = 3600;

export default async function TopRatedPage() {
  const data = await moviesApi.topRated();
  return (
    <div className="px-4 py-10 md:px-8">
      <PageHeader eyebrow="Canon" title="Top rated" description="Films that have earned their place." />
      <MoviesInfiniteList category="top-rated" initialData={data} />
    </div>
  );
}
