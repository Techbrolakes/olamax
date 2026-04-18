import type { Metadata } from "next";
import { tv as tvApi } from "@/lib/tmdb";
import { TvInfiniteList } from "@/components/features/tv/tv-infinite-list";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Top rated TV" };
export const revalidate = 3600;

export default async function Page() {
  const data = await tvApi.topRated();
  return (
    <div className="px-4 py-10 md:px-8">
      <PageHeader eyebrow="Canon" title="Top rated TV" />
      <TvInfiniteList category="top-rated" initialData={data} />
    </div>
  );
}
