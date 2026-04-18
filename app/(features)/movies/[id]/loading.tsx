import { Shimmer } from "@/components/shared/poster-skeleton";

export default function Loading() {
  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="relative grid gap-10 px-4 pb-14 pt-20 md:grid-cols-[260px_1fr] md:px-8 md:pb-20 md:pt-28 lg:grid-cols-[300px_1fr]">
          <Shimmer className="mx-auto aspect-[2/3] w-[220px] rounded-sm md:mx-0 md:w-[260px] lg:w-[300px]" />
          <div className="space-y-6">
            <Shimmer className="h-3 w-56 rounded-sm" />
            <Shimmer className="h-16 w-4/5 rounded-sm md:h-24" />
            <div className="flex gap-2">
              <Shimmer className="h-7 w-20 rounded-full" />
              <Shimmer className="h-7 w-24 rounded-full" />
              <Shimmer className="h-7 w-16 rounded-full" />
            </div>
            <Shimmer className="h-4 w-full max-w-[52ch] rounded-sm" />
            <Shimmer className="h-4 w-[90%] max-w-[48ch] rounded-sm" />
            <Shimmer className="h-4 w-[70%] max-w-[40ch] rounded-sm" />
            <div className="flex gap-4 pt-2">
              <Shimmer className="h-11 w-36 rounded-full" />
              <Shimmer className="h-11 w-40 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-8">
        <Shimmer className="mb-8 h-10 w-40 rounded-sm" />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2 border-t border-border/60 pt-4">
              <Shimmer className="h-3 w-20 rounded-sm" />
              <Shimmer className="h-6 w-28 rounded-sm" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
