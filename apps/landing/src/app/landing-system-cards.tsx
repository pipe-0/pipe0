"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ---- Card visuals ----

   The stage is the same calm surface as the closing CTA panel — `--panel`
   behind a `--panel-edge` hairline — so the product UI is the only saturated
   thing in the section. No `.card-sky`, and no `.stage-glossy`: that gloss is
   a reflection read, which needs a dark or saturated fill under it and turns
   milky on a light grey one.

   These two do not use <InViewVideo>. Playback is owned by the grid below,
   which has to decide between sequencing and per-card play, and InViewVideo's
   own observer would fight it by playing whatever is on screen. */

type MediaProps = {
  videoRef: (el: HTMLVideoElement | null) => void;
  onEnded: () => void;
  loop: boolean;
};

/* Shared player attributes.

   H.264/MP4, not the VP9 WebM these used to point at. iOS has no hardware VP9
   decoder, so Safari software-decoded every frame: the demo took seconds to
   appear and juddered once it did. H.264 is hardware-decoded on every phone
   worth caring about, and the transcode also dropped the silent Opus track
   both files were carrying.

   `poster` so the frame is filled the moment the card paints rather than when
   the video is ready, and `preload="metadata"` rather than `auto` so a phone
   does not pull both demos down before either is on screen — the MP4s are
   written +faststart, so playback begins as soon as play() is called.

   No `autoPlay`: the grid decides who plays. `loop` is passed per card,
   because the sequencer needs `ended` to fire and a looping video never
   emits it. */
const playerProps = {
  muted: true,
  playsInline: true,
  preload: "metadata",
} as const;

function FindVisual({ videoRef, onEnded, loop }: MediaProps) {
  return (
    <div className="relative flex h-full items-center justify-center px-6">
      {/* Search demo, centered in a floating frame */}
      <div className="relative w-full max-w-[360px] overflow-hidden rounded-[12px] border border-[#1c2333]/10 bg-white shadow-[0_1px_2px_rgba(14,17,23,0.05),0_14px_36px_rgba(28,35,80,0.10)]">
        <video
          {...playerProps}
          ref={videoRef}
          onEnded={onEnded}
          loop={loop}
          poster="/media/website/search-demo-poster.jpg"
          /* Intrinsic size so the frame holds its height before metadata
             arrives — without it `h-auto` starts at zero and the card's
             contents jump once the poster decodes. */
          width={770}
          height={556}
          className="block h-auto w-full"
          src="/media/website/search-demo.mp4"
        />
      </div>
    </div>
  );
}

function ComposeVisual({ videoRef, onEnded, loop }: MediaProps) {
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
          loop={loop}
          poster="/media/website/provider-demo-poster.jpg"
          className="block aspect-[16/10] w-full object-cover object-top"
          src="/media/website/provider-demo.mp4"
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

/* Above this the cards sit side by side, where playing one demo at a time
   reads as a composed pair rather than two things competing. Below it they are
   stacked and hardly ever both on screen, so passing a baton between them is
   actively wrong: the card you are looking at waits on one you have already
   scrolled past, which is why a phone could sit on a still frame for ten
   seconds. Stacked cards each play for themselves, and loop. */
const SIDE_BY_SIDE = "(min-width: 640px)";

export function LandingSystemCards() {
  const [turn, setTurn] = useState(0);
  /* Per card rather than one flag for the grid: which cards are on screen is
     exactly the question the stacked case needs answered. */
  const [inView, setInView] = useState<boolean[]>(() => cards.map(() => false));
  const [sequenced, setSequenced] = useState(false);
  const hosts = useRef<(HTMLDivElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const handoff = useRef<ReturnType<typeof setTimeout> | null>(null);
  /* `ended` is read in a callback that must not be re-created per turn, so the
     active index is mirrored into a ref. */
  const turnRef = useRef(0);

  useEffect(() => {
    turnRef.current = turn;
  }, [turn]);

  useEffect(() => {
    const mq = window.matchMedia(SIDE_BY_SIDE);
    const update = () => setSequenced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* One observer for the whole section, one entry per card — nothing decodes
     off screen, which is the same reason <InViewVideo> exists. */
  useEffect(() => {
    const els = hosts.current.filter((el): el is HTMLDivElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        setInView((prev) => {
          let next = prev;
          for (const entry of entries) {
            // Indexed against `hosts`, not the filtered list, so a card whose
            // ref has not landed yet cannot shift the others' indices.
            const i = hosts.current.indexOf(entry.target as HTMLDivElement);
            if (i < 0 || prev[i] === entry.isIntersecting) continue;
            if (next === prev) next = [...prev];
            next[i] = entry.isIntersecting;
          }
          return next;
        });
      },
      { threshold: 0.25 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Sequenced play starts each demo from the top. Keyed on `turn` alone, so
     scrolling away and back resumes where it left off rather than restarting.
     Stacked cards are never rewound — a looping demo you scroll back to should
     carry on, not snap to frame zero. */
  useEffect(() => {
    if (!sequenced) return;
    const v = videos.current[turn];
    if (v) v.currentTime = 0;
  }, [turn, sequenced]);

  useEffect(() => {
    const anyInView = inView.some(Boolean);
    videos.current.forEach((v, i) => {
      if (!v) return;
      const wanted = sequenced ? i === turn && anyInView : inView[i];
      if (wanted) {
        // Rejects if interrupted; muted inline playback is always allowed.
        void v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [turn, inView, sequenced]);

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
    <div className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:gap-x-8">
      {cards.map((card, i) => (
        <div
          key={card.title}
          ref={(el) => {
            hosts.current[i] = el;
          }}
          className="min-w-0"
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
              loop={!sequenced}
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
