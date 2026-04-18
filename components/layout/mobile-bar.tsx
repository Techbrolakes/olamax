"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookmarkIcon,
  HouseIcon,
  MagicWandIcon,
  MagnifyingGlassIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  icon: typeof HouseIcon;
  label: string;
  featured?: boolean;
};

const ITEMS: Item[] = [
  { href: ROUTES.home, icon: HouseIcon, label: "Home" },
  { href: ROUTES.search, icon: MagnifyingGlassIcon, label: "Search" },
  { href: ROUTES.concierge, icon: MagicWandIcon, label: "AI", featured: true },
  { href: ROUTES.actors.index, icon: UsersIcon, label: "Actors" },
  { href: ROUTES.watchlist, icon: BookmarkIcon, label: "Watchlist" },
];

const CONTAINER_HEIGHT = 84; // 56 (bar) + 28 (bulge)
const BUTTON_SIZE = 48;
const BUTTON_TOP = 10; // positive → button nested inside the bulge, no longer protruding

// Bar outline: rounded pill whose top edge smoothly bulges upward in the middle.
// Curves use cubic Bezier so tangents stay horizontal at entry/exit of the hump
// → no sharp kinks where the bulge meets the flat top. Bulge widened to 110px
// (x=145..255) so the AI button nests fully inside it. ViewBox 400x84.
const BAR_PATH = [
  "M 0 56",
  "A 28 28 0 0 1 28 28",
  "L 145 28",
  "C 175 28, 175 4, 200 4",
  "C 225 4, 225 28, 255 28",
  "L 372 28",
  "A 28 28 0 0 1 372 84",
  "L 28 84",
  "A 28 28 0 0 1 0 56",
  "Z",
].join(" ");

export function MobileBar() {
  const pathname = usePathname() ?? "/";
  const featuredItem = ITEMS.find((i) => i.featured);
  const featuredActive = featuredItem
    ? pathname === featuredItem.href || pathname.startsWith(`${featuredItem.href}/`)
    : false;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-3 z-40 md:hidden"
      style={{ bottom: "calc(0.25rem + env(safe-area-inset-bottom))" }}
    >
      <div
        className="relative"
        style={{
          filter:
            "drop-shadow(0 14px 30px rgba(0,0,0,0.55)) drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
        }}
      >
        {/* Bar + bulge as a single continuous SVG shape */}
        <div className="relative" style={{ height: `${CONTAINER_HEIGHT}px` }}>
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            viewBox={`0 0 400 ${CONTAINER_HEIGHT}`}
            aria-hidden
          >
            <path d={BAR_PATH} style={{ fill: "hsl(var(--surface) / 0.95)" }} />
          </svg>

          {/* Items sit in the bottom 56px (the flat bar area) */}
          <ul className="absolute inset-x-0 bottom-0 flex h-14 items-center px-2">
            {ITEMS.map((item) => {
              if (item.featured) {
                return <li key={item.href} aria-hidden className="flex-1" />;
              }

              const active =
                item.href === ROUTES.home
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <li key={item.href} className="flex-1">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-14 cursor-pointer flex-col items-center justify-center gap-1 transition-colors",
                      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon
                      className="h-[18px] w-[18px]"
                      weight={active ? "fill" : "duotone"}
                    />
                    <span className="font-sans text-[10px] font-medium leading-none tracking-tight">
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Raised AI button — sits on top of the bulge */}
        {featuredItem && (
          <Link
            href={featuredItem.href}
            aria-current={featuredActive ? "page" : undefined}
            aria-label={`Ask ${featuredItem.label}`}
            className="group/ai absolute left-1/2 flex -translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_26px_-4px_hsl(var(--primary)/0.7),0_4px_12px_-2px_rgba(0,0,0,0.45)] transition-transform active:scale-[0.94]"
            style={{
              top: `${BUTTON_TOP}px`,
              height: `${BUTTON_SIZE}px`,
              width: `${BUTTON_SIZE}px`,
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/22 via-transparent to-black/10"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-[1px] rounded-full ring-1 ring-inset ring-white/15"
            />
            <MagicWandIcon className="relative h-[19px] w-[19px]" weight="fill" />
          </Link>
        )}
      </div>
    </nav>
  );
}
