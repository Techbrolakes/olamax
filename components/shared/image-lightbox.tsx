"use client";

import { useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Image as TmdbImageType } from "@/lib/tmdb/types";
import { TmdbImage } from "@/components/shared/tmdb-image";

type Props = {
  images: TmdbImageType[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (next: number) => void;
};

export function ImageLightbox({ images, index, onClose, onIndexChange }: Props) {
  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < images.length - 1;

  const goPrev = useCallback(() => {
    if (index === null) return;
    if (hasPrev) onIndexChange(index - 1);
  }, [index, hasPrev, onIndexChange]);

  const goNext = useCallback(() => {
    if (index === null) return;
    if (hasNext) onIndexChange(index + 1);
  }, [index, hasNext, onIndexChange]);

  useEffect(() => {
    if (index === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, goPrev, goNext, onClose]);

  if (index === null || !images[index]) return null;
  const current = images[index];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-background/95 backdrop-blur-xl"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="absolute right-6 top-6 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/60 text-foreground hover:border-border"
      >
        <X className="h-4 w-4" />
      </button>

      {hasPrev ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Previous"
          className="absolute left-6 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border/60 text-foreground hover:border-border"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      ) : null}

      {hasNext ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Next"
          className="absolute right-6 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border/60 text-foreground hover:border-border"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      ) : null}

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full max-h-[85vh] w-full max-w-6xl items-center justify-center px-16"
      >
        <div
          className="relative"
          style={{
            aspectRatio: current.aspect_ratio,
            width: "100%",
            maxHeight: "85vh",
          }}
        >
          <TmdbImage
            kind="backdrop"
            path={current.file_path}
            alt=""
            size="original"
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>
      </div>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {index + 1} / {images.length}
      </p>
    </div>
  );
}
