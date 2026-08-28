"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";

/* The positioning statement — read once, on the way down from the hero.
   Each word lifts from a muted wash to the full foreground as it scrolls
   through the middle of the viewport. The "pipe0" token resolves to the
   inline wordmark. */
const STATEMENT = "Every layer of pipe0 is built from the same primitives. Searches find people. Pipes enrich them. That is the whole system. Small enough to fit in a Slack message, deep enough to run your entire pipeline.";

const WORDS = STATEMENT.split(" ");

export function LandingStatement() {
  const targetRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  /* The section is pinned while the words light up, then the page carries on
     — the usual scroll-hijack shape, done with sticky rather than by taking
     over the scroll: the outer element is tall, the inner one sticks to the
     viewport, and progress is measured across the tall one. Nothing has to
     preventDefault, so trackpad momentum, keyboard paging and reduced-motion
     all keep working. */
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={targetRef} className="relative h-[175vh] sm:h-[230vh]">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center">
        <p className="mx-auto flex max-w-280 flex-wrap justify-center gap-x-[0.26em] gap-y-[0.1em] text-center text-[clamp(25px,3.4vw,48px)] font-semibold leading-[1.22] tracking-[-0.02em]">
          {WORDS.map((word, i) => {
            const start = i / WORDS.length;
            const end = start + 1 / WORDS.length;
            return (
              <Word
                key={`${word}-${i}`}
                progress={scrollYProgress}
                range={[start, end]}
                logo={word === "pipe0"}
                reduced={!!reduced}
              >
                {word}
              </Word>
            );
          })}
        </p>
        <p className="mt-10 text-center text-md font-medium text-muted-foreground sm:mt-12">
          Built in <b className="font-semibold">San Francisco</b> and <b className="font-semibold">Berlin</b> 📍
        </p>
      </div>
    </div>
  );
}

function Word({
  children,
  progress,
  range,
  logo,
  reduced,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  logo: boolean;
  reduced: boolean;
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  const style = { opacity: reduced ? 1 : opacity };

  if (logo) {
    return (
      <span className="relative inline-flex translate-y-[0.08em] items-center">
        {/* Muted base — fades up to the full wordmark on scroll. */}
        <Wordmark className="opacity-15 grayscale" />
        <motion.span
          aria-hidden
          style={style}
          className="absolute inset-0 flex items-center"
        >
          <Wordmark />
        </motion.span>
      </span>
    );
  }

  return (
    <span className="relative">
      {/* Muted base — the resting state every word fades up from. */}
      <span className="text-foreground/15">{children}</span>
      {/* Saturated overlay — fades in across this word's scroll range. */}
      <motion.span
        aria-hidden
        style={style}
        className="absolute inset-0 text-foreground"
      >
        {children}
      </motion.span>
    </span>
  );
}

/* Inline pipe0 wordmark, sized to sit on the text baseline. */
function Wordmark({ className = "" }: { className?: string }) {
  return (
    <>
      <Image
        src="/logo-small-light.svg"
        width={1100}
        height={400}
        alt="pipe0"
        className={`block h-[1em] w-auto dark:hidden ${className}`}
      />
      <Image
        src="/logo-small-dark.svg"
        width={1100}
        height={400}
        alt="pipe0"
        className={`hidden h-[1em] w-auto dark:block ${className}`}
      />
    </>
  );
}
