"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A Blender loop (assets/illustrations/*.py) standing in for a still
 * illustration. Rendered on white and multiplied onto the dotted stage; the
 * still is the poster, so nothing jumps while it loads. Plays only while on
 * screen, and not at all with reduced motion.
 */
export function LoopVideo({
  src,
  poster,
  label,
  className,
}: {
  src: string;
  poster: string;
  label?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // React doesn't render the `muted` attribute, and iOS Safari refuses to
    // play an unmuted video without a gesture — set it before play().
    v.muted = true;
    v.defaultMuted = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      // The stills are large PNGs; serve the poster through the image
      // optimizer (a 1080w WebP) instead.
      poster={`/_next/image?url=${encodeURIComponent(poster)}&w=1080&q=75`}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      aria-hidden={label ? undefined : true}
      width={1000}
      height={750}
      className={cn("h-auto mix-blend-multiply", className)}
    />
  );
}
