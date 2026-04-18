"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const AuthField = forwardRef<HTMLInputElement, Props>(function AuthField(
  { label, error, type = "text", className, ...props },
  ref
) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const effectiveType = isPassword && revealed ? "text" : type;

  return (
    <div className="space-y-1.5">
      <label className="meta-label block text-left">{label}</label>
      <div className="relative">
        <input
          ref={ref}
          type={effectiveType}
          className={cn(
            "w-full rounded-sm border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors",
            "focus:border-primary focus:ring-1 focus:ring-primary/30",
            error ? "border-destructive" : "border-border/60",
            isPassword && "pr-10",
            className
          )}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        ) : null}
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
});
