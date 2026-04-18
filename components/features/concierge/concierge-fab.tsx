"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wand2 } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export function ConciergeFab() {
  const pathname = usePathname();
  if (pathname?.startsWith(ROUTES.concierge)) return null;

  return (
    <Link
      href={ROUTES.concierge}
      aria-label="Ask OlaMax AI"
      className="group fixed right-6 bottom-6 z-50 hidden cursor-pointer md:block lg:right-8 lg:bottom-8"
    >
      {/* ambient glow */}
      <span
        aria-hidden
        className="absolute -inset-3 -z-10 rounded-full bg-primary/35 opacity-60 blur-2xl transition-all duration-500 group-hover:opacity-90 group-hover:blur-[28px]"
      />

      {/* rotating conic-gradient border */}
      <span
        aria-hidden
        className="absolute -inset-[1.5px] rounded-full opacity-90 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "conic-gradient(from 0deg, hsl(var(--primary)) 0%, transparent 30%, hsl(var(--primary) / 0.55) 55%, transparent 80%, hsl(var(--primary)) 100%)",
          animation: "spin 6s linear infinite",
        }}
      />

      {/* main pill */}
      <span
        className="relative flex items-center gap-2.5 overflow-hidden rounded-full py-2 pr-5 pl-2 shadow-[0_14px_34px_-8px_rgba(0,0,0,0.55),0_4px_12px_-2px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] transition-transform duration-300 group-hover:scale-[1.03] group-active:scale-[0.98]"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--foreground)) 0%, color-mix(in oklab, hsl(var(--foreground)) 92%, black) 100%)",
        }}
      >
        {/* inner top-highlight gloss */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/12 to-transparent"
        />
        {/* hover shimmer sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-x-4 -top-8 h-12 rotate-12 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent blur-md transition-transform duration-[1600ms] ease-out group-hover:translate-x-[260%]"
        />

        {/* icon chip */}
        <span className="relative grid h-8 w-8 flex-none place-items-center rounded-full bg-primary shadow-[0_0_18px_-2px_hsl(var(--primary)/0.8),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.25)]">
          <Wand2
            className="h-[14px] w-[14px] text-primary-foreground drop-shadow-[0_0_4px_rgba(255,255,255,0.45)] transition-transform duration-500 group-hover:-rotate-12"
            strokeWidth={2.5}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -top-0.5 -right-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.95)]"
          />
        </span>

        {/* label */}
        <span className="relative flex flex-col items-start leading-none">
          <span className="font-mono text-[9px] font-semibold tracking-[0.24em] text-white/60 uppercase">
            Ask
          </span>
          <span className="mt-0.5 font-serif text-[15px] leading-tight tracking-[-0.01em] text-white">
            <span className="italic">OlaMax</span>
            <span className="ml-1">AI</span>
          </span>
        </span>
      </span>
    </Link>
  );
}
