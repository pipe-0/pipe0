"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

/* The positioning statement — read once, on the way down from the hero.
   Each word darkens from a faint wash to full ink as it scrolls through the
   middle of the viewport.

   One text node per word, with its colour animated, rather than a muted copy
   under a full-colour overlay: the overlay version put every word in the DOM
   twice, which is what crawlers and answer engines then read.

   Until the section is about to scroll into view, the words are full ink:
   faint type nobody can see yet is still faint type to an accessibility
   check, and the scroll-driven colours take over before the first word
   reaches the screen. */
const STATEMENT =
  "Coding agents sped up engineers. But GTM doesn't run on code. It runs on research, lists, and automations, and that is what pipe0 builds.";

const WORDS = STATEMENT.split(" ");

const FAINT = "rgba(11, 13, 18, 0.14)";
const INK = "rgba(11, 13, 18, 1)";

export function LandingStatement() {
  const targetRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setArmed(true);
        io.disconnect();
      },
      // Watches the words themselves, not the tall section: the section's
      // top can be in view on load while the text is still below the fold
      // (how far depends on the window height). Scroll progress is still 0
      // when the first line appears, so the switch lands on faint words.
      { rootMargin: "0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  /* The section is pinned while the words light up, then the page carries on
     — done with sticky rather than by taking over the scroll: the outer
     element is tall, the inner one sticks, and progress is measured across
     the tall one. Momentum, keyboard paging and reduced motion all keep
     working. */
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  return (
    /* Capped on tall screens: the pinned stage is at most 42rem high and
       sits centred under the header, so a 1440px-tall display doesn't get
       a screen of empty space around four lines of type. */
    <div ref={targetRef} className="relative h-[115vh] sm:h-[min(190vh,1600px)]">
      <div className="sticky top-[22svh] flex h-[56svh] flex-col items-center justify-center sm:top-[max(4rem,calc(50svh-21rem))] sm:h-[min(100svh,42rem)]">
        {/* Normal text flow with real spaces between words — a flex row
            with a gap looked the same but left no spaces in the text, so
            crawlers read "Codingagentssped…". */}
        <p ref={textRef} className="mx-auto max-w-250 text-balance px-6 text-center text-[clamp(24px,2.5vw,36px)] font-medium leading-[1.12] tracking-[-0.04em]">
          {WORDS.map((word, i) => {
            const start = i / WORDS.length;
            return (
              <Word
                key={`${word}-${i}`}
                last={i === WORDS.length - 1}
                progress={scrollYProgress}
                range={[start, start + 1 / WORDS.length]}
                still={!!reduced || !armed}
              >
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </div>
  );
}

function Word({
  children,
  progress,
  range,
  still,
  last,
}: {
  children: string;
  last: boolean;
  progress: MotionValue<number>;
  range: [number, number];
  /** Full ink, no scroll animation. */
  still: boolean;
}) {
  const color = useTransform(progress, range, [FAINT, INK]);
  return (
    <>
      <motion.span style={{ color: still ? INK : color }}>
        {children}
      </motion.span>
      {!last && " "}
    </>
  );
}
