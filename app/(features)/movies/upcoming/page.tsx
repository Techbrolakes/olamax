import type { Metadata } from "next";
import { movies as moviesApi } from "@/lib/tmdb";
import { MoviesInfiniteList } from "@/components/features/movies/movies-infinite-list";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Upcoming" };
export const revalidate = 3600;

export default async function UpcomingPage() {
  const data = await moviesApi.upcoming();
  return (
    <div className="px-4 py-10 md:px-8">
      <PageHeader eyebrow="Soon" title="Upcoming" description="What's cutting before it lands." />
      <MoviesInfiniteList category="upcoming" initialData={data} />
    </div>
  );
}
