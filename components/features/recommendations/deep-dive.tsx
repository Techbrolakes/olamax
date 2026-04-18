"use client";

import { useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { MarkdownMessage } from "@/components/features/concierge/markdown-message";
import { cn } from "@/lib/utils";

export function DeepDive({ movieId }: { movieId: number }) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "streaming" | "done" | "error">(
    "idle"
  );

  async function load() {
    if (status === "loading" || status === "streaming") return;
    setStatus("loading");
    setText("");

    try {
      const response = await fetch(`/api/ai/deep-dive/${movieId}`);
      if (response.status === 204) {
        setStatus("error");
        return;
      }
      if (!response.ok || !response.body) {
        setStatus("error");
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
    } catch {
      setStatus("error");
    }
  }

  if (status === "idle") {
    return (
      <div className="rounded-[6px] border border-border/60 bg-card/40 p-6 md:p-7">
        <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="meta-label text-primary">OlaMax AI</p>
            <h3 className="mt-1 font-serif text-xl tracking-[-0.01em] md:text-2xl">
              Want the deep dive?
            </h3>
            <p className="pt-1.5 text-sm text-muted-foreground">
              Editorial context, craft details, and films that share its DNA.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_6px_20px_-4px_hsl(var(--primary)/0.7)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <BookOpen className="h-4 w-4" />
            Read the deep dive
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[6px] border border-border/60 bg-card/40 p-6 md:p-7">
      <div className="flex items-center justify-between pb-4">
        <p className="meta-label text-primary">Deep dive</p>
        {(status === "loading" || status === "streaming") && (
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            {status === "loading" ? "Generating" : "Writing"}
          </span>
        )}
      </div>

      {status === "error" && (
        <p className="text-sm text-muted-foreground">Couldn&rsquo;t load the deep dive. Try again later.</p>
      )}

      {text && <MarkdownMessage>{text}</MarkdownMessage>}

      {status === "loading" && !text && <DeepDiveSkeleton />}

      {status === "streaming" && (
        <span
          aria-hidden
          className={cn(
            "mt-2 inline-block h-4 w-[2px] animate-pulse bg-primary align-middle"
          )}
        />
      )}
    </div>
  );
}

function DeepDiveSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted/60" />
        <div className="h-3 w-full animate-pulse rounded bg-muted/60" />
        <div className="h-3 w-11/12 animate-pulse rounded bg-muted/60" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-muted/60" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-1/4 animate-pulse rounded bg-muted/50" />
        <div className="h-3 w-full animate-pulse rounded bg-muted/50" />
        <div className="h-3 w-10/12 animate-pulse rounded bg-muted/50" />
      </div>
    </div>
  );
}
