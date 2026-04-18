"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { TmdbImage } from "@/components/shared/tmdb-image";
import type { WatchProvider, WatchProvidersByRegion, WatchProvidersResponse } from "@/lib/tmdb/types";
import { getStoredRegion, RegionPicker } from "./region-picker";
import { cn } from "@/lib/utils";

type Props = {
  movieId: number;
  initial: WatchProvidersResponse;
  defaultRegion: string;
};

export function WatchProvidersPanel({ movieId, initial, defaultRegion }: Props) {
  const [region, setRegion] = useState(defaultRegion);

  useEffect(() => {
    const stored = getStoredRegion(defaultRegion);
    if (stored !== region) setRegion(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data } = useQuery({
    queryKey: ["watch-providers", movieId],
    queryFn: async (): Promise<WatchProvidersResponse> => {
      const res = await fetch(`/api/tmdb/watch-providers/${movieId}`);
      if (!res.ok) return initial;
      const body = await res.json();
      return body.data as WatchProvidersResponse;
    },
    initialData: initial,
    staleTime: 5 * 60_000,
  });

  const result = data.results[region] as WatchProvidersByRegion | undefined;
  const fallbackLink = `https://www.themoviedb.org/movie/${movieId}/watch?locale=${region}`;
  const link = result?.link ?? fallbackLink;

  const buckets: Array<{ key: keyof WatchProvidersByRegion; label: string }> = [
    { key: "flatrate", label: "Stream" },
    { key: "rent", label: "Rent" },
    { key: "buy", label: "Buy" },
  ];

  const activeBuckets = buckets.filter(
    (b) => (result?.[b.key] as WatchProvider[] | undefined)?.length
  );

  return (
    <section className="rounded-md border border-border/60 bg-card/60 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="meta-label">Where to watch</p>
          <h2 className="mt-1 font-serif text-2xl tracking-[-0.02em] md:text-3xl">
            Available in <span className="italic">{region}</span>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <RegionPicker value={region} onChange={setRegion} />
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="meta-label inline-flex cursor-pointer items-center gap-1.5 hover:text-foreground"
          >
            Open on TMDB <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {activeBuckets.length ? (
        <div className="mt-8 space-y-6">
          {activeBuckets.map(({ key, label }) => (
            <Bucket
              key={key}
              label={label}
              providers={(result?.[key] as WatchProvider[] | undefined) ?? []}
              link={link}
            />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Not available on any streaming service in {region} yet. Try another region above or{" "}
          <a
            href={fallbackLink}
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer underline-offset-4 hover:underline"
          >
            check TMDB
          </a>
          .
        </p>
      )}
    </section>
  );
}

function Bucket({
  label,
  providers,
  link,
}: {
  label: string;
  providers: WatchProvider[];
  link: string;
}) {
  const sorted = [...providers].sort((a, b) => a.display_priority - b.display_priority);
  return (
    <div>
      <p className="meta-label mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {sorted.map((p) => (
          <a
            key={p.provider_id}
            href={link}
            target="_blank"
            rel="noreferrer"
            title={p.provider_name}
            className={cn(
              "group flex items-center gap-2 rounded-md border border-border/60 bg-background p-1.5 pr-3 transition-all hover:border-foreground hover:-translate-y-0.5"
            )}
          >
            <span className="relative h-10 w-10 overflow-hidden rounded-sm bg-muted">
              <TmdbImage
                kind="logo"
                path={p.logo_path}
                alt={p.provider_name}
                size="medium"
                fill
                sizes="40px"
                className="object-cover"
              />
            </span>
            <span className="text-xs font-medium text-foreground">{p.provider_name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
