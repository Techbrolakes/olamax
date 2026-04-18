"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  isToolUIPart,
  getToolName,
  type DynamicToolUIPart,
  type ToolUIPart,
  type UITools,
} from "ai";
import { RotateCcw, Send } from "lucide-react";
import type { FilmConciergeUIMessage } from "@/lib/ai/concierge-agent";
import { MovieResultCard, type MovieResult } from "./movie-result-card";
import { MarkdownMessage } from "./markdown-message";

const SUGGESTED = [
  "Marvel movies I haven't seen yet",
  "A good mystery to solve tonight",
  "Feel-good comedy to watch with friends",
  "Something romantic for date night",
] as const;

const STORAGE_KEY = "olamax.concierge.messages.v1";
const MAX_STORED_MESSAGES = 50;

export function ConciergeView() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const hydratedRef = useRef(false);
  const autoSentRef = useRef(false);
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") ?? null;

  const { messages, sendMessage, setMessages, status } = useChat<FilmConciergeUIMessage>({
    transport: new DefaultChatTransport({ api: "/api/ai/concierge" }),
  });

  const busy = status === "submitted" || status === "streaming";

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as FilmConciergeUIMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // localStorage unavailable or corrupted; proceed with empty history
    }
    hydratedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-send a query passed via ?q=... (from search pivot, etc.) — once per mount
  useEffect(() => {
    if (!hydratedRef.current || autoSentRef.current || !initialQuery) return;
    if (busy) return;
    autoSentRef.current = true;
    sendMessage({ text: initialQuery });
    // strip the query param from the URL so a refresh doesn't re-send
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("q");
      window.history.replaceState(null, "", url.toString());
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  // Persist to localStorage whenever messages settle (not mid-stream)
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (status === "streaming" || status === "submitted") return;
    try {
      if (messages.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        const trimmed = messages.slice(-MAX_STORED_MESSAGES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      }
    } catch {
      // Quota or availability error; skip this save
    }
  }, [messages, status]);

  // Auto-scroll to bottom when new content arrives
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  function handleSend(value: string) {
    const trimmed = value.trim();
    if (!trimmed || busy) return;
    sendMessage({ text: trimmed });
    setInput("");
  }

  function handleClear() {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem-5rem-env(safe-area-inset-bottom))] flex-col md:h-screen">
      {/* HEADER — fixed at top */}
      <div className="shrink-0 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-start justify-between gap-3 px-4 pt-5 pb-4 md:gap-4 md:px-6 md:pt-10 md:pb-5">
          <div className="min-w-0">
            <p className="meta-label text-primary">OlaMax AI</p>
            <h1 className="font-serif text-[26px] leading-[0.98] tracking-[-0.02em] sm:text-3xl md:text-4xl">
              Don&rsquo;t know what to watch?
            </h1>
            <p className="hidden pt-2 text-sm text-muted-foreground md:block md:text-[15px]">
              Search for any movie, describe a vibe, or just tell me your mood — I&rsquo;ll find
              something worth your time.
            </p>
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="meta-label mt-1 inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border/60 px-2.5 text-muted-foreground transition-colors hover:border-border hover:text-foreground md:h-auto md:px-3 md:py-1.5"
              aria-label="Start a new chat"
            >
              <RotateCcw className="h-3.5 w-3.5 md:h-3 md:w-3" />
              <span className="hidden sm:inline">New chat</span>
            </button>
          )}
        </div>
      </div>

      {/* SCROLLABLE MIDDLE — messages or suggestions */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-3xl px-4 pt-5 pb-6 md:px-6 md:pt-6 md:pb-8">
          {messages.length === 0 ? (
            <div className="flex flex-col gap-3">
              <p className="meta-label pb-2 text-muted-foreground">Try asking</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSend(s)}
                    className="min-h-[56px] cursor-pointer rounded-[4px] border border-border/60 bg-card/40 px-4 py-3 text-left text-[15px] leading-snug transition-colors hover:border-primary/40 hover:bg-card/70 active:bg-card/80 md:text-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 md:gap-8">
              {messages.map((message) => (
                <MessageBlock key={message.id} message={message} />
              ))}
              {busy && messages[messages.length - 1]?.role === "user" && (
                <div className="flex items-center gap-3 rounded-[4px] border border-border/60 bg-card/40 px-4 py-3">
                  <span className="meta-label text-primary">Thinking</span>
                  <LoadingDots />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* INPUT — fixed at bottom */}
      <div className="shrink-0 border-t border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-3xl px-3 py-2.5 md:px-6 md:py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2 rounded-full border border-border/60 bg-background p-1.5 pl-4 shadow-sm transition-colors focus-within:border-primary/50 md:pl-5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search a movie or type a vibe…"
              inputMode="text"
              enterKeyHint="send"
              autoComplete="off"
              autoCorrect="off"
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm"
              disabled={busy}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 md:h-9 md:w-9"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function MessageBlock({ message }: { message: FilmConciergeUIMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-[4px] bg-primary px-4 py-2.5 text-[15px] leading-snug text-primary-foreground md:max-w-[80%] md:text-sm md:leading-normal">
          {message.parts.map((part, i) =>
            part.type === "text" ? <span key={i}>{part.text}</span> : null
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message.parts.map((part, i) => {
        if (part.type === "text") {
          return <MarkdownMessage key={i}>{part.text}</MarkdownMessage>;
        }

        if (isToolUIPart(part)) {
          return <ToolPart key={part.toolCallId ?? i} part={part} />;
        }

        return null;
      })}
    </div>
  );
}

type AnyToolPart = ToolUIPart<UITools> | DynamicToolUIPart;

function ToolPart({ part }: { part: AnyToolPart }) {
  const toolName = getToolName(part);
  const pending = part.state !== "output-available";

  if (pending) {
    return (
      <div className="flex items-center gap-3 rounded-[4px] border border-border/60 bg-card/40 px-4 py-3">
        <span className="meta-label text-primary">{humanizeToolName(toolName)}</span>
        <LoadingDots />
      </div>
    );
  }

  const output = (part as { output?: unknown }).output;
  const results = extractMovieResults(output);
  if (!results) return null;

  return (
    <div className="space-y-2">
      <p className="meta-label text-muted-foreground">{humanizeToolName(toolName)}</p>
      <div className="grid gap-3 md:grid-cols-2">
        {results.map((movie) => (
          <MovieResultCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <span aria-label="Loading" className="inline-flex items-center gap-1" role="status">
      <span
        className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
        style={{ animationDelay: "0ms", animationDuration: "900ms" }}
      />
      <span
        className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
        style={{ animationDelay: "150ms", animationDuration: "900ms" }}
      />
      <span
        className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
        style={{ animationDelay: "300ms", animationDuration: "900ms" }}
      />
    </span>
  );
}

function humanizeToolName(name: string): string {
  switch (name) {
    case "searchMovies":
      return "Searched catalog";
    case "getMovieDetails":
      return "Looked up details";
    case "getSimilar":
      return "Found similar";
    case "recommendForTaste":
      return "Semantic recommendations";
    case "getWatchProviders":
      return "Checked streaming availability";
    default:
      return name;
  }
}

function extractMovieResults(output: unknown): MovieResult[] | null {
  if (!output || typeof output !== "object") return null;
  const maybeResults = (output as { results?: unknown }).results;
  if (!Array.isArray(maybeResults)) return null;
  return maybeResults.filter(
    (m): m is MovieResult =>
      Boolean(m) &&
      typeof m === "object" &&
      typeof (m as MovieResult).id === "number" &&
      typeof (m as MovieResult).title === "string"
  );
}
