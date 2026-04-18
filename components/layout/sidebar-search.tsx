"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SidebarSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.userAgent));

    function isTypingInField(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (target.isContentEditable) return true;
      return false;
    }

    function onKeyDown(e: KeyboardEvent) {
      const isKHotkey =
        (e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K" || e.code === "KeyK");
      if (isKHotkey) {
        e.preventDefault();
        e.stopPropagation();
        setOpen((prev) => !prev);
        return;
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !isTypingInField(e.target)) {
        e.preventDefault();
        setOpen(true);
      }
    }

    document.addEventListener("keydown", onKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", onKeyDown, { capture: true });
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push(ROUTES.search);
    } else {
      router.push(`${ROUTES.search}?q=${encodeURIComponent(trimmed)}`);
    }
    setOpen(false);
    setQuery("");
  }

  const shortcut = isMac ? "⌘K" : "Ctrl K";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Search"
        aria-label="Search"
        className={cn(
          "relative mx-2 flex cursor-pointer items-center gap-3 overflow-hidden rounded-md px-2 py-2 text-sm",
          "text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        )}
      >
        <span className="flex h-5 w-5 flex-none items-center justify-center">
          <Search className="h-5 w-5" />
        </span>
        <span className="sidebar-label flex flex-1 items-center justify-between">
          <span>Search</span>
          <kbd className="meta-label ml-2 rounded border border-border/60 px-1.5 py-0.5 text-[9px]">
            {shortcut}
          </kbd>
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="top-[20%] translate-y-0 gap-0 p-0 sm:max-w-lg [&>[data-slot=dialog-close]]:hidden"
        >
          <DialogTitle className="sr-only">Search</DialogTitle>
          <form onSubmit={onSubmit} className="flex items-center gap-3 px-4 py-3">
            <Search className="h-4 w-4 flex-none text-muted-foreground" aria-hidden />
            <Input
              ref={inputRef}
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search films, actors…"
              className="h-auto flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
            />
            <kbd className="meta-label hidden flex-none rounded border border-border/60 px-1.5 py-0.5 text-[9px] tracking-[0.14em] sm:inline-flex">
              Esc
            </kbd>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
