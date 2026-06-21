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
const STATEMENT =
  "Three products, one framework. pipe0 is infrastructure for enrichment and sales automation. Leading sales tools build on our API, sales organizations build growth engines in our app. ";

const WORDS = STATEMENT.split(" ");

export function LandingStatement() {
  const targetRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    // Reveal spans the run from the paragraph entering the lower third to
    // it settling in the upper-middle of the viewport.
    offset: ["start 0.85", "end 0.55"],
  });

  return (
    <div ref={targetRef} className="mx-auto max-w-280">
      <p className="flex flex-wrap justify-center gap-x-[0.26em] gap-y-[0.1em] text-center text-[clamp(25px,3.4vw,48px)] font-semibold leading-[1.22] tracking-[-0.02em]">
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
        Built in <b className="font-serif italic">San Francisco</b> and <b className="font-serif italic">Berlin</b> 📍
      </p>
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
