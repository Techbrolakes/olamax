import type { Metadata } from "next";
import { SearchView } from "@/components/features/search/search-view";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return <SearchView initial={searchParams} />;
}
