"use client";

import { useEffect } from "react";

/**
 * Adds the `in` class to every `.rv` element as it enters the viewport,
 * driving the CSS scroll-reveal stagger. Renders nothing.
 */
export function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    const vh = window.innerHeight || document.documentElement.clientHeight;
    els.forEach((el) => {
      // Reveal immediately anything already even partly in view on load —
      // the observer's negative bottom margin would otherwise leave
      // below-the-fold-but-visible elements hidden until the user scrolls.
      const rect = el.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        el.classList.add("in");
        return;
      }
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return null;
}
