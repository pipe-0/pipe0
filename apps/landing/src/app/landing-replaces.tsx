"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ---- The stack pipe0 collapses ----

   Ten tools, one cell each, crossed off when the block scrolls into view.
   Logos are recognised before names are read, which is the whole point of a
   "simplify your stack" section. The rule is drawn over the lockup, leaving
   each third-party mark itself intact (no distortion or recolouring of the
   mark beyond the shared greyscale fade).

   One-shot on first view rather than scrubbed by scroll — the statement
   already owns the scroll-linked register. Reduced motion gets the end state
   immediately; the end state, not the motion, carries the meaning. */

const tools = [
  { name: "Clay", src: "/media/website/logos/replaced-clay.png" },
  { name: "Deepline", src: "/media/website/logos/replaced-deepline.png" },
  { name: "Landbase", src: "/media/website/logos/replaced-landbase.png" },
  { name: "Zapier", src: "/media/website/logos/replaced-zapier.png" },
  { name: "n8n", src: "/media/website/logos/replaced-n8n.png" },
  { name: "Chili Piper", src: "/media/website/logos/replaced-chilipiper.png" },
  { name: "Hightouch", src: "/media/website/logos/replaced-hightouch.png" },
  { name: "Polytomic", src: "/media/website/logos/replaced-polytomic.png" },
  { name: "Lusha", src: "/media/website/logos/replaced-lusha.png" },
  {
    name: "BetterContact",
    src: "/media/website/logos/replaced-bettercontact.png",
  },
];

/** Per-cell stagger; the whole grid crosses off in about a second. */
const STAGGER_MS = 80;
/** The fade trails its own strike, so the line lands on a still-solid item. */
const FADE_LAG_MS = 220;

export function LandingReplaces() {
  const host = useRef<HTMLDivElement>(null);
  const [struck, setStruck] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Jumping straight to the crossed-off end state IS the reduced-motion
      // behavior, not a derived value; set once on mount, no cascade.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStruck(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStruck(true);
          io.disconnect();
        }
      },
      /* Ignore the bottom third of the viewport, so the strikes draw where
         the eye actually is rather than just below it. */
      { threshold: 0.35, rootMargin: "0px 0px -33% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host}>
      <div className="grid gap-6 px-6 pb-10 pt-12 sm:px-10 sm:pb-12 sm:pt-16 lg:grid-cols-12 lg:items-end lg:gap-12 lg:px-12">
        <h2 className="text-[clamp(28px,2.3vw,32px)] font-medium leading-[1.02] tracking-[-0.04em] text-foreground lg:col-span-8">
          From a tangled stack to one platform.
        </h2>
        <p className="max-w-[40ch] text-[17px] leading-relaxed text-muted-foreground lg:col-span-4 lg:justify-self-end lg:pb-2">
          Enrichment, lists, routing, sync, and automations, orchestrated in
          one place instead of spread across tools like these.
        </p>
      </div>

      <ul
        aria-label="Tools pipe0 replaces"
        className="grid grid-cols-2 gap-px border-t border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-5"
      >
        {tools.map((tool, i) => (
          <li
            key={tool.name}
            className="flex h-28 items-center justify-center bg-background px-4 sm:h-32"
          >
            <span
              className="relative flex items-center gap-3 transition-[opacity,filter] duration-500 motion-reduce:transition-none"
              style={{
                opacity: struck ? 0.4 : 1,
                filter: struck ? "grayscale(1)" : "none",
                transitionDelay: struck
                  ? `${i * STAGGER_MS + FADE_LAG_MS}ms`
                  : "0ms",
              }}
            >
              <Image
                src={tool.src}
                alt=""
                width={32}
                height={32}
                className="size-6 shrink-0 rounded-[5px] object-contain"
              />
              <span className="text-[17px] font-medium tracking-[-0.015em] text-foreground sm:text-[18px]">
                {tool.name}
              </span>
              {/* The strike — over the whole lockup, a little past both
                  ends, so it reads as a stroke of the pen. */}
              <span
                aria-hidden
                className="absolute -left-1.5 -right-1.5 top-1/2 h-[1.5px] origin-left bg-foreground transition-transform duration-[420ms] ease-out motion-reduce:transition-none"
                style={{
                  transform: struck ? "scaleX(1)" : "scaleX(0)",
                  transitionDelay: struck ? `${i * STAGGER_MS}ms` : "0ms",
                }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
