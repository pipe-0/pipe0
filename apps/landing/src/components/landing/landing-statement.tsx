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
   reaches the screen.

   The shape: the question, then the answer as three accelerations
   (research, testing, building), then two short beats: that world needs a new kind of tool, and we built
   it. "That world" picks up "In that world". It doesn't name pipe0;
   the next section does. If it ever does, the brand appears as its small
   mark in place of the word: the cube from the header, set in the line like a
   word. The word itself stays in the text, visually hidden, so it is what
   screen readers and crawlers read. */
const STATEMENT =
  "We work backwards from one question: how should GTM work with agents? In that world, research takes minutes, every idea gets tested, and anyone can build production systems without being an engineer. That\u00a0world needs a new kind of tool.";

// "That\u00a0world" and "So\u00a0we\u00a0built\u00a0one." are single tokens,
// so each closing beat starts whole on its line instead of stranding a
// word.

const WORDS = STATEMENT.split(" ");

const FAINT = "rgba(11, 13, 18, 0.14)";
const INK = "rgba(11, 13, 18, 1)";
/* The brand word, with whatever punctuation follows it. */
const isBrand = (word: string | undefined) => !!word?.startsWith("pipe0");

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
        <p
          ref={textRef}
          className="mx-auto max-w-250 text-balance px-6 text-center text-[clamp(24px,2.5vw,36px)] font-medium leading-[1.12] tracking-[-0.04em] max-sm:text-pretty"
        >
          {WORDS.map((word, i) =>
            // The word before the mark is drawn with it, so "With [mark],"
            // never splits across lines.
            isBrand(WORDS[i + 1]) ? null : (
              <Word
                key={`${word}-${i}`}
                last={i === WORDS.length - 1}
                lead={isBrand(word) ? WORDS[i - 1] : undefined}
                progress={scrollYProgress}
                range={[i / WORDS.length, (i + 1) / WORDS.length]}
                still={!!reduced || !armed}
              >
                {word}
              </Word>
            ),
          )}
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
  lead,
}: {
  children: string;
  last: boolean;
  /** The mark's preceding word, drawn in the same unbreakable run. */
  lead?: string;
  progress: MotionValue<number>;
  range: [number, number];
  /** Full ink, no scroll animation. */
  still: boolean;
}) {
  const color = useTransform(progress, range, [FAINT, INK]);
  // The mark fades the way the words darken: from the faint wash to full.
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <>
      {isBrand(children) ? (
        <span className="whitespace-nowrap">
          <motion.span style={{ color: still ? INK : color }}>
            {lead}
          </motion.span>{" "}
          <motion.span style={{ opacity: still ? 1 : opacity }}>
            <img
              src="/logo-small-light.svg"
              alt=""
              aria-hidden
              width={1194}
              height={1215}
              className="inline-block h-[0.9em] w-auto align-[-0.14em]"
            />
            <span className="sr-only">pipe0</span>
            <motion.span style={{ color: still ? INK : color }}>
              {children.slice("pipe0".length)}
            </motion.span>
          </motion.span>
        </span>
      ) : (
        <motion.span style={{ color: still ? INK : color }}>
          {children}
        </motion.span>
      )}
      {!last && " "}
    </>
  );
}
