import { cn } from "@/lib/utils";

export function PosterSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Shimmer className="aspect-[2/3] w-full rounded-[3px]" />
      <Shimmer className="h-3 w-4/5 rounded-sm" />
      <Shimmer className="h-2 w-1/3 rounded-sm" />
    </div>
  );
}

export function MovieGridSkeleton({ count = 14 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
      {Array.from({ length: count }).map((_, i) => (
        <PosterSkeleton key={i} />
      ))}
    </div>
  );
}

export function MovieRailSkeleton({ title }: { title?: string }) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between px-4 md:px-8">
        {title ? (
          <h2 className="font-serif text-2xl tracking-[-0.02em] md:text-3xl">{title}</h2>
        ) : (
          <Shimmer className="h-8 w-40 rounded-sm" />
        )}
      </div>
      <div className="scrollbar-thin flex gap-3 overflow-hidden px-4 pb-4 md:px-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <PosterSkeleton key={i} className="w-[128px] flex-none md:w-[150px] lg:w-[170px]" />
        ))}
      </div>
    </section>
  );
}

export function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted/50",
        className
      )}
    >
      <div className="absolute inset-y-0 -left-1/2 w-1/2 animate-sheen bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
    </div>
  );
}
