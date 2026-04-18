export function ScoreDial({ value, size = 64 }: { value: number; size?: number }) {
  const clamped = Math.max(0, Math.min(10, value));
  const pct = clamped / 10;
  const r = size / 2 - 3;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  const stroke = clamped >= 7 ? "var(--color-primary)" : clamped >= 5 ? "var(--color-foreground)" : "var(--color-muted-foreground)";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--color-border)"
          strokeWidth={3}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={stroke}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center leading-none">
          <p className="font-serif text-lg">{clamped.toFixed(1)}</p>
          <p className="mt-0.5 text-[8px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
            Score
          </p>
        </div>
      </div>
    </div>
  );
}
