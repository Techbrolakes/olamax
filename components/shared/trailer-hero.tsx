"use client";

import { Play, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  videoKey?: string;
  title: string;
  label?: string;
  className?: string;
};

export function TrailerButton({ videoKey, title, label = "Play trailer", className }: Props) {
  const [open, setOpen] = useState(false);

  if (!videoKey) return null;

  const iconOnly = label === "";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={iconOnly ? `Play ${title}` : undefined}
        className={cn(
          iconOnly
            ? "inline-grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-foreground text-background transition-transform hover:scale-105"
            : "inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90",
          className
        )}
      >
        <Play className={cn("fill-background", iconOnly ? "h-5 w-5" : "h-4 w-4")} />
        {iconOnly ? null : label}
      </button>

      {open ? (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 grid place-items-center bg-background/90 backdrop-blur-xl px-4"
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute -top-12 right-0 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/60 text-foreground hover:border-border"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative aspect-video overflow-hidden rounded-md bg-black ring-1 ring-border">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`}
                title={title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
