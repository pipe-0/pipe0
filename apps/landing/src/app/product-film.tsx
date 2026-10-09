"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import posthog from "posthog-js";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The site's films, with sound.
 *
 * Nothing on the page decodes one until someone asks: the poster is DOM, not a
 * frame of the film, and the <video> only mounts inside the lightbox (Radix
 * unmounts closed content), so the file costs nothing on a page view.
 *
 * Each poster carries one line from its film, in the film's own two-tone
 * form — which is the site's heading form too (see SectionHeading), so the
 * poster reads as part of the page rather than a pasted-in thumbnail.
 */

type Chapter = { at: number; title: string; tail?: string };

/** Cloudflare Stream customer subdomain; films hosted there play in its player. */
const STREAM_HOST = "https://customer-n1fwmijqbwqwvpt9.cloudflarestream.com";

type Film = {
  id: string;
  /** Either a file under /public, played in our own <video>, or a Cloudflare
   *  Stream video id, played in Stream's iframe (adaptive bitrate, and too
   *  large for a static asset). Chapters need `src`: the iframe has no
   *  currentTime we can read or seek. */
  src?: string;
  stream?: string;
  duration: string;
  label: string;
  title: string;
  tail?: string;
  /** Wayfinding dots under the film in the lightbox. */
  chapters?: Chapter[];
};

const FILMS = {
  /** The story of automation, from RPA to agents, and where pipe0 fits. */
  intro: {
    id: "intro",
    stream: "dd7471f30a94a000c1fcfbc76ff41dc0",
    duration: "2:40",
    label: "pipe0 intro film",
    title: "Automation that scales",
    tail: "your ideas.",
  },
  /** The product tour. */
  product: {
    id: "product",
    src: "/media/website/pipe0-product-film-v11-sound.mp4",
    duration: "0:55",
    label: "pipe0 product film",
    title: "One sentence.",
    tail: "A shared sheet.",
    /* Start times sit a beat before each title card fades in. */
    chapters: [
      { at: 0, title: "Any list.", tail: "The right source." },
      { at: 17, title: "One sentence.", tail: "A shared sheet." },
      { at: 23, title: "Millions of rows." },
      { at: 27, title: "Monitors that stay live." },
      { at: 34, title: "One core.", tail: "Every interface." },
      { at: 40, title: "Why pipe0." },
    ],
  },
} satisfies Record<string, Film>;

function stamp(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function track(film: Film, where: string) {
  if (posthog.__loaded)
    posthog.capture("product_film_opened", { where, film: film.id });
}

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------

function FilmLightbox({
  film,
  open,
  onOpenChange,
}: {
  film: Film;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [current, setCurrent] = useState(0);

  const chapters = film.chapters;

  const seek = (i: number) => {
    const el = video.current;
    if (!el || !chapters) return;
    el.currentTime = chapters[i].at;
    void el.play().catch(() => {});
  };

  const active = (chapters ?? []).reduce(
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
            {film.label}
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
              {film.stream ? (
                <iframe
                  src={`${STREAM_HOST}/${film.stream}/iframe?autoplay=true&preload=auto`}
                  title={film.label}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="block aspect-video w-full border-0"
                />
              ) : (
                <video
                  ref={video}
                  src={film.src}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  className="block aspect-video w-full"
                  onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
                />
              )}
            </div>

            {/* Optional wayfinding: where the film is, and a way to jump. */}
            {chapters && (
              <div className="mt-5 flex justify-center">
                <ChapterDots
                  chapters={chapters}
                  active={active}
                  onSelect={seek}
                />
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** Open/close state for the lightbox. */
function useFilm(film: Film, where: string) {
  const [open, setOpen] = useState(false);
  const play = () => {
    setOpen(true);
    track(film, where);
  };
  const lightbox = (
    <FilmLightbox film={film} open={open} onOpenChange={setOpen} />
  );
  return { play, lightbox };
}

// ---------------------------------------------------------------------------
// Chapter dots — past chapters solid, the current one a pill, the rest faint
// ---------------------------------------------------------------------------

function ChapterDots({
  chapters,
  active,
  onSelect,
}: {
  chapters: Chapter[];
  active: number;
  /** Jumps to the chapter at this index. */
  onSelect: (index: number) => void;
}) {
  return (
    <span className="flex items-center">
      {chapters.map((c, i) => (
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
              "block h-2 rounded-full transition-[width,background-color] duration-500 ease-out motion-reduce:transition-none",
              i === active ? "w-6" : "w-2",
              i <= active ? "bg-white" : "bg-white/25",
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

/**
 * The same film behind a small inline button, for places where the film is a
 * footnote to the copy rather than a section of its own.
 */
export function FilmButton({
  film: name,
  where,
  children,
}: {
  film: keyof typeof FILMS;
  where: string;
  children: ReactNode;
}) {
  const film: Film = FILMS[name];
  const { play, lightbox } = useFilm(film, where);

  return (
    <>
      <button
        type="button"
        onClick={() => play()}
        aria-label={`Play the ${film.label} (${film.duration})`}
        className="group inline-flex h-11 items-center gap-3 rounded-[6px] border border-[var(--rule-strong)] bg-background pl-1.5 pr-4 text-[14px] font-medium text-foreground outline-none transition-colors hover:bg-[var(--well)] focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="grid size-8 place-items-center rounded-[4px] bg-primary text-white">
          <PlayGlyph className="size-3" />
        </span>
        {children}
        <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
          {film.duration}
        </span>
      </button>
      {lightbox}
    </>
  );
}
