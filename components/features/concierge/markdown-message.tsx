"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { children: string };

export function MarkdownMessage({ children }: Props) {
  return (
    <div className="concierge-markdown font-sans text-[15px] leading-relaxed text-foreground/90 md:text-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          hr: () => <hr className="my-4 border-border/60" />,
          h1: ({ children }) => (
            <h3 className="mt-4 mb-2 font-serif text-xl tracking-[-0.01em] text-foreground first:mt-0">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h3 className="mt-4 mb-2 font-serif text-lg tracking-[-0.01em] text-foreground first:mt-0">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="mt-3 mb-2 font-sans text-[15px] font-semibold text-foreground first:mt-0">
              {children}
            </h4>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 ml-5 list-disc space-y-1 marker:text-muted-foreground last:mb-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 ml-5 list-decimal space-y-1 marker:text-muted-foreground last:mb-0">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-primary/50 pl-4 text-muted-foreground italic">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[13px] text-foreground">
              {children}
            </code>
          ),
          a: ({ href, children }) => {
            const isExternal = href?.startsWith("http");
            if (!href) return <span>{children}</span>;
            if (isExternal) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                >
                  {children}
                </a>
              );
            }
            return (
              <Link
                href={href}
                className="cursor-pointer font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
              >
                {children}
              </Link>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
