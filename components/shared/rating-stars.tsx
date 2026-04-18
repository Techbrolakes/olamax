"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
};

export function RatingStars({ value, onChange, max = 10, readOnly = false, size = "md" }: Props) {
  const sizeClass = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-6 w-6" : "h-5 w-5";
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < value;
        const disabled = readOnly || !onChange;
        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(i + 1)}
            className={cn(
              "transition-colors",
              disabled ? "cursor-default" : "cursor-pointer hover:text-primary"
            )}
            aria-label={`Rate ${i + 1} out of ${max}`}
          >
            <Star
              className={cn(
                sizeClass,
                filled ? "fill-primary text-primary" : "fill-none text-muted-foreground/40"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
