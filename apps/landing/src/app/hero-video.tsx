"use client";

import { InViewVideo } from "@/components/in-view-video";
import { useState } from "react";

const GLOBE_CLASSES =
  "absolute inset-x-0 bottom-[28%] w-full scale-[2] sm:bottom-0 sm:translate-y-[20%] sm:scale-100";

/* Hero globe loop.

   Both branches are <video> so they're hardware-decoded and play smoothly —
   an animated WebP/GIF would be CPU-decoded frame-by-frame in Safari and
   stutters.

   Safari can't decode the WebM's VP9 alpha (it renders transparent areas
   black), so it gets an opaque video with the sky's base color (#bfd7fa)
   baked in, and the saturated top of the sky gradient is layered back on in
   CSS (.hero-safari-sky), fading into that baked color so the seam is hidden.
   Every other engine uses the alpha WebM over the live .hero-sky gradient.

   Until the browser is known we render an empty placeholder (server + first
   client render agree → no hydration mismatch), so only the right asset is
   fetched and the wrong format never flashes. The animated CSS sky behind
   fills the gap. */
export function HeroVideo() {
  const [isSafari, setIsSafari] = useState<boolean | null>(null);

  // Detect off the placeholder's ref so the swap happens before paint.
  const detect = (el: HTMLElement | null) => {
    if (el && isSafari === null) {
      const ua = navigator.userAgent;
      // Safari, excluding Chrome/Edge/Android and the iOS Chrome/Firefox shells.
      setIsSafari(/^((?!chrome|android|crios|fxios|edg).)*safari/i.test(ua));
    }
  };

  if (isSafari === null) {
    return <div ref={detect} className={GLOBE_CLASSES} aria-hidden />;
  }

  const src = isSafari
    ? "/media/website/globe-loop-bg.mp4" // opaque H.264, #bfd7fa baked in —
    : // hardware-decoded by Safari (VP9 is software-decoded there and stutters)
      "/media/website/globe-loop.webm"; // VP9 with alpha

  return (
    <>
      {/* Safari: flat #bfd7fa base matching the video's baked background, so the
          video's edge is seamless (covers the animated .hero-sky behind). */}
      {isSafari && (
        <div className="hero-panel-flat absolute inset-0 z-0" aria-hidden />
      )}
      <InViewVideo
        key={src}
        src={src}
        className={GLOBE_CLASSES}
        width={2400}
        height={1350}
        style={{ objectFit: "contain" }}
        loop
        muted
        playsInline
        aria-label="A slowly rotating globe"
        onElementReady={(el) => {
          el.playbackRate = 0.75;
        }}
      />
      {/* Safari: darkening layer that adds the saturated indigo top. */}
      {isSafari && (
        <div
          className="hero-safari-sky pointer-events-none absolute inset-0 z-[1]"
          aria-hidden
        />
      )}
    </>
  );
}
