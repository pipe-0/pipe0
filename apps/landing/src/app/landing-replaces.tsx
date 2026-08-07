"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ---- The stack pipe0 collapses ----

   The classic cross-off pattern: when the row scrolls into view, a line
   draws through each tool left to right and the item settles at reduced
   opacity — crossed off the list, not defaced. Deliberately NOT the
   "logo breaks in half" treatment: a neutral rule drawn over the lockup
   leaves the third-party mark itself intact, which is the accepted form
   for comparative use (altering or distorting someone else's mark is
   where tarnishment arguments start).

   One-shot on first view rather than scrubbed by scroll position — the
   statement above already owns the scroll-linked register, and a list you
   can un-cross by scrolling up reads as a toy. Reduced motion gets the
   final state immediately; the end state, not the motion, carries the
   meaning. */

const tools = [
  { name: "Clay", src: "/media/website/logos/replaced-clay.png" },
  { name: "n8n", src: "/media/website/logos/replaced-n8n.png" },
  { name: "Hightouch", src: "/media/website/logos/replaced-hightouch.png" },
  { name: "Polytomic", src: "/media/website/logos/replaced-polytomic.png" },
  { name: "Lusha", src: "/media/website/logos/replaced-lusha.png" },
  {
    name: "BetterContact",
    src: "/media/website/logos/replaced-bettercontact.png",
  },
];

/** Per-item stagger; the full row crosses off in about a second and a half. */
const STAGGER_MS = 150;
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
      /* The section is short, so any plain threshold is met the moment it
         pokes over the bottom edge — and the show plays below the reader's
         gaze. The negative bottom margin ignores the bottom third of the
         viewport entirely: the first line draws only once the row has
         climbed into the zone the eye actually watches. */
      { threshold: 0.5, rootMargin: "0px 0px -33% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host}>
      <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        One system instead of
      </span>
      <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3.5">
        {tools.map((tool, i) => (
          <span
            key={tool.name}
            className="relative flex items-center gap-2.5 transition-[opacity,filter] duration-500 motion-reduce:transition-none"
            style={{
              opacity: struck ? 0.45 : 1,
              filter: struck ? "grayscale(1)" : "none",
              transitionDelay: struck ? `${i * STAGGER_MS + FADE_LAG_MS}ms` : "0ms",
            }}
          >
            {/* White chip in both themes, same treatment as the agent marks
                in the hero router strip — favicons with baked backgrounds
                would otherwise float as odd squares in dark mode. */}
            <span className="flex size-6 shrink-0 items-center justify-center rounded-[6px] border border-[#1c2333]/10 bg-white">
              <Image
                src={tool.src}
                alt=""
                width={16}
                height={16}
                className="size-4 rounded-[3px]"
              />
            </span>
            <span className="text-[19px] font-medium tracking-[-0.015em] text-foreground/70 sm:text-[22px]">
              {tool.name}
            </span>
            {/* The strike — drawn over the whole lockup, slightly past both
                ends so it reads as a stroke of the pen, not an underline
                that slipped. */}
            <span
              aria-hidden
              className="absolute -left-1 -right-1 top-1/2 h-[1.5px] origin-left bg-foreground/60 transition-transform duration-[450ms] ease-out motion-reduce:transition-none"
              style={{
                transform: struck ? "scaleX(1)" : "scaleX(0)",
                transitionDelay: struck ? `${i * STAGGER_MS}ms` : "0ms",
              }}
            />
          </span>
        ))}
      </div>
      <p className="mt-5 max-w-140 text-sm text-muted-foreground">
        Enrichment, automation, and sync.
      </p>
    </div>
  );
}
