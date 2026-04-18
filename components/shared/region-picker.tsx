"use client";

import { useEffect, useState } from "react";
import { GlobeIcon } from "@phosphor-icons/react";

const REGIONS = [
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "NG", label: "Nigeria" },
  { code: "ZA", label: "South Africa" },
  { code: "IN", label: "India" },
  { code: "JP", label: "Japan" },
  { code: "BR", label: "Brazil" },
  { code: "MX", label: "Mexico" },
  { code: "ES", label: "Spain" },
  { code: "IT", label: "Italy" },
  { code: "NL", label: "Netherlands" },
] as const;

const STORAGE_KEY = "olamax:region";

export function getStoredRegion(fallback = "US"): string {
  if (typeof window === "undefined") return fallback;
  return window.localStorage.getItem(STORAGE_KEY) ?? fallback;
}

export function setStoredRegion(region: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, region);
}

export function RegionPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [region, setRegion] = useState(value);

  useEffect(() => {
    setRegion(value);
  }, [value]);

  return (
    <label className="relative inline-flex cursor-pointer items-center gap-2 rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border hover:text-foreground">
      <GlobeIcon className="h-3.5 w-3.5" />
      <span className="font-mono uppercase tracking-[0.18em]">{region}</span>
      <select
        value={region}
        onChange={(e) => {
          setRegion(e.target.value);
          setStoredRegion(e.target.value);
          onChange(e.target.value);
        }}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Region"
      >
        {REGIONS.map((r) => (
          <option key={r.code} value={r.code}>
            {r.code} · {r.label}
          </option>
        ))}
      </select>
    </label>
  );
}
