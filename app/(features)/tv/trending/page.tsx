import type { Metadata } from "next";
import { tv as tvApi } from "@/lib/tmdb";
import { TvInfiniteList } from "@/components/features/tv/tv-infinite-list";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Trending TV" };
export const revalidate = 3600;

export default async function Page() {
  const data = await tvApi.trending("week");
  return (
    <div className="px-4 py-10 md:px-8">
      <PageHeader eyebrow="This week" title="Trending TV" description="What everyone is watching right now." />
      <TvInfiniteList category="trending" initialData={data} />
    </div>
  );
}
