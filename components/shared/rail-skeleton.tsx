type Props = {
  title?: string;
  count?: number;
};

export function RailSkeleton({ title, count = 8 }: Props) {
  return (
    <section className="space-y-4" aria-hidden>
      <div className="flex items-end justify-between px-4 md:px-8">
        {title ? (
          <h2 className="font-serif text-2xl tracking-[-0.02em] md:text-3xl">
            {title}
          </h2>
        ) : (
          <div className="h-7 w-48 animate-pulse rounded bg-muted/60" />
        )}
      </div>
      <div className="scrollbar-thin flex gap-3 overflow-x-hidden px-4 pb-4 md:px-8">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="w-[128px] flex-none md:w-[150px] lg:w-[170px]"
          >
            <div className="aspect-[2/3] w-full animate-pulse rounded-md bg-muted/60" />
            <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-muted/60" />
            <div className="mt-1 h-3 w-1/2 animate-pulse rounded bg-muted/40" />
          </div>
        ))}
      </div>
    </section>
  );
}
