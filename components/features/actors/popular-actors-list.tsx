"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ActorCard } from "@/components/shared/actor-card";
import type { Paginated, Person } from "@/lib/tmdb/types";

type Props = {
  initialData: Paginated<Person>;
};

const SKELETON_COUNT = 16;

async function fetchPage(page: number): Promise<Paginated<Person>> {
  const res = await fetch(`/api/tmdb/people/popular?page=${page}`);
  if (!res.ok) throw new Error("Failed to load actors");
  return res.json();
}

export function PopularActorsList({ initialData }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["people", "popular"],
    queryFn: ({ pageParam }) => fetchPage(pageParam),
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

  const actors = data.pages.flatMap((p) => p.results);

  return (
    <>
      <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
        {actors.map((person) => (
          <ActorCard key={person.id} person={person} />
        ))}
        {isFetchingNextPage
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <ActorSkeleton key={`sk-${i}`} delay={i * 60} />
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

function ActorSkeleton({ delay }: { delay: number }) {
  return (
    <div className="block" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-muted/60 ring-1 ring-border/40">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/[0.07] to-transparent skeleton-shine" />
      </div>
      <div className="mt-2 space-y-1.5">
        <div className="h-2.5 w-4/5 rounded-sm bg-muted/70 animate-pulse-dim" />
        <div className="h-2 w-2/5 rounded-sm bg-muted/50 animate-pulse-dim" />
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
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground animate-pulse-dim">
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
