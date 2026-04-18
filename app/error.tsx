"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="meta-label">Something went wrong</p>
      <h1 className="font-serif text-5xl tracking-[-0.02em]">
        <span className="italic">An error</span> interrupted the show.
      </h1>
      <button
        type="button"
        onClick={reset}
        className="meta-label cursor-pointer rounded-full bg-foreground px-5 py-2.5 text-background hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
