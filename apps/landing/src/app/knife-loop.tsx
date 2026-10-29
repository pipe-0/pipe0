"use client";

import { useEffect, useRef } from "react";

/**
 * The Swiss Army knife in the hero headline: a red knife whose tools are
 * agents. A fal.ai loop (still, then image-to-video with that still as its
 * first and last frame; assets/illustrations/knife_fal.md), lifted to pure
 * white and multiplied onto the page, so it sits in the line of type with
 * no box around it. The poster is the first frame, which is also all a
 * reduced-motion visitor sees.
 *
 * A little taller than the type, with the overhang taken back out of the
 * line box so the headline's leading doesn't open up around it.
 *
 * Earlier versions: app/knife-glyph.tsx (canvas) and
 * assets/illustrations/knife_anim.py (Blender).
 */
export function KnifeLoop({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // React doesn't render the `muted` attribute, and iOS Safari refuses to
    // play an unmuted video without a gesture — set it before play().
    v.muted = true;
    v.defaultMuted = true;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <span
      aria-hidden
      className={`relative -my-[0.1em] inline-block h-[1.2em] w-[2.34em] ${className ?? ""}`}
    >
      <video
        ref={ref}
        src="/media/website/illustrations/knife.mp4"
        poster="/media/website/illustrations/knife.webp"
        muted
        loop
        playsInline
        preload="auto"
        width={702}
        height={360}
        className="absolute inset-0 size-full mix-blend-multiply"
      />
    </span>
  );
}
