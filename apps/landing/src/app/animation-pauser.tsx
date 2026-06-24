"use client";

import { useEffect } from "react";

/**
 * Pauses the heavy, infinitely-animating decorative gradient layers
 * (`.hero-sky`, `.card-sky`) whenever they scroll out of view, and resumes
 * them before they return. Each is a full-bleed, GPU-promoted layer running a
 * never-ending animation; left ticking off-screen they keep the compositor
 * (and the laptop fan) busy for no visible benefit.
 *
 * This is purely a performance measure — the elements are off-screen while
 * paused, so there is no visible change. Renders nothing.
 */
export function AnimationPauser() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const els = document.querySelectorAll<HTMLElement>(".hero-sky, .card-sky");
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // `data-idle` drives `animation-play-state: paused` in globals.css.
          if (entry.isIntersecting) {
            delete (entry.target as HTMLElement).dataset.idle;
          } else {
            (entry.target as HTMLElement).dataset.idle = "true";
          }
        }
      },
      // Generous margin so the swap always happens well off-screen — a paused
      // layer is never visible mid-transition.
      { rootMargin: "300px" },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
