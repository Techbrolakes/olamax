import { APP_NAME } from "@/lib/constants";

const WORDS = ["Loading", "Framing", "Cueing", "Threading", "Projecting"];

type Props = {
  label?: string;
  subtitle?: string;
};

export function EditorialLoader({ label, subtitle }: Props) {
  return (
    <div className="relative grid min-h-[70vh] place-items-center overflow-hidden px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--color-primary)_0%,transparent_60%)] opacity-[0.06]"
      />

      <div className="flex w-full max-w-xl flex-col items-center gap-10 text-center">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
            {APP_NAME}
          </span>
          <span className="h-px w-16 bg-border" />
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Reel 01
          </span>
        </div>

        <div className="relative h-[1.15em] overflow-hidden font-serif text-6xl italic leading-[1.15] tracking-[-0.02em] md:text-7xl">
          <div className="animate-marquee-up">
            {[...WORDS, WORDS[0]].map((word, i) => (
              <div key={`${word}-${i}`} className="h-[1.15em]">
                {label ?? word}
                <span className="text-primary">.</span>
              </div>
            ))}
          </div>
        </div>

        <FilmStrip />

        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground animate-pulse-dim">
          {subtitle ?? "Stand by · pulling the latest frames"}
        </p>
      </div>
    </div>
  );
}

function FilmStrip() {
  return (
    <div className="relative h-10 w-full max-w-sm overflow-hidden rounded-[3px] border border-border/60">
      <div
        aria-hidden
        className="absolute inset-0 animate-filmstrip bg-[length:64px_100%] opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--color-foreground) 0 8px, transparent 8px 24px, var(--color-foreground) 24px 32px, transparent 32px 64px)",
          maskImage:
            "repeating-linear-gradient(90deg, black 0 8px, transparent 8px 24px, black 24px 32px, transparent 32px 64px)",
        }}
      />
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 -left-1/2 w-1/2 animate-sheen bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>
    </div>
  );
}
