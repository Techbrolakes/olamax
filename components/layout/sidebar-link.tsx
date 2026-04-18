"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

type Props = {
  href: string;
  label: string;
  icon: ReactNode;
};

export function SidebarLink({ href, label, icon }: Props) {
  const pathname = usePathname() ?? "/";
  const active =
    href === ROUTES.home ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      title={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative mx-2 flex cursor-pointer items-center gap-3 overflow-hidden rounded-md px-2 py-2 text-sm transition-colors",
        active
          ? "bg-primary/10 text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      )}
    >
      {active && (
        <span
          aria-hidden
          className="absolute top-1/2 left-0 h-5 w-[2px] -translate-y-1/2 rounded-r-full bg-primary"
        />
      )}
      <span
        className={cn(
          "flex h-5 w-5 flex-none items-center justify-center",
          active ? "text-primary" : ""
        )}
      >
        {icon}
      </span>
      <span className={cn("sidebar-label", active && "font-medium")}>{label}</span>
    </Link>
  );
}
