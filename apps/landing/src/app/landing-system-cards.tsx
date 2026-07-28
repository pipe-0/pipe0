"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ---- Card visuals ----

   The stage is the same calm surface as the closing CTA panel — `--panel`
   behind a `--panel-edge` hairline — so the product UI is the only saturated
   thing in the section. No `.card-sky`, and no `.stage-glossy`: that gloss is
   a reflection read, which needs a dark or saturated fill under it and turns
   milky on a light grey one.

   These two do not use <InViewVideo>. Playback is sequenced by the grid below
   (one observer, one owner), and InViewVideo's own observer would fight it by
   playing whatever is on screen. */

type MediaProps = {
  videoRef: (el: HTMLVideoElement | null) => void;
  onEnded: () => void;
};

/* Shared player attributes. No `loop` — the sequencer needs `ended` to fire —
   and no `autoPlay`, since the grid decides who plays. `auto` because a demo
   that starts buffering only when its turn arrives stalls the handoff. */
const playerProps = {
  muted: true,
  playsInline: true,
  preload: "auto",
} as const;

function FindVisual({ videoRef, onEnded }: MediaProps) {
  return (
    <div className="relative flex h-full items-center justify-center px-6">
      {/* Search demo, centered in a floating frame */}
      <div className="relative w-full max-w-[360px] overflow-hidden rounded-[12px] border border-[#1c2333]/10 bg-white shadow-[0_1px_2px_rgba(14,17,23,0.05),0_14px_36px_rgba(28,35,80,0.10)]">
        <video
          {...playerProps}
          ref={videoRef}
          onEnded={onEnded}
          className="block h-auto w-full"
          src="/media/website/search-demo.webm"
        />
      </div>
    </div>
  );
}

function ComposeVisual({ videoRef, onEnded }: MediaProps) {
  return (
    <div className="relative flex h-full items-center justify-center px-6">
      {/* The demo plays inside a floating frame */}
      <div className="relative w-full max-w-[340px] overflow-hidden rounded-[12px] border border-[#1c2333]/10 bg-white shadow-[0_1px_2px_rgba(14,17,23,0.05),0_14px_36px_rgba(28,35,80,0.10)]">
        <div className="flex items-center gap-1.5 border-b border-[#1c2333]/8 bg-[#f7f9fc] px-3 py-2">
          <span className="size-2 rounded-full bg-[#1c2333]/15" />
          <span className="size-2 rounded-full bg-[#1c2333]/15" />
          <span className="size-2 rounded-full bg-[#1c2333]/15" />
          <span className="ml-1.5 text-[10px] font-medium text-[#5b6478]">
            pipe0 · Enrichments
          </span>
        </div>
        <video
          {...playerProps}
          ref={videoRef}
          onEnded={onEnded}
          className="block aspect-[16/10] w-full object-cover object-top"
          src="/media/website/provider-demo.webm"
        />
      </div>
    </div>
  );
}

/* ---- The grid ---- */

const cards = [
  {
    title: "Find who you're looking for",
    copy: "One query runs across multiple datasets at once, not one provider at a time. Curated premium sources instead of a long chain of low-end ones — great coverage, and faster results.",
    Visual: FindVisual,
  },
  {
    title: "Compose enrichments",
    copy: "Stack hundreds of enrichments like work email, verification, and company data. Connect CRM, ATS, survey, and sequencing tools without writing code.",
    Visual: ComposeVisual,
  },
];

/** Beat of stillness between one demo finishing and the next starting. */
const HANDOFF_MS = 1000;

export function LandingSystemCards() {
  const [turn, setTurn] = useState(0);
  const [inView, setInView] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const handoff = useRef<ReturnType<typeof setTimeout> | null>(null);
  /* `ended` is read in a callback that must not be re-created per turn, so the
     active index is mirrored into a ref. */
  const turnRef = useRef(0);

  useEffect(() => {
    turnRef.current = turn;
  }, [turn]);

  /* One observer for the whole section — nothing decodes off screen, which is
     the same reason <InViewVideo> exists. */
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Play the demo whose turn it is from the top. Keyed on `turn` alone, so
     scrolling away and back resumes where it left off rather than restarting. */
  useEffect(() => {
    const v = videos.current[turn];
    if (v) v.currentTime = 0;
  }, [turn]);

  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === turn && inView) {
        // Rejects if interrupted; muted inline playback is always allowed.
        void v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [turn, inView]);

  useEffect(
    () => () => {
      if (handoff.current) clearTimeout(handoff.current);
    },
    [],
  );

  const handleEnded = useCallback((i: number) => {
    // A paused-then-resumed demo can emit a stale `ended`; only the card whose
    // turn it actually is may pass the baton.
    if (i !== turnRef.current) return;
    if (handoff.current) clearTimeout(handoff.current);
    handoff.current = setTimeout(() => {
      setTurn((t) => (t + 1) % cards.length);
    }, HANDOFF_MS);
  }, []);

  return (
    <div
      ref={gridRef}
      className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:gap-x-8"
    >
      {cards.map((card, i) => (
        <div
          key={card.title}
          className="rv min-w-0"
          style={{ ["--rv-delay" as string]: `${i * 80}ms` }}
        >
          {/* The bordered panel binds each image to its own copy, so the
              mobile-only box that used to wrap image and text together is no
              longer needed — it would just read as a border inside a border.

              Two-up rather than three, so each card is wide enough for a
              landscape stage; the old 387/280 ratio would run ~450px tall at
              this width. */}
          <div className="relative mb-4 h-[260px] min-w-0 overflow-hidden rounded-[16px] border border-[var(--panel-edge)] bg-[var(--panel)] sm:h-[300px] lg:h-auto lg:aspect-[16/10]">
            <card.Visual
              videoRef={(el) => {
                videos.current[i] = el;
              }}
              onEnded={() => handleEnded(i)}
            />
          </div>
          <h3 className="mb-1.5 text-[16px] font-semibold tracking-[-0.01em] text-foreground">
            {card.title}
          </h3>
          <p className="max-w-[560px] text-sm leading-relaxed text-muted-foreground">
            {card.copy}
          </p>
        </div>
      ))}
    </div>
  );
}
