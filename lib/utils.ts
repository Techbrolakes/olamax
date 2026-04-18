import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatYear(date?: string | null) {
  if (!date) return "";
  const year = new Date(date).getFullYear();
  return Number.isFinite(year) ? String(year) : "";
}

export function formatRuntime(minutes?: number | null) {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

export function formatRating(value?: number | null, fractionDigits = 1) {
  if (typeof value !== "number") return "—";
  return value.toFixed(fractionDigits);
}
