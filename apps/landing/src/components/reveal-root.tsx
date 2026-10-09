"use client";

import { useEffect } from "react";

/**
 * Scroll reveals for the landing pages. Marks every `[data-reveal]` element
 * with `data-in` the first time it scrolls into view; globals.css does the
 * motion. The hidden starting state only applies once `html.reveal-on` is
 * set here, so without JavaScript — or with reduced motion — everything is
 * simply visible.
 */
export function RevealRoot() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-in", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    const watch = () => {
      for (const el of document.querySelectorAll("[data-reveal]:not([data-in])")) {
        // Already on screen at load: show without animating.
        const r = el.getBoundingClientRect();
        if (!root.classList.contains("reveal-on") && r.top < window.innerHeight * 0.88) {
          el.setAttribute("data-in", "");
          continue;
        }
        io.observe(el);
      }
    };
    watch();
    root.classList.add("reveal-on");
    return () => {
      io.disconnect();
      root.classList.remove("reveal-on");
    };
  }, []);
  return null;
}
