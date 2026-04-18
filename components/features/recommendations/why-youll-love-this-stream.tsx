"use client";

import { useEffect, useState } from "react";

export function WhyYoullLoveThisStream({ movieId }: { movieId: number }) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"loading" | "streaming" | "done" | "hidden">(
    "loading"
  );

  useEffect(() => {
    const controller = new AbortController();

    async function stream() {
      try {
        const response = await fetch(`/api/ai/blurb/${movieId}`, {
          signal: controller.signal,
        });
        if (response.status === 204 || response.status === 401) {
          setStatus("hidden");
          return;
        }
        if (!response.ok || !response.body) {
          setStatus("hidden");
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        setStatus("streaming");

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          setText((prev) => prev + decoder.decode(value, { stream: true }));
        }
        setStatus("done");
      } catch (error) {
        if ((error as { name?: string }).name === "AbortError") return;
        console.warn("[why-youll-love-this] stream failed", error);
        setStatus("hidden");
      }
    }

    stream();
    return () => controller.abort();
  }, [movieId]);

  if (status === "hidden") return null;

  return (
    <aside className="relative rounded-[4px] border border-border/60 bg-card/40 p-6 md:p-7">
      <p className="meta-label pb-3 text-primary">For you</p>
      {status === "loading" && <BlurbSkeleton />}
      {status !== "loading" && (
        <p className="font-serif text-lg leading-snug tracking-[-0.01em] text-foreground md:text-xl">
          {text}
          {status === "streaming" && (
            <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-primary align-middle" />
          )}
        </p>
      )}
    </aside>
  );
}

function BlurbSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-5 w-full animate-pulse rounded bg-muted/60" />
      <div className="h-5 w-[92%] animate-pulse rounded bg-muted/60" />
      <div className="h-5 w-[70%] animate-pulse rounded bg-muted/60" />
    </div>
  );
}
