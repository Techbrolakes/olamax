"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowCounterClockwiseIcon,
  ArrowsInIcon,
  ArrowsOutIcon,
  CircleNotchIcon,
  PauseIcon,
  PlayIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  type: "hls" | "mp4";
  poster?: string;
  title?: string;
};

export function VideoPlayer({ src, type, poster, title }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hideControls, setHideControls] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // HLS attach
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setLoading(true);
    setError(null);
    let hlsInstance: { destroy: () => void } | null = null;

    if (type === "hls") {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else {
        (async () => {
          const Hls = (await import("hls.js")).default;
          if (Hls.isSupported()) {
            const hls = new Hls({ enableWorker: true });
            hls.on(Hls.Events.ERROR, (_e, data) => {
              if (data.fatal) {
                setLoading(false);
                setError("Couldn't load this stream.");
              }
            });
            hls.loadSource(src);
            hls.attachMedia(video);
            hlsInstance = hls;
          } else {
            video.src = src;
          }
        })();
      }
    } else {
      video.src = src;
    }
    video.load();

    return () => {
      if (hlsInstance) hlsInstance.destroy();
    };
  }, [src, type, reloadKey]);

  const onMediaError = () => {
    const video = videoRef.current;
    const code = video?.error?.code;
    const message =
      code === 4
        ? "This video is unavailable from the source."
        : code === 2
          ? "Network error while loading the video."
          : "Couldn't play this video.";
    setLoading(false);
    setError(message);
  };

  const retry = () => {
    setError(null);
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  // fullscreen listener
  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play();
    } else {
      video.pause();
    }
  };

  const toggleFullscreen = async () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const onSeek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setProgress(value);
  };

  const onVolume = (v: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = v;
    setVolume(v);
    if (v === 0) video.muted = true;
    else if (video.muted) video.muted = false;
    setMuted(video.muted);
  };

  const bumpControls = () => {
    setHideControls(false);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setHideControls(true), 2500);
  };

  return (
    <div
      ref={wrapperRef}
      onMouseMove={bumpControls}
      onMouseLeave={() => setHideControls(true)}
      className="group relative aspect-video w-full overflow-hidden rounded-md bg-black ring-1 ring-border"
    >
      <video
        ref={videoRef}
        poster={poster}
        title={title}
        playsInline
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => {
          setLoading(false);
          setError(null);
        }}
        onPlaying={() => {
          setLoading(false);
          setError(null);
        }}
        onError={onMediaError}
        onStalled={() => setLoading(true)}
        className="absolute inset-0 h-full w-full cursor-pointer bg-black object-contain"
      />

      {loading && !error ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <CircleNotchIcon className="h-8 w-8 animate-spin text-foreground/80" />
        </div>
      ) : null}

      {error ? (
        <div className="absolute inset-0 grid place-items-center bg-black/70 px-6 text-center">
          <div className="max-w-sm space-y-3">
            <WarningIcon className="mx-auto h-7 w-7 text-foreground/80" />
            <p className="font-serif text-lg leading-snug">{error}</p>
            <button
              type="button"
              onClick={retry}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border/60 px-4 py-1.5 text-sm transition-colors hover:border-foreground"
            >
              <ArrowCounterClockwiseIcon className="h-3.5 w-3.5" /> Try again
            </button>
          </div>
        </div>
      ) : null}

      {!playing && !loading && !error ? (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play"
          className="absolute inset-0 grid cursor-pointer place-items-center bg-black/30 transition-colors hover:bg-black/10"
        >
          <span className="grid h-20 w-20 place-items-center rounded-full bg-foreground text-background">
            <PlayIcon className="h-8 w-8 text-background" weight="fill" />
          </span>
        </button>
      ) : null}

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-4 pb-3 pt-8 transition-opacity duration-300",
          hideControls && playing ? "opacity-0" : "opacity-100"
        )}
      >
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={progress}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-primary"
        />
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            className="cursor-pointer text-white transition-opacity hover:opacity-80"
          >
            {playing ? <PauseIcon className="h-5 w-5" weight="fill" /> : <PlayIcon className="h-5 w-5" weight="fill" />}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="cursor-pointer text-white transition-opacity hover:opacity-80"
            >
              {muted || volume === 0 ? <SpeakerSlashIcon className="h-5 w-5" /> : <SpeakerHighIcon className="h-5 w-5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => onVolume(Number(e.target.value))}
              className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/20 accent-primary"
            />
          </div>

          <p className="font-mono text-xs text-white/80">
            {formatTime(progress)} / {formatTime(duration)}
          </p>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="ml-auto cursor-pointer text-white transition-opacity hover:opacity-80"
          >
            {isFullscreen ? <ArrowsInIcon className="h-5 w-5" /> : <ArrowsOutIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
