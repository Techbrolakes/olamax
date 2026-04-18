"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Image from "next/image";
import { useState } from "react";
import { PlayIcon } from "@phosphor-icons/react";
import type { Image as TmdbImageType, Video } from "@/lib/tmdb/types";
import { TmdbImage } from "@/components/shared/tmdb-image";
import { TrailerButton } from "./trailer-hero";
import { ImageLightbox } from "./image-lightbox";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  videos: Video[];
  images: { backdrops?: TmdbImageType[]; posters?: TmdbImageType[] };
};

const TRAILER_TYPES = new Set(["Trailer", "Teaser"]);

export function MediaTabs({ title, videos, images }: Props) {
  const youtube = videos.filter((v) => v.site === "YouTube");
  const trailers = youtube.filter((v) => TRAILER_TYPES.has(v.type));
  const featurettes = youtube.filter((v) => !TRAILER_TYPES.has(v.type));
  const allImages = [...(images.backdrops ?? []), ...(images.posters ?? [])];

  const trailerCount = trailers.length;
  const featuretteCount = featurettes.length;
  const imageCount = allImages.length;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!trailerCount && !featuretteCount && !imageCount) return null;

  return (
    <section>
      <Tabs.Root defaultValue={trailerCount ? "trailers" : featuretteCount ? "featurettes" : "images"}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="font-serif text-3xl tracking-[-0.02em] md:text-4xl">Media</h2>
          <div className="scrollbar-thin -mx-4 overflow-x-auto px-4 md:mx-0 md:overflow-visible md:px-0">
            <Tabs.List className="inline-flex gap-1 whitespace-nowrap rounded-full border border-border/60 bg-card p-1">
              {trailerCount ? <TabTrigger value="trailers" count={trailerCount}>Trailers</TabTrigger> : null}
              {featuretteCount ? (
                <TabTrigger value="featurettes" count={featuretteCount}>Featurettes</TabTrigger>
              ) : null}
              {imageCount ? <TabTrigger value="images" count={imageCount}>Images</TabTrigger> : null}
            </Tabs.List>
          </div>
        </div>

        <div className="mt-8">
          {trailerCount ? (
            <Tabs.Content value="trailers">
              <VideoGrid videos={trailers} title={title} />
            </Tabs.Content>
          ) : null}

          {featuretteCount ? (
            <Tabs.Content value="featurettes">
              <VideoGrid videos={featurettes} title={title} />
            </Tabs.Content>
          ) : null}

          {imageCount ? (
            <Tabs.Content value="images">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {allImages.slice(0, 16).map((img, i) => (
                  <button
                    key={img.file_path}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className="group relative overflow-hidden rounded-sm bg-muted ring-1 ring-border/40 transition-all hover:ring-primary"
                    style={{ aspectRatio: img.aspect_ratio }}
                  >
                    <TmdbImage
                      kind="backdrop"
                      path={img.file_path}
                      alt=""
                      size="medium"
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="cursor-pointer object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </button>
                ))}
              </div>
              <ImageLightbox
                images={allImages.slice(0, 16)}
                index={lightboxIndex}
                onClose={() => setLightboxIndex(null)}
                onIndexChange={setLightboxIndex}
              />
            </Tabs.Content>
          ) : null}
        </div>
      </Tabs.Root>
    </section>
  );
}

function TabTrigger({
  value,
  children,
  count,
}: {
  value: string;
  children: React.ReactNode;
  count: number;
}) {
  return (
    <Tabs.Trigger
      value={value}
      className={cn(
        "cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground md:px-4 md:text-[11px] md:tracking-[0.18em]",
        "data-[state=active]:bg-foreground data-[state=active]:text-background"
      )}
    >
      {children} <span className="ml-1 opacity-60">{count}</span>
    </Tabs.Trigger>
  );
}

function VideoGrid({ videos, title }: { videos: Video[]; title: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.slice(0, 9).map((v) => (
        <VideoCard key={v.id} video={v} title={title} />
      ))}
    </div>
  );
}

function VideoCard({ video, title }: { video: Video; title: string }) {
  return (
    <div className="group relative overflow-hidden rounded-sm bg-muted ring-1 ring-border/40 transition-all hover:ring-primary">
      <div className="relative aspect-video">
        <Image
          src={`https://i.ytimg.com/vi/${video.key}/hqdefault.jpg`}
          alt={video.name}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/30 transition-colors group-hover:bg-background/10" />
        <div className="absolute inset-0 grid place-items-center">
          <TrailerButton videoKey={video.key} title={`${title} — ${video.name}`} label="" />
        </div>
      </div>
      <div className="space-y-1 p-3">
        <p className="line-clamp-1 text-sm font-medium">{video.name}</p>
        <p className="meta-label">{video.type}</p>
      </div>
    </div>
  );
}

// Small helper: a play-icon overlay for when TrailerButton label is empty
export function PlayOverlay() {
  return (
    <span className="grid h-12 w-12 place-items-center rounded-full bg-foreground text-background">
      <PlayIcon className="h-5 w-5 text-background" weight="fill" />
    </span>
  );
}
