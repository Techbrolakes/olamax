"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TvCard } from "@/components/shared/tv-card";
import type { Paginated, TvShow } from "@/lib/tmdb/types";

type Category = "trending" | "popular" | "top-rated" | "airing-today";

type Props = {
  category: Category;
  initialData: Paginated<TvShow>;
};

const SKELETON_COUNT = 16;

async function fetchPage(category: Category, page: number): Promise<Paginated<TvShow>> {
  const res = await fetch(`/api/tmdb/tv/${category}?page=${page}`);
  if (!res.ok) throw new Error("Failed to load shows");
  return res.json();
}

export function TvInfiniteList({ category, initialData }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["tv", category],
    queryFn: ({ pageParam }) => fetchPage(category, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.total_pages ? last.page + 1 : undefined,
    initialData: { pages: [initialData], pageParams: [1] },
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    if (!hasNextPage || isError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "800px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isError, isFetchingNextPage]);

  const seen = new Set<number>();
  const items = data.pages
    .flatMap((p) => p.results)
    .filter((s) => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });

  return (
    <>
      <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
        {items.map((show, i) => (
          <TvCard key={show.id} show={show} priority={i < 5} />
        ))}
        {isFetchingNextPage
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <TvSkeleton key={`sk-${i}`} delay={i * 60} />
            ))
          : null}
      </div>

      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      <div className="mt-14 flex items-center justify-center">
        {isError ? (
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border/60 px-5 py-2 text-sm transition-colors hover:border-foreground"
          >
            Couldn&apos;t load more — retry
          </button>
        ) : hasNextPage ? (
          <LoadingPill />
        ) : (
          <EndOfListMark />
        )}
      </div>
    </>
  );
}

function TvSkeleton({ delay }: { delay: number }) {
  return (
    <div className="block" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-[3px] bg-muted/60 ring-1 ring-border/40">
        <div className="skeleton-shine absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/[0.07] to-transparent" />
      </div>
      <div className="mt-2 space-y-1.5">
        <div className="animate-pulse-dim h-2.5 w-4/5 rounded-sm bg-muted/70" />
        <div className="animate-pulse-dim h-2 w-2/5 rounded-sm bg-muted/50" />
      </div>
    </div>
  );
}

function LoadingPill() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-background/60 px-4 py-1.5 backdrop-blur">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      <span className="animate-pulse-dim font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
        Loading more
      </span>
    </div>
  );
}

function EndOfListMark() {
  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <span className="block h-px w-10 bg-border" aria-hidden />
      <span className="font-serif text-base italic">fin</span>
      <span className="block h-px w-10 bg-border" aria-hidden />
    </div>
  );
}
