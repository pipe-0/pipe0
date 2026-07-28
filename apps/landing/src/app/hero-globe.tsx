"use client";

import { InViewVideo } from "@/components/in-view-video";
import { useState } from "react";

/**
 * The rotating globe, kept for the mobile hero.
 *
 * The DOM scene that replaced it on desktop is a wide, detailed product shot
 * — at phone width its type is too small to read and it stops carrying the
 * idea. The globe reads at any size, so small screens keep it.
 *
 * Both branches are <video> so they are hardware-decoded; an animated
 * WebP/GIF is decoded frame-by-frame on the CPU and stutters in Safari.
 * Safari also cannot decode the WebM's VP9 alpha (transparent areas paint
 * black) and software-decodes VP9 besides, so it gets an opaque HEVC with the
 * sky colour baked in and the saturated top layered back on in CSS.
 *
 * Until the engine is known we render an empty placeholder, so the server and
 * first client render agree and only one asset is ever fetched.
 */
export function HeroGlobe() {
  const [isSafari, setIsSafari] = useState<boolean | null>(null);

  const detect = (el: HTMLElement | null) => {
    if (el && isSafari === null) {
      const ua = navigator.userAgent;
      setIsSafari(/^((?!chrome|android|crios|fxios|edg).)*safari/i.test(ua));
    }
  };

  // Low enough that the horizon clears the CTAs above it.
  const classes = "absolute inset-x-0 bottom-[6%] w-full scale-[1.9]";

  if (isSafari === null) {
    return <div ref={detect} className={classes} aria-hidden />;
  }

  return (
    <>
      {isSafari && (
        <div className="hero-panel-flat absolute inset-0 z-0" aria-hidden />
      )}
      <InViewVideo
        key={String(isSafari)}
        src={
          isSafari
            ? "/media/website/globe-loop-bg.mp4"
            : "/media/website/globe-loop.webm"
        }
        className={classes}
        width={2400}
        height={1350}
        style={{ objectFit: "contain" }}
        loop
        muted
        playsInline
        aria-label="A slowly rotating globe"
        onElementReady={(el) => {
          // The Safari MP4 is already slowed in the file; Safari judders when
          // asked to retime a hardware-decoded stream to a non-1 rate.
          el.playbackRate = isSafari ? 1 : 0.75;
        }}
      />
      {isSafari && (
        <div
          className="hero-safari-sky pointer-events-none absolute inset-0 z-[1]"
          aria-hidden
        />
      )}
    </>
  );
}
