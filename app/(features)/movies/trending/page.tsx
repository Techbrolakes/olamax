import type { Metadata } from "next";
import { movies as moviesApi } from "@/lib/tmdb";
import { MoviesInfiniteList } from "@/components/features/movies/movies-infinite-list";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Trending" };
export const revalidate = 3600;

export default async function TrendingPage() {
  const data = await moviesApi.trending("week");
  return (
    <div className="px-4 py-10 md:px-8">
      <PageHeader eyebrow="This week" title="Trending" description="The films everyone is watching right now." />
      <MoviesInfiniteList category="trending" initialData={data} />
    </div>
  );
}
