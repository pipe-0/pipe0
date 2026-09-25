"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import posthog from "posthog-js";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The product film — 55 seconds, with sound.
 *
 * Nothing on the page decodes it until someone asks: the poster is DOM, not a
 * frame of the film, and the <video> only mounts inside the lightbox (Radix
 * unmounts closed content), so the 9MB file costs nothing on a page view.
 *
 * Chapter titles are the film's own title cards, and in the film's own
 * two-tone form — which is the site's heading form too (see SectionHeading),
 * so the poster reads as part of the page rather than a pasted-in thumbnail.
 */

const SRC = "/media/website/pipe0-product-film-v11-sound.mp4";
const DURATION = "0:55";

type Chapter = { at: number; title: string; tail?: string };

/* Start times sit a beat before each title card fades in. */
const CHAPTERS: Chapter[] = [
  { at: 0, title: "Any list.", tail: "The right source." },
  { at: 17, title: "One sentence.", tail: "A shared sheet." },
  { at: 23, title: "Millions of rows." },
  { at: 27, title: "Monitors that stay live." },
  { at: 34, title: "One core.", tail: "Every interface." },
  { at: 40, title: "Why pipe0." },
];

function stamp(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function track(where: string) {
  if (posthog.__loaded) posthog.capture("product_film_opened", { where });
}

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------

function FilmLightbox({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [current, setCurrent] = useState(0);

  const seek = (i: number) => {
    const el = video.current;
    if (!el) return;
    el.currentTime = CHAPTERS[i].at;
    void el.play().catch(() => {});
  };

  const active = CHAPTERS.reduce(
    (idx, c, i) => (current >= c.at - 0.25 ? i : idx),
    0,
  );

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="film-overlay fixed inset-0 z-50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 py-14 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] sm:px-8"
          onClick={(e) => {
            // A click on the backdrop around the film closes it; clicks on
            // the film or the dots land on their own elements.
            if (e.target === e.currentTarget) onOpenChange(false);
          }}
        >
          <DialogPrimitive.Title className="sr-only">
            pipe0 product film
          </DialogPrimitive.Title>
          <DialogPrimitive.Close
            aria-label="Close film"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/15 bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:right-6 sm:top-6"
          >
            <XIcon className="size-4.5" />
          </DialogPrimitive.Close>

          {/* Width is capped by the viewport height too, so the film and the
              dots below it always fit on screen together. */}
          <div className="w-full max-w-[min(1280px,calc((100svh-160px)*16/9))]">
            <div className="overflow-hidden rounded-[14px] bg-[#f4f4f6] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_40px_120px_rgba(0,0,0,0.5)]">
              <video
                ref={video}
                src={SRC}
                controls
                autoPlay
                playsInline
                preload="auto"
                className="block aspect-video w-full"
                onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
              />
            </div>

            {/* Optional wayfinding: where the film is, and a way to jump. */}
            <div className="mt-5 flex justify-center">
              <ChapterDots active={active} tone="dark" onSelect={seek} />
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** Open/close state for the lightbox. */
function useFilm(where: string) {
  const [open, setOpen] = useState(false);
  const play = () => {
    setOpen(true);
    track(where);
  };
  const lightbox = <FilmLightbox open={open} onOpenChange={setOpen} />;
  return { play, lightbox };
}

// ---------------------------------------------------------------------------
// Chapter dots — past chapters solid, the current one a pill, the rest faint
// ---------------------------------------------------------------------------

function ChapterDots({
  active,
  tone,
  onSelect,
}: {
  active: number;
  tone: "light" | "dark";
  /** Makes each dot a button that jumps to its chapter. */
  onSelect?: (index: number) => void;
}) {
  const dot = (i: number) =>
    cn(
      "block h-2 rounded-full transition-[width,background-color] duration-500 ease-out motion-reduce:transition-none",
      i === active ? "w-6" : "w-2",
      tone === "light"
        ? i <= active
          ? "bg-foreground"
          : "bg-foreground/20"
        : i <= active
          ? "bg-white"
          : "bg-white/25",
    );

  if (!onSelect) {
    return (
      <span aria-hidden className="flex items-center gap-2">
        {CHAPTERS.map((c, i) => (
          <span key={c.at} className={dot(i)} />
        ))}
      </span>
    );
  }
  return (
    <span className="flex items-center">
      {CHAPTERS.map((c, i) => (
        <button
          key={c.at}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`${c.title}${c.tail ? ` ${c.tail}` : ""} (${stamp(c.at)})`}
          aria-current={i === active ? "step" : undefined}
          title={c.title}
          // Padding gives each 8px dot a larger hit area.
          className="group/dot px-1 py-2.5 outline-none"
        >
          <span
            className={cn(
              dot(i),
              "group-hover/dot:bg-white group-focus-visible/dot:ring-2 group-focus-visible/dot:ring-white/60",
            )}
          />
        </button>
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Play glyph
// ---------------------------------------------------------------------------

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className}>
      {/* Optically centred: nudged right of the box's centre. */}
      <path
        d="M5.2 3.1c0-.8.9-1.3 1.6-.9l6.3 4c.6.4.6 1.3 0 1.7l-6.3 4c-.7.4-1.6 0-1.6-.9z"
        fill="currentColor"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Stage — the section-sized poster
// ---------------------------------------------------------------------------

const CYCLE_MS = 3400;

/** Cycles the chapter titles on the poster while it is on screen. */
function useCycle(length: number, ms: number) {
  const host = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0;
    const io = new IntersectionObserver(([entry]) => {
      window.clearInterval(id);
      if (entry?.isIntersecting) {
        id = window.setInterval(() => setIndex((n) => (n + 1) % length), ms);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [length, ms]);
  return { host, index };
}

function ChapterTitle({ index }: { index: number }) {
  return (
    <span className="grid">
      {CHAPTERS.map((c, i) => (
        <span
          key={c.at}
          aria-hidden={i !== index}
          className={cn(
            "col-start-1 row-start-1 transition-[opacity,filter,transform] duration-700 ease-out motion-reduce:transition-none",
            i === index
              ? "opacity-100 blur-0"
              : "translate-y-1.5 opacity-0 blur-[6px]",
          )}
        >
          <span className="text-foreground">{c.title}</span>
          {c.tail && <span className="text-muted-foreground"> {c.tail}</span>}
        </span>
      ))}
    </span>
  );
}

/**
 * Not a frame of the film. A still gives the ending away and, at this size,
 * reads as a screenshot with a button on it. Instead the stage is the film's
 * own near-white backdrop, its title cards cycle in the middle, and the
 * product rises out of the bottom edge on a slight tilt, fading before it is
 * fully shown — enough to say "this is the product" without saying what it
 * does. The dots under the title say how far through the chapters it is.
 */
export function FilmStage({ where }: { where: string }) {
  const { play, lightbox } = useFilm(where);
  const { host, index } = useCycle(CHAPTERS.length, CYCLE_MS);

  return (
    <div ref={host}>
      <button
        type="button"
        onClick={() => play()}
        aria-label={`Play the pipe0 product film (${DURATION})`}
        className="group block w-full rounded-[18px] text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="film-stage relative aspect-square w-full overflow-hidden rounded-[18px] border border-[var(--panel-edge)] [perspective:1400px] sm:aspect-[2.1/1]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/website/product-film-still.jpg"
            alt=""
            loading="lazy"
            className="film-horizon absolute left-1/2 top-[73%] w-[165%] max-w-none rounded-[14px] border border-[#1c2333]/8 sm:top-[52%] sm:w-[76%]"
          />

          <div className="absolute inset-x-0 top-[14%] flex flex-col items-center px-6 text-center sm:top-[17%]">
            <span className="text-[clamp(26px,3.2vw,44px)] font-semibold leading-[1.15] tracking-[-0.025em]">
              <ChapterTitle index={index} />
            </span>
            <span className="mt-5">
              <ChapterDots active={index} tone="light" />
            </span>
            <span className="film-play mt-6 inline-flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-5 text-[15px] font-medium text-white sm:mt-7">
              <span className="grid size-9 place-items-center rounded-full bg-white text-[#2c37a4]">
                <PlayGlyph className="size-3.5" />
              </span>
              Play film
              <span className="font-mono text-[12.5px] tabular-nums text-white/70">
                {DURATION}
              </span>
            </span>
          </div>
        </div>
      </button>

      {lightbox}
    </div>
  );
}
