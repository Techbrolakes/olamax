import type { Metadata } from "next";
import { people } from "@/lib/tmdb";
import { PageHeader } from "@/components/shared/page-header";
import { PopularActorsList } from "@/components/features/actors/popular-actors-list";

export const metadata: Metadata = { title: "Popular actors" };
export const revalidate = 3600;

export default async function PopularActorsPage() {
  const data = await people.popular();
  return (
    <div className="px-4 py-10 md:px-8">
      <PageHeader eyebrow="People" title="Popular" />
      <PopularActorsList initialData={data} />
    </div>
  );
}
