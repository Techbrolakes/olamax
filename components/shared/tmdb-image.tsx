"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import {
  BuildingsIcon,
  FilmSlateIcon,
  FilmStripIcon,
  ImageBrokenIcon,
  UserIcon,
} from "@phosphor-icons/react";
import {
  BACKDROP_SIZES,
  LOGO_SIZES,
  POSTER_SIZES,
  PROFILE_SIZES,
  STILL_SIZES,
  backdropUrl,
  logoUrl,
  posterUrl,
  profileUrl,
  stillUrl,
} from "@/lib/tmdb/images";
import { cn } from "@/lib/utils";

type SizeMap = {
  poster: keyof typeof POSTER_SIZES;
  profile: keyof typeof PROFILE_SIZES;
  backdrop: keyof typeof BACKDROP_SIZES;
  still: keyof typeof STILL_SIZES;
  logo: keyof typeof LOGO_SIZES;
};

export type TmdbImageKind = keyof SizeMap;

type CommonProps<K extends TmdbImageKind> = {
  kind: K;
  path: string | null | undefined;
  alt: string;
  size?: SizeMap[K];
  fallbackLabel?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
};

type FillProps = { fill: true; width?: never; height?: never };
type FixedProps = { fill?: false; width: number; height: number };

export type TmdbImageProps<K extends TmdbImageKind> = CommonProps<K> &
  (FillProps | FixedProps);

export function TmdbImage<K extends TmdbImageKind>(props: TmdbImageProps<K>) {
  const {
    kind,
    path,
    alt,
    size,
    fallbackLabel,
    className,
    sizes,
    priority,
    quality,
  } = props;
  const [errored, setErrored] = useState(false);
  const src = resolveUrl(kind, path, size);

  if (!src || errored) {
    const layout =
      "fill" in props && props.fill
        ? { fill: true as const }
        : { width: props.width, height: props.height };
    return (
      <TmdbImageFallback
        kind={kind}
        label={fallbackLabel ?? alt}
        className={className}
        {...layout}
      />
    );
  }

  if ("fill" in props && props.fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={quality}
        onError={() => setErrored(true)}
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={props.width}
      height={props.height}
      sizes={sizes}
      priority={priority}
      quality={quality}
      onError={() => setErrored(true)}
      className={className}
    />
  );
}

function resolveUrl(
  kind: TmdbImageKind,
  path: string | null | undefined,
  size: string | undefined
): string | null {
  switch (kind) {
    case "poster":
      return posterUrl(path, size as keyof typeof POSTER_SIZES | undefined);
    case "profile":
      return profileUrl(path, size as keyof typeof PROFILE_SIZES | undefined);
    case "backdrop":
      return backdropUrl(path, size as keyof typeof BACKDROP_SIZES | undefined);
    case "still":
      return stillUrl(path, size as keyof typeof STILL_SIZES | undefined);
    case "logo":
      return logoUrl(path, size as keyof typeof LOGO_SIZES | undefined);
  }
}

type FallbackProps = {
  kind: TmdbImageKind;
  label: string;
  className?: string;
} & ({ fill: true } | { width?: number; height?: number });

function TmdbImageFallback(props: FallbackProps) {
  const { kind, label, className } = props;
  const isFill = "fill" in props && props.fill === true;
  const style: CSSProperties | undefined = isFill
    ? undefined
    : { width: (props as { width?: number }).width, height: (props as { height?: number }).height };

  const showLabel = kind !== "backdrop" && kind !== "logo" && Boolean(label);

  return (
    <div
      role="img"
      aria-label={label || undefined}
      style={style}
      className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground/70",
        isFill && "absolute inset-0 h-full w-full",
        className
      )}
    >
      <FallbackContent kind={kind} label={showLabel ? label : ""} />
    </div>
  );
}

function FallbackContent({ kind, label }: { kind: TmdbImageKind; label: string }) {
  switch (kind) {
    case "poster":
      return (
        <div className="flex flex-col items-center gap-3 px-3 py-4 text-center">
          <FilmStripIcon className="h-7 w-7 opacity-70" />
          {label ? (
            <p className="line-clamp-2 font-serif text-[12px] italic leading-snug text-muted-foreground">
              {label}
            </p>
          ) : null}
        </div>
      );
    case "profile":
      return (
        <div className="flex flex-col items-center gap-2.5 px-3 py-4 text-center">
          <UserIcon className="h-8 w-8 opacity-70" />
          {label ? (
            <p className="line-clamp-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {label}
            </p>
          ) : null}
        </div>
      );
    case "backdrop":
      return <ImageBrokenIcon className="h-10 w-10 opacity-40" />;
    case "still":
      return (
        <div className="flex flex-col items-center gap-1.5 px-2 py-3 text-center">
          <FilmSlateIcon className="h-5 w-5 opacity-70" />
          {label ? (
            <p className="line-clamp-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              {label}
            </p>
          ) : null}
        </div>
      );
    case "logo":
      return <BuildingsIcon className="h-4 w-4 opacity-60" />;
  }
}
