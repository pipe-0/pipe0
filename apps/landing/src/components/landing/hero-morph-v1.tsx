import { Mail, Play, Sparkles, User } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import {
  colours,
  tag,
  type Colour,
} from "@/components/landing/landing-well";

/**
 * Hero film, first helper version, kept at Florian's request (2026-11-13:
 * "I actually really like the current version, so definitely save this
 * one"). Not on the page. To put it back, import `HeroMorphV1` from this
 * file in routes/_landing/index.tsx in place of `HeroMorph`. It uses the
 * same pictures as the current film (public/media/website/film), so do not
 * change those files without checking this one.
 *
 * What it shows that the current film does not: one prompt for the whole
 * film, a team that arrives and presses Run, and a new row that arrives on
 * the schedule.
 *
 * Hero film: one piece of work, in three places.
 *
 * It opens in a coding agent's terminal. Someone asks for a list; the agent
 * calls pipe0 and prints three people. Then the terminal becomes a sheet:
 * its window widens, its dark rolls up like a blind into a bar that keeps
 * the prompt, and the three printed lines grow into three rows, their
 * pixel portraits sharpening into photographs. The terminal's cursor drops
 * off the prompt into the first empty cell, and when it lands it is the
 * pipe0 helper: it was the same thing all along. It works down the column,
 * and across, trying providers one tile at a time until one finds the
 * address, then reading up why now is the moment to write. The team shows
 * up, and one of them presses Run, which becomes an alarm clock.
 * Night passes with nobody there; the clock rings, a new row arrives, and
 * the helper does it alone. Then it hops back onto the prompt, squares off
 * into a cursor, and the blind comes down.
 *
 * The sheet is not a copy of the product. It is the idea of it at a size a
 * landing page can show: three big rows, a column that is a job done for
 * every row, a waterfall of providers per cell, and somebody doing the
 * work. No provider logos; the providers are the plastic tiles.
 *
 * Flat things are DOM, so type stays crisp and nothing loads but a few
 * small pictures: the helper's poses, the clock and the portraits, made
 * with fal.ai (assets/illustrations/film_fal.md). The helper is animated
 * pose to pose, like a toy in stop motion, and moved from here.
 *
 * Authored in a fixed 1200x500 space and scaled by `.hero-scene`; every
 * number below is in that space. Frames are 30 a second. To look at one
 * frame, open the page with ?film=<frame>.
 *
 * The film it replaced is hero-film.tsx (kept).
 */

const FPS = 30;
const MEDIA = "/media/website/film";
const MONO = "var(--font-geist-mono), ui-monospace, monospace";
/** The scene's box is 500 tall; the sheet runs on below it and is cut off
 *  by the band's edge. */
const DEPTH = 700;

/* ---- Motion ---- */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => 1 - (1 - t) ** 3;
const inOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const glide = (t: number) => t * t * (3 - 2 * t);
const prog = (frame: number, start: number, dur: number) =>
  ease(clamp01((frame - start) / dur));
/** A spring's travel from 0 to 1. `period` is roughly how many frames it
 *  takes to arrive; `bounce` 0 does not overshoot, 0.5 clearly does. */
function spring(frame: number, start: number, period: number, bounce = 0.2) {
  const t = (frame - start) / period;
  if (t <= 0) return 0;
  if (t > 3) return 1;
  const z = 1 - bounce;
  const w = Math.PI * 2;
  const wd = w * Math.sqrt(1 - z * z) || 1e-6;
  return (
    1 -
    Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t))
  );
}
function bounceOut(t: number) {
  const n = 7.5625;
  const d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
  return n * (t -= 2.625 / d) * t + 0.984375;
}
/** The same number every time for the same n: a typist's uneven rhythm. */
const noise = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ---- The story's data ---- */

type Person = {
  name: string;
  title: string;
  company: string;
  email: string;
  /** Its square in faces.webp. */
  face: number;
  /** The providers tried for its email, in order; the last one finds it. */
  tries: Colour[];
  tags: [string, Colour][];
};

/** Three the agent prints, and one of its "22 more". */
const PEOPLE: Person[] = [
  {
    name: "Lucia Ferraro",
    title: "Head of Growth",
    company: "Fernhill",
    email: "lucia@fernhill.com",
    face: 0,
    tries: ["indigo"],
    tags: [
      ["Raised Series B", "indigo"],
      ["Hiring SDRs", "yellow"],
    ],
  },
  {
    name: "Noah Becker",
    title: "VP Growth",
    company: "Oakridge",
    email: "noah@oakridge.so",
    face: 1,
    tries: ["indigo", "yellow"],
    tags: [
      ["New CRO", "coral"],
      ["Raised Series B", "indigo"],
    ],
  },
  {
    name: "Amara Okafor",
    title: "VP Marketing",
    company: "Vireo",
    email: "amara@vireo.app",
    face: 2,
    tries: ["indigo", "yellow", "coral"],
    tags: [
      ["Hiring SDRs", "yellow"],
      ["New pricing", "indigo"],
    ],
  },
  {
    name: "Maya Lindqvist",
    title: "Head of Growth",
    company: "Helio Labs",
    email: "maya@heliolabs.com",
    face: 4,
    tries: ["indigo"],
    tags: [],
  },
];
/** The one the schedule brings. */
const NEXT: Person = {
  name: "Tom Hughes",
  title: "Growth Lead",
  company: "Castellan",
  email: "tom@castellan.io",
  face: 3,
  tries: ["indigo"],
  tags: [
    ["Raised Series B", "indigo"],
    ["Hiring SDRs", "yellow"],
  ],
};
const TEAM_FACES = [5, 6, 7];

const ASK = [
  "Find growth leaders at Series B SaaS startups",
  "with their work emails and why now.",
];

/* ---- Geometry ---- */

/** The terminal, and the sheet it becomes. */
const A = { x: 216, y: 46, w: 768, h: 378 };
/** The terminal's layout, measured from its top-left corner: the centre
 *  line of each row of text, and where each thing starts across. */
const TERM = {
  pad: 26,
  strip: 36,
  ask: 70,
  lead: 26,
  tool1: 142,
  rule1: 166,
  line: 190,
  pitch: 34,
  rule2: 282,
  tool2: 306,
  box: 326,
  mark: 42,
  text: 60,
  name: 64,
  title: 276,
  company: 510,
};
const B = { x: 80, y: 92, w: 1040, h: 580 };
const BAR = 52;
const HEAD = 40;
const ROW = 88;
/** Where the dark stops, and where the rows start. */
const TOP = B.y + BAR;
const ROWS = TOP + HEAD;
/** The two walls between the three columns. */
const WALL = [B.x + 372, B.x + 706];
const FACE_X = B.x + 24;
const TEXT_X = B.x + 96;
const slotY = (slot: number) => ROWS + ROW * slot + ROW / 2;
/** Where the helper's feet stand in a row. */
const feet = (slot: number) => ROWS + ROW * (slot + 1) - 9;
/** It stands at the right of a cell, so what it finds can sit at the left
 *  and the column's name stays in view above it. */
const MAIL_X = WALL[0] + 272;
const WHY_X = WALL[1] + 290;

/** The terminal's printed lines. */
const LINE_Y = (i: number) => A.y + TERM.line + TERM.pitch * i;
const CW = 9.6; // Geist Mono at 16px: every glyph is 0.6em wide
/** The prompt in the bar: one line, a touch smaller. */
const BAR_X = B.x + 62;
const BAR_CW = 8.7;
const BAR_Y = B.y + BAR / 2;
/** The cursor's seat at the end of the prompt, in the bar. */
const SEAT_X = BAR_X + (ASK[0].length + 1 + ASK[1].length) * BAR_CW + 6;
const RUN_X = B.x + B.w - 54;
const PERCH = { x: RUN_X - 88, y: B.y + 9 };

/* ---- Time, in frames ---- */

function keystrokes(text: string, start: number, seed: number) {
  const at: number[] = [];
  let t = start;
  for (let k = 0; k < text.length; k++) {
    t +=
      0.34 +
      noise(seed + k) * 0.56 +
      (text[k - 1] === " " ? noise(seed * 3 + k) * 0.5 : 0);
    at.push(t);
  }
  return at;
}
const KEYS = [keystrokes(ASK[0], 12, 1)];
KEYS.push(keystrokes(ASK[1], KEYS[0][KEYS[0].length - 1] + 1.5, 2));
const ENTER = Math.ceil(KEYS[1][KEYS[1].length - 1]) + 5;
const TOOL1 = ENTER + 8;
const FOUND = TOOL1 + 15;
const LINE = [FOUND + 2, FOUND + 7, FOUND + 12];
const TOOL2 = FOUND + 19;
const MADE = TOOL2 + 13;
/** The terminal starts to become the sheet. */
const M = MADE + 6;
/** The cursor tips off the prompt; and the frame it lands as the helper. */
const TIP = M + 44;
const BORN = TIP + 17;

type Job = { start: number; done: number; leave: number };
/** An email cell: a glance, then one try every nine frames. */
const mailJob = (start: number, tries: number): Job => {
  const done = start + 8 + (tries - 1) * 9 + 6;
  return { start, done, leave: done + 10 };
};
const whyJob = (start: number): Job => ({
  start,
  done: start + 9,
  leave: start + 16,
});
/** Hops, in frames: across a row, and down to the start of the next. */
const ACROSS = 8;
const DOWN = 9;
/** Row by row: the address, then the reason. */
const MAIL: Job[] = [];
const WHY: Job[] = [];
PEOPLE.slice(0, 3).forEach((p, i) => {
  MAIL.push(mailJob(i ? WHY[i - 1].leave + DOWN : BORN + 2, p.tries.length));
  WHY.push(whyJob(MAIL[i].leave + ACROSS));
});
/** The team arrives while the last row is being done. */
const TEAM = MAIL[2].start;
/** Run is pressed and becomes the clock; everyone leaves. */
const RUN = WHY[2].leave + 2;
const TO_PERCH = 14;
const NIGHT = RUN + 14;
const DAWN = NIGHT + 46;
const RING = DAWN + 12;
const INSERT = RING + 4;
const WAKE = RING + 2;
const NEXT_MAIL = mailJob(RING + 22, 1);
const NEXT_WHY = whyJob(NEXT_MAIL.leave + ACROSS);
/** The helper goes home and the blind comes down. */
const CLOSE = NEXT_WHY.leave + 2;
const HOME = CLOSE + 12;
const DURATION = CLOSE + 62;
/** The frame a reduced-motion visitor sees: two rows done, the helper
 *  holding up the third address, the team looking on. */
const STILL = MAIL[2].leave - 2;

/* ---- The helper's path ---- */

const POSE = {
  idle: 0,
  blink: 1,
  glance: 2,
  look: 3,
  look2: 4,
  mail: 5,
  sleep: 6,
} as const;
type Pose = keyof typeof POSE;
const BLOB = { w: 78, h: 87.75 };

/** Where it stands, and when it sets off for there (`hop` frames away). */
const STOPS = [
  { go: BORN, hop: 0, x: MAIL_X, y: feet(0) },
  ...[0, 1, 2].flatMap((i) => [
    ...(i ? [{ go: WHY[i - 1].leave, hop: DOWN, x: MAIL_X, y: feet(i) }] : []),
    { go: MAIL[i].leave, hop: ACROSS, x: WHY_X, y: feet(i) },
  ]),
  { go: RUN, hop: TO_PERCH, x: PERCH.x, y: PERCH.y },
  { go: NEXT_MAIL.start - 12, hop: 12, x: MAIL_X, y: feet(0) },
  { go: NEXT_MAIL.leave, hop: ACROSS, x: WHY_X, y: feet(0) },
  { go: CLOSE, hop: 12, x: SEAT_X + 4, y: BAR_Y + 10 },
];

function blobAt(frame: number) {
  let k = 0;
  for (let i = 0; i < STOPS.length; i++) if (frame >= STOPS[i].go) k = i;
  const to = STOPS[k];
  const from = STOPS[Math.max(0, k - 1)];
  const p = to.hop ? clamp01((frame - to.go) / to.hop) : 1;
  const far = Math.hypot(to.x - from.x, to.y - from.y);
  const lift = p < 1 ? (20 + far * 0.13) * 4 * p * (1 - p) : 0;
  const next = STOPS[k + 1];
  /* Squash and stretch: it crouches before a hop, stretches in the air and
     squashes when it lands, with a little wobble after. */
  const crouch = next ? clamp01((frame - (next.go - 3)) / 3) : 0;
  const since = frame - (to.go + to.hop);
  const settle =
    since >= 0 ? Math.exp(-since / 2.6) * Math.cos(since * 1.15) : 0;
  const air = p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0;
  const sy = 1 + 0.09 * air - 0.16 * settle - 0.1 * crouch;
  return {
    x: lerp(from.x, to.x, glide(p)),
    ground: lerp(from.y, to.y, p),
    lift,
    sy,
    sx: 1 / Math.sqrt(Math.max(0.5, sy)),
    flying: p < 1,
  };
}

function poseAt(frame: number, flying: boolean): Pose {
  // It lands with its eyes shut, then opens them.
  if (frame < BORN + 4) return "blink";
  if (flying) return "idle";
  for (const job of [...MAIL, NEXT_MAIL]) {
    if (frame < job.start || frame >= job.leave) continue;
    if (frame < job.start + 1) return "idle";
    if (frame < job.start + 7) return "glance";
    if (frame < job.done)
      return Math.floor((frame - job.start) / 6) % 2 ? "look2" : "look";
    return "mail";
  }
  for (const job of [...WHY, NEXT_WHY]) {
    if (frame < job.start + 1 || frame >= job.start + 11) continue;
    return Math.floor((frame - job.start) / 5) % 2 ? "look" : "look2";
  }
  const perched = RUN + TO_PERCH;
  if (frame >= perched + 12 && frame < WAKE) return "sleep";
  if (frame >= perched + 6 && frame < WAKE + 2) return "blink";
  return frame % 67 < 3 ? "blink" : "idle";
}

/* ---- The clock ---- */

function useFilmFrame(host: RefObject<HTMLDivElement | null>) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    // Read after mount: the server cannot know, and a first render that
    // disagreed with it would break hydration.
    const held = new URLSearchParams(window.location.search).get("film");
    if (held !== null) {
      setFrame((((Number(held) || 0) % DURATION) + DURATION) % DURATION);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFrame(STILL);
      return;
    }
    const el = host.current;
    if (!el) return;
    let raf = 0;
    let start = 0;
    let last = -1;
    let kept = 0;
    const tick = (now: number) => {
      if (!start) start = now - (kept / FPS) * 1000;
      // Whole frames only: the film is 30 a second, so most display frames
      // would re-render the scene for a difference nobody can see.
      const f = Math.floor(((now - start) / 1000) * FPS) % DURATION;
      if (f !== last) {
        last = f;
        kept = f;
        setFrame(f);
      }
      raf = requestAnimationFrame(tick);
    };
    // Only while on screen, and it picks up where it left off.
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      start = 0;
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [host]);
  return frame;
}

/** Keep --hero-scale equal to renderedWidth / 1200 (see .hero-scene-inner). */
function useSceneScale(host: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const apply = () =>
      el.style.setProperty("--hero-scale", String(el.clientWidth / 1200));
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [host]);
}

/** How wide each measured string is in the sheet's type. Read from hidden
 *  copies once the fonts are in, so a word can re-set from mono to exactly
 *  the width it will have. */
function useWidths(host: RefObject<HTMLDivElement | null>) {
  const [widths, setWidths] = useState<Record<string, number>>({});
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const read = () => {
      const out: Record<string, number> = {};
      el.querySelectorAll<HTMLElement>("[data-measure]").forEach((node) => {
        out[node.dataset.measure ?? ""] = node.offsetWidth;
      });
      setWidths(out);
    };
    read();
    document.fonts?.ready.then(read).catch(() => {});
  }, [host]);
  return widths;
}

/* ---- Colours ---- */

/** The terminal. */
const N = {
  ink: "#eceefa",
  soft: "#aab1cd",
  dim: "#737b9b",
  line: "rgba(255,255,255,0.1)",
  green: "#5fd6a0",
  orange: "#f2924f",
};
/** The sheet. */
const S = {
  ink: "#1c2333",
  muted: "#5b6478",
  line: "#e6e9f2",
  soft: "#eef1f7",
  head: "#f8f9fd",
};
/** The helper's lavender, which is also the cursor's. */
const LAVENDER = "#cbc5f7";

/* ---- Pieces ---- */

const abs = (style: CSSProperties): CSSProperties => ({
  position: "absolute",
  ...style,
});

/** A portrait: a square of the sheet of faces, or, in the terminal, the
 *  same face at 8, 16 or 32 pixels, the way a terminal shows a picture. */
function Face({
  index,
  x,
  y,
  size,
  radius,
  res = 0,
  ring,
}: {
  index: number;
  x: number;
  y: number;
  size: number;
  radius: number;
  res?: 0 | 8 | 16 | 32;
  ring?: number;
}) {
  return (
    <span
      style={abs({
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: radius,
        backgroundImage: `url(${MEDIA}/${res ? `faces-${res}.png` : "faces.webp"})`,
        backgroundSize: `${(res ? 3 : 8) * size}px ${size}px`,
        backgroundPosition: `${-index * size}px 0`,
        imageRendering: res ? "pixelated" : undefined,
        boxShadow: ring
          ? `0 0 0 2px rgba(255,255,255,${ring}), 0 3px 10px rgba(20,26,90,${0.2 * ring})`
          : undefined,
      })}
    />
  );
}

/** The coding agent's mark: a pixel crab, as on the hero's knife. */
const CRAB = [
  "1.1.....1.1",
  "111.....111",
  ".1.......1.",
  ".111111111.",
  "..1211121..",
  "..1111111..",
  ".1.1...1.1.",
  "1..1...1..1",
];
function Crab({ x, y, unit }: { x: number; y: number; unit: number }) {
  return (
    <svg
      width={11 * unit}
      height={8 * unit}
      viewBox="0 0 11 8"
      shapeRendering="crispEdges"
      style={abs({ left: x, top: y })}
    >
      {CRAB.flatMap((row, r) =>
        [...row].map((cell, col) =>
          cell === "." ? null : (
            <rect
              key={`${r}-${col}`}
              x={col}
              y={r}
              width="1"
              height="1"
              fill={cell === "2" ? "#3a1a0a" : N.orange}
            />
          ),
        ),
      )}
    </svg>
  );
}

/** A provider, as a plastic tile. It drops into the cell; a miss goes grey
 *  and tips off, a hit stays as the mark in front of what it found. */
function Tile({
  frame,
  at,
  colour,
  hit,
  x,
  y,
}: {
  frame: number;
  at: number;
  colour: Colour;
  hit: boolean;
  x: number;
  y: number;
}) {
  const t = frame - at;
  if (t < 0) return null;
  const fall = 1 - bounceOut(clamp01(t / 6));
  const grey = hit ? 0 : clamp01((t - 5) / 3);
  const off = hit ? 0 : clamp01((t - 8) / 7);
  if (off >= 1) return null;
  const pop = hit ? Math.max(0, 1 - Math.abs(t - 6.5) / 2.5) : 0;
  const glow = hit ? clamp01((t - 5) / 10) : 0;
  const [light, body, edge] = colours[colour];
  const skin = (a: string, b: string, c: string): CSSProperties => ({
    position: "absolute",
    inset: 0,
    borderRadius: 7,
    background: `linear-gradient(180deg, ${a} 0%, ${b} 70%)`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -2px 0 ${c}, 0 1px 2px rgba(20,26,90,0.22)`,
  });
  return (
    <span
      style={abs({
        left: x + off * off * 30,
        top: y - 11 - fall * 34 + off * off * 50,
        width: 22,
        height: 22,
        opacity: clamp01(t / 2) * (1 - off),
        transform: `rotate(${off * 80}deg) scale(${1 + pop * 0.22})`,
      })}
    >
      {glow > 0 && glow < 1 && (
        <span
          style={abs({
            inset: -2,
            borderRadius: 9,
            border: `2px solid ${body}`,
            opacity: 0.55 * (1 - glow),
            transform: `scale(${1 + glow * 0.9})`,
          })}
        />
      )}
      <span style={skin(light, body, edge)} />
      <span
        style={{ ...skin("#eef0f6", "#d3d8e4", "#bcc2d2"), opacity: grey }}
      />
    </span>
  );
}

/** A word that re-sets from the terminal's mono into the sheet's type. The
 *  two settings share one box that goes from the mono word's size to the
 *  new one's, and one dissolves into the other inside it. */
function Reset({
  text,
  t,
  from,
  to,
  width,
  ink,
  weight,
}: {
  text: string;
  t: number;
  from: { x: number; y: number; size: number };
  to: { x: number; y: number; size: number };
  /** The word's width in the sheet's type, once measured. */
  width?: number;
  ink: string;
  weight: number;
}) {
  const line: CSSProperties = {
    lineHeight: "24px",
    whiteSpace: "pre",
    color: ink,
    transformOrigin: "0 50%",
  };
  const mono = text.length * from.size * 0.6;
  const set = width || text.length * to.size * 0.52;
  const w = lerp(mono, set, t);
  /* One goes out before the other comes in, so two settings of a word are
     never read on top of each other. */
  const out = clamp01((t - 0.24) / 0.2);
  const cross = clamp01((t - 0.42) / 0.2);
  /* Up or down first, along second: the name and the line under it part
     before either moves sideways, so they never cross. */
  const rise = ease(clamp01(t / 0.45));
  const along = inOut(clamp01((t - 0.2) / 0.8));
  const at = {
    left: lerp(from.x, to.x, along),
    top: lerp(from.y, to.y, rise) - 12,
  };
  return (
    <>
      {t < 1 && (
        <span
          style={abs({
            ...line,
            ...at,
            fontFamily: MONO,
            fontSize: from.size,
            opacity: 1 - out,
            transform: `scale(${w / mono}, ${lerp(1, to.size / from.size, t)})`,
          })}
        >
          {text}
        </span>
      )}
      {t > 0 && (
        <span
          style={abs({
            ...line,
            ...at,
            fontSize: to.size,
            fontWeight: weight,
            opacity: cross,
            transform: `scale(${w / set}, ${lerp(from.size / to.size, 1, t)})`,
          })}
        >
          {text}
        </span>
      )}
    </>
  );
}

/** A hidden copy of a string in the sheet's type, for useWidths. */
function Measure({
  id,
  text,
  size,
  weight,
}: {
  id: string;
  text: string;
  size: number;
  weight: number;
}) {
  return (
    <span
      data-measure={id}
      style={abs({
        left: 0,
        top: 0,
        visibility: "hidden",
        whiteSpace: "pre",
        fontSize: size,
        fontWeight: weight,
      })}
    >
      {text}
    </span>
  );
}

/* ---- The film ---- */

export function HeroMorphV1() {
  const host = useRef<HTMLDivElement>(null);
  const frame = useFilmFrame(host);
  useSceneScale(host);
  const widths = useWidths(host);

  /* Where the film is: frames into the morph, and frames into the close. */
  const mf = Math.max(0, frame - M);
  const c = frame - CLOSE;
  const closing = c > 0;
  const back = closing ? spring(c, 32, 20, 0.15) : 0;

  /* The window. Its lines lead and it follows: wider first, then deeper. */
  const wide = closing ? 1 - back : spring(mf, 2, 20, 0.2);
  const tall = closing ? 1 - back : spring(mf, 6, 22, 0.12);
  const win = {
    x: lerp(A.x, B.x, wide),
    y: lerp(A.y, B.y, tall),
    w: lerp(A.w, B.w, wide),
    h: lerp(A.h, B.h, tall),
  };
  const radius = lerp(14, 18, wide);
  /* The blind: the dark rolls up into the bar, and the sheet is under it. */
  const blind = closing
    ? 1 - inOut(clamp01((c - 14) / 18))
    : inOut(clamp01((mf - 18) / 24));
  const edge = lerp(win.y + win.h, win.y + BAR, blind);
  /* The prompt's move from the terminal's first lines into the bar. */
  const pm = closing ? 1 - back : spring(mf, 0, 22, 0.1);
  /* The terminal's own furniture: title strip, tool lines, input boxes. */
  const chrome = closing ? prog(c, 44, 12) : 1 - prog(mf, 0, 8);
  const inTerminal = frame < M + 10 && !closing;

  /* The rows growing out of the lines: the lowest first, so each makes
     room for the one above it, and the blind meets them in that order. */
  const spread = (i: number) => spring(mf, 6 + 3 * (2 - i), 18, 0.3);
  const reset = (i: number) => inOut(clamp01((mf - 8 - 3 * (2 - i)) / 14));
  const sharpen = (i: number) => clamp01((mf - 14 - 3 * (2 - i)) / 22);
  /* The schedule's row pushing the others down. */
  const ins = spring(frame, INSERT, 16, 0.2);

  /* The two rules of the printed list. They shoot sideways past the window
     before it widens; they end as the head's rule and the third row's. */
  const shoot = ease(clamp01(mf / 8));
  const rule = {
    left: lerp(A.x + TERM.pad, B.x, shoot),
    right: lerp(A.x + A.w - TERM.pad, B.x + B.w, shoot),
    y: [
      lerp(A.y + TERM.rule1, ROWS, spread(0)),
      lerp(A.y + TERM.rule2, ROWS + 3 * ROW, spread(2)),
    ],
  };

  /* ---- Typing ---- */
  const typed = KEYS.map((at) => at.filter((k) => k <= frame).length);
  const boxTall = closing ? 0 : spring(frame, KEYS[1][0] - 1, 9, 0.2);
  /* The second line goes along before it goes up, so it never crosses
     the first on its way to follow it. */
  const along = closing ? 1 - back : spring(mf, 0, 15, 0.1);
  const up = closing ? 1 - back : spring(mf, 7, 16, 0.1);
  const promptAt = (idx: number) => ({
    x: lerp(
      A.x + TERM.text,
      BAR_X + (idx ? (ASK[0].length + 1) * BAR_CW : 0),
      idx ? along : pm,
    ),
    y: lerp(
      win.y + TERM.ask + TERM.lead * idx,
      win.y + BAR / 2,
      idx ? up : pm,
    ),
    size: lerp(16, 14.5, pm),
  });
  const promptInk = closing ? 1 - prog(c, 20, 10) : 1;

  /* ---- A person, on either side of the blind ---- */
  const person = (
    p: Person,
    side: "dark" | "light",
    yc: number,
    /** Row index for the three that morph; undefined for the others. */
    i?: number,
    opacity = 1,
  ) => {
    const grow = i === undefined ? 1 : spread(i);
    const re = i === undefined ? 1 : reset(i);
    const sharp = i === undefined ? 1 : sharpen(i);
    const size = lerp(26, 56, grow);
    const dark = side === "dark";
    const titleW =
      i === undefined ? 0 : widths[`t${i}`] || p.title.length * 7.4;
    const sepW = widths.sep || 13;
    return (
      <div key={`${side}-${p.name}`} style={abs({ left: 0, top: 0, opacity })}>
        <Face
          index={p.face}
          x={lerp(A.x + TERM.pad, FACE_X, grow)}
          y={yc - size / 2}
          size={size}
          radius={lerp(5, 28, grow)}
          res={sharp < 0.2 ? 8 : sharp < 0.45 ? 16 : sharp < 0.7 ? 32 : 0}
          ring={dark ? 0 : grow}
        />
        {i === undefined ? (
          <>
            <span
              style={abs({
                left: TEXT_X,
                top: yc - 23,
                lineHeight: "24px",
                fontSize: 20,
                fontWeight: 600,
                color: S.ink,
                whiteSpace: "pre",
              })}
            >
              {p.name}
            </span>
            <span
              style={abs({
                left: TEXT_X,
                top: yc + 1,
                lineHeight: "24px",
                fontSize: 14.5,
                color: S.muted,
                whiteSpace: "pre",
              })}
            >
              {p.title} · {p.company}
            </span>
          </>
        ) : (
          <>
            <Reset
              text={p.name}
              t={re}
              from={{ x: A.x + TERM.name, y: yc, size: 16 }}
              to={{ x: TEXT_X, y: yc - 11, size: 20 }}
              width={widths[`n${i}`]}
              ink={dark ? N.ink : S.ink}
              weight={600}
            />
            <Reset
              text={p.title}
              t={re}
              from={{ x: A.x + TERM.title, y: yc, size: 16 }}
              to={{ x: TEXT_X, y: yc + 13, size: 14.5 }}
              width={widths[`t${i}`]}
              ink={dark ? N.soft : S.muted}
              weight={400}
            />
            <span
              style={abs({
                left: TEXT_X + titleW,
                top: yc + 1,
                lineHeight: "24px",
                fontSize: 14.5,
                whiteSpace: "pre",
                color: dark ? N.soft : S.muted,
                opacity: clamp01((re - 0.7) / 0.3),
              })}
            >
              {" · "}
            </span>
            <Reset
              text={p.company}
              t={re}
              from={{ x: A.x + TERM.company, y: yc, size: 16 }}
              to={{ x: TEXT_X + titleW + sepW, y: yc + 13, size: 14.5 }}
              width={widths[`c${i}`]}
              ink={dark ? N.soft : S.muted}
              weight={400}
            />
          </>
        )}
      </div>
    );
  };

  /* ---- A row's two jobs ---- */
  const waiting = (x: number, yc: number, on: number, width = 118) => (
    <span
      style={abs({
        left: x,
        top: yc - 5,
        width,
        height: 10,
        borderRadius: 5,
        background: S.soft,
        opacity: on,
      })}
    />
  );
  const jobs = (p: Person, key: string, yc: number, mail?: Job, why?: Job) => {
    const mx = WALL[0] + 24;
    const wx = WALL[1] + 24;
    const flash = mail ? clamp01(1 - (frame - mail.done) / 18) : 0;
    return (
      <div key={key} style={abs({ left: 0, top: 0 })}>
        {/* Work email: a soft green as it lands, the tries, the address. */}
        {mail && frame >= mail.done && flash > 0 && (
          <span
            style={abs({
              left: WALL[0] + 1,
              top: yc - ROW / 2 + 1,
              width: WALL[1] - WALL[0] - 1,
              height: ROW - 1,
              background: `rgba(95,214,160,${0.2 * flash})`,
            })}
          />
        )}
        {waiting(
          WALL[0] + 24,
          yc,
          mail ? 1 - prog(frame, mail.start - 2, 4) : 1,
        )}
        {mail &&
          p.tries.map((colour, k) => (
            <Tile
              key={k}
              frame={frame}
              at={mail.start + 8 + 9 * k}
              colour={colour}
              hit={k === p.tries.length - 1}
              x={mx}
              y={yc}
            />
          ))}
        {mail && frame >= mail.done && (
          <span
            style={abs({
              left: mx + 32,
              top: yc - 12,
              lineHeight: "24px",
              fontSize: 17,
              color: S.ink,
              whiteSpace: "nowrap",
            })}
          >
            {p.email.slice(0, Math.floor((frame - mail.done) * 2.4))}
          </span>
        )}
        {/* Why now: what has just happened there, as tags. */}
        {waiting(
          WALL[1] + 24,
          yc,
          why ? 1 - prog(frame, why.start - 2, 4) : 1,
          96,
        )}
        {why && (
          <span style={abs({ left: wx, top: yc - 15, display: "flex", gap: 8 })}>
            {p.tags.map(([name, colour], j) => {
              const at = why.start + 8 + 3 * j;
              return (
                <span
                  key={name}
                  style={{
                    ...tag(colour),
                    height: 30,
                    padding: "0 11px",
                    borderRadius: 8,
                    fontSize: 13.5,
                    fontWeight: 600,
                    lineHeight: "28px",
                    whiteSpace: "nowrap",
                    opacity: clamp01((frame - at) / 2),
                    transform: `scale(${0.5 + 0.5 * spring(frame, at, 10, 0.45)})`,
                  }}
                >
                  {name}
                </span>
              );
            })}
          </span>
        )}
      </div>
    );
  };

  /* ---- The helper ---- */
  const blob = blobAt(frame);
  const pose = poseAt(frame, blob.flying);
  const birth = spring(frame, BORN - 1, 12, 0.45);
  const home = clamp01((frame - HOME) / 3);
  /* Little jumps in place: an address found, a ring that wakes it. */
  const found = [...MAIL, NEXT_MAIL].find(
    (j) => frame >= j.done && frame < j.done + 8,
  );
  const jump =
    (found ? 7 * Math.sin((Math.PI * (frame - found.done)) / 8) : 0) +
    (frame >= WAKE && frame < WAKE + 8
      ? 16 * Math.sin((Math.PI * (frame - WAKE)) / 8)
      : 0);
  const breath = pose === "sleep" ? 0.025 * Math.sin(frame / 6) : 0;
  const blobOn = clamp01((frame - (BORN - 2)) / 2) * (1 - home);
  const blobSx = blob.sx * lerp(1.35, 1, birth) * lerp(1, 0.4, home) - breath;
  const blobSy = blob.sy * lerp(0.4, 1, birth) * lerp(1, 0.5, home) + breath;

  /* ---- The cursor ---- */
  const cursor = (() => {
    const blinkOn = Math.floor(frame / 9) % 2 === 0;
    const block = { rot: 0, round: 1.5, on: 1 };
    if (frame >= TIP && frame < HOME) {
      if (frame >= BORN) return null;
      // It tips off the end of the prompt and drops into the first cell,
      // rounding off and filling out on the way: half block, half helper.
      const q = clamp01((frame - TIP) / 14);
      const squash = clamp01((frame - TIP - 14) / 3);
      const w = lerp(BAR_CW, 30, q * q);
      const h = lerp(18, 28, q * q);
      return {
        x: lerp(SEAT_X, MAIL_X - 15, glide(q)),
        y:
          lerp(BAR_Y, feet(0) - 14, q * q) -
          44 * Math.sin(Math.PI * q) * (1 - q),
        w: w * (1 + 0.9 * squash),
        h: h * (1 - 0.55 * squash),
        rot: -360 * glide(q),
        round: lerp(1.5, 12, q),
        on: 1,
      };
    }
    if (frame >= HOME) {
      // Back from being the helper: it sits at the prompt, then rides the
      // window back to the terminal's first line.
      const grow = clamp01((frame - HOME) / 3);
      return {
        ...block,
        x: lerp(SEAT_X, A.x + TERM.text, back),
        y: lerp(BAR_Y, A.y + TERM.ask, back),
        w: lerp(BAR_CW * 3, lerp(BAR_CW, CW, back), grow),
        h: lerp(8, lerp(18, 20, back), grow),
        round: lerp(8, 1.5, grow),
      };
    }
    if (frame >= M) {
      // It rides the prompt up into the bar.
      return {
        ...block,
        x: lerp(A.x + TERM.text, SEAT_X, pm),
        y:
          lerp(A.y + TERM.box + 19, BAR_Y, pm) -
          22 * Math.sin(Math.PI * clamp01(pm)),
        w: lerp(CW, BAR_CW, pm),
        h: lerp(20, 18, pm),
        on: mf < 26 || blinkOn ? 1 : 0,
      };
    }
    if (frame >= ENTER)
      return {
        ...block,
        x: A.x + TERM.text,
        y: A.y + TERM.box + 19,
        w: CW,
        h: 20,
        on: blinkOn ? 1 : 0,
      };
    const line = typed[1] > 0 ? 1 : 0;
    const moving = frame >= 12 && frame < ENTER - 4;
    return {
      ...block,
      x: A.x + TERM.text + typed[line] * CW,
      y: A.y + TERM.ask + TERM.lead * line,
      w: CW,
      h: 20,
      on: moving || blinkOn ? 1 : 0,
    };
  })();

  /* ---- The team, and the one who presses Run ---- */
  const teamOn = (k: number) =>
    spring(frame, TEAM + k * 4, 10, 0.4) * (1 - prog(frame, RUN + 1 + k, 5));
  const pointer = (() => {
    const a = spring(frame, RUN - 26, 18, 0.12);
    const d = prog(frame, RUN + 4, 16);
    const press = frame >= RUN - 1 && frame < RUN + 2;
    return {
      x: lerp(lerp(1250, RUN_X + 8, a), 1260, d),
      y: lerp(lerp(330, BAR_Y + 6, a), 20, d),
      on: prog(frame, RUN - 26, 6) * (1 - prog(frame, RUN + 10, 8)),
      press,
    };
  })();

  /* ---- Run, which becomes the alarm clock ---- */
  const runOn = closing ? 0 : prog(mf, 46, 10);
  const toClock = clamp01((frame - RUN - 2) / 8);
  const clockIn = spring(frame, RUN + 9, 11, 0.5);
  const clockOn = frame >= RUN + 9 ? 1 - (closing ? prog(c, 0, 8) : 0) : 0;
  /* Night: five in the afternoon to nine in the morning, hands running. */
  const night = prog(frame, NIGHT, 18) * (1 - prog(frame, DAWN, 16));
  const hours = inOut(clamp01((frame - NIGHT - 2) / (DAWN + 10 - NIGHT - 2)));
  const ringing =
    frame >= RING && frame < RING + 18 ? 1 - (frame - RING) / 22 : 0;
  const shake = ringing ? ((frame - RING) % 4 < 2 ? 1 : -1) * 8 * ringing : 0;

  const tool = (
    y: number,
    from: number,
    until: number,
    label: string,
    busy: string,
    result: ReactNode,
  ) => {
    if (frame < from) return null;
    const done = frame >= until;
    return (
      <div
        style={abs({
          left: A.x + TERM.pad,
          top: y - 12,
          width: A.w - TERM.pad * 2,
          display: "flex",
          alignItems: "center",
          gap: 11,
          lineHeight: "24px",
          whiteSpace: "nowrap",
          opacity: prog(frame, from, 4) * chrome,
        })}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: done ? N.green : N.orange,
            opacity: done || Math.floor(frame / 5) % 2 ? 1 : 0.35,
          }}
        />
        <span>
          <span style={{ fontWeight: 600 }}>pipe0</span>
          <span style={{ color: N.soft }}> – {label}</span>
          <span style={{ color: N.dim }}> (MCP)</span>
        </span>
        <span style={{ marginLeft: "auto", color: done ? N.green : N.dim }}>
          {done ? result : busy}
        </span>
      </div>
    );
  };

  const promptLine = (idx: number) => {
    const at = promptAt(idx);
    return (
      <span
        key={idx}
        style={abs({
          left: at.x,
          top: at.y - 12,
          lineHeight: "24px",
          fontSize: at.size,
          color: frame < ENTER ? N.ink : "#d5d9ee",
          whiteSpace: "pre",
          opacity: promptInk,
        })}
      >
        {ASK[idx].slice(0, typed[idx])}
      </span>
    );
  };

  return (
    <div
      ref={host}
      className="hero-scene mx-auto w-full min-w-0 max-w-[1200px]"
      role="img"
      aria-label="A list an agent prints in a terminal becomes a sheet. The terminal's cursor turns into a small helper that finds each person's work email, cell by cell; a teammate adds a column and schedules the sheet; overnight a new row arrives and the helper fills it in alone."
    >
      <div className="hero-scene-inner" aria-hidden>
        {/* Hidden copies, to measure where the sheet's type puts each letter. */}
        {PEOPLE.slice(0, 3).map((p, i) => (
          <span key={p.name}>
            <Measure id={`n${i}`} text={p.name} size={20} weight={600} />
            <Measure id={`t${i}`} text={p.title} size={14.5} weight={400} />
            <Measure id={`c${i}`} text={p.company} size={14.5} weight={400} />
          </span>
        ))}
        <Measure id="sep" text=" · " size={14.5} weight={400} />

        {/* Night, over the whole band, behind everything. */}
        <div
          style={abs({
            left: -900,
            top: -400,
            width: 3000,
            height: 1500,
            opacity: night,
            background:
              "linear-gradient(180deg, #0a0d2a 0%, #10143c 38%, #1c2460 62%, #2c3684 100%)",
          })}
        >
          {[
            [1040, 470, 2.4],
            [1270, 505, 1.8],
            [1480, 452, 2],
            [1650, 520, 1.6],
            [1830, 468, 2.2],
            [1960, 512, 1.6],
            [1160, 540, 1.4],
          ].map(([x, y, r]) => (
            <span
              key={x}
              style={abs({
                left: x,
                top: y,
                width: r * 2,
                height: r * 2,
                borderRadius: "50%",
                background: "#fff",
                opacity: 0.75,
              })}
            />
          ))}
        </div>

        {/* The printed list's rules, where they run past the window. */}
        {mf > 0 &&
          mf < 34 &&
          !closing &&
          rule.y.map((y, k) => (
            <span
              key={k}
              style={abs({
                left: rule.left,
                top: y,
                width: rule.right - rule.left,
                height: 1,
                background: "rgba(255,255,255,0.6)",
                opacity: 1 - prog(mf, 20, 12),
              })}
            />
          ))}

        {/* The window's shadow and edge. */}
        <div
          style={abs({
            left: win.x,
            top: win.y,
            width: win.w,
            height: win.h,
            borderRadius: radius,
            boxShadow:
              "0 0 0 1px rgba(20,26,90,0.1), 0 36px 80px rgba(18,24,74,0.34), 0 6px 18px rgba(18,24,74,0.14)",
          })}
        />

        {/* The window: one box, dark above the blind's edge and a sheet
            below it. Both halves are drawn in the same coordinates. */}
        <div
          style={abs({
            left: 0,
            top: 0,
            width: 1200,
            height: DEPTH,
            clipPath: `inset(${win.y}px ${1200 - win.x - win.w}px ${DEPTH - win.y - win.h}px ${win.x}px round ${radius}px)`,
          })}
        >
          {/* ---- The sheet ---- */}
          <div
            style={abs({
              inset: 0,
              clipPath: `inset(${edge}px 0 0 0)`,
              background: "#fff",
              color: S.ink,
            })}
          >
            {/* Rows first, so the head covers a row sliding in under it. */}
            {PEOPLE.map((p, i) => {
              const yc =
                i < 3
                  ? lerp(LINE_Y(i), slotY(i + ins), spread(i))
                  : slotY(i + ins);
              return (
                <div key={p.name}>
                  {person(p, "light", yc, i < 3 ? i : undefined)}
                  {jobs(p, `jobs-${p.name}`, yc, MAIL[i], WHY[i])}
                </div>
              );
            })}
            {frame >= INSERT && (
              <div>
                {person(NEXT, "light", slotY(ins - 1))}
                {jobs(NEXT, "jobs-next", slotY(ins - 1), NEXT_MAIL, NEXT_WHY)}
              </div>
            )}
            {/* Row lines. The third is the printed list's lower rule. */}
            {[1, 2, 4, 5].map((k) => (
              <span
                key={k}
                style={abs({
                  left: B.x,
                  top: ROWS + ROW * k,
                  width: B.w,
                  height: 1,
                  background: S.line,
                })}
              />
            ))}
            <span
              style={abs({
                left: rule.left,
                top: rule.y[1],
                width: rule.right - rule.left,
                height: 1,
                background: S.line,
              })}
            />
            {/* The head: three columns, the third empty until someone adds
                it. */}
            <div
              style={abs({
                left: B.x,
                top: TOP,
                width: B.w,
                height: HEAD,
                background: S.head,
              })}
            />
            <span
              style={abs({
                left: rule.left,
                top: rule.y[0],
                width: rule.right - rule.left,
                height: 1,
                background: S.line,
              })}
            />
            {WALL.map((x) => (
              <span
                key={x}
                style={abs({
                  left: x,
                  top: TOP,
                  width: 1,
                  height: DEPTH,
                  background: S.soft,
                })}
              />
            ))}
            {/* How many rows: the agent's 25, and one more each run. */}
            <span
              style={abs({
                right: 1200 - B.x - B.w + 24,
                top: TOP,
                height: HEAD,
                display: "flex",
                alignItems: "center",
                fontSize: 13.5,
                fontWeight: 500,
                fontVariantNumeric: "tabular-nums",
                color: frame >= INSERT + 6 && frame < INSERT + 30 ? "#3b49e0" : S.muted,
                whiteSpace: "nowrap",
              })}
            >
              {frame >= INSERT + 6 ? 26 : 25} rows
            </span>
            {[
              { x: B.x + 24, icon: <User size={15} />, label: "Person" },
              { x: WALL[0] + 24, icon: <Mail size={15} />, label: "Work email" },
              { x: WALL[1] + 24, icon: <Sparkles size={15} />, label: "Why now" },
            ].map((head) => (
              <span
                key={head.label}
                style={abs({
                  left: head.x,
                  top: TOP,
                  height: HEAD,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: S.muted,
                  whiteSpace: "nowrap",
                })}
              >
                {head.icon}
                {head.label}
              </span>
            ))}
          </div>

          {/* ---- The dark: the whole terminal, then the sheet's bar ---- */}
          <div
            style={abs({
              inset: 0,
              clipPath: `inset(0 0 ${DEPTH - edge}px 0)`,
              color: N.ink,
              fontFamily: MONO,
              fontSize: 16,
            })}
          >
            <div
              style={abs({
                left: win.x,
                top: win.y,
                width: win.w,
                height: win.h,
                borderRadius: `${radius}px ${radius}px 0 0`,
                background:
                  "radial-gradient(130% 120% at 18% 0%, #1c2148 0%, #11142e 46%, #0c0e22 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 0 1px rgba(255,255,255,0.06)",
              })}
            />
            {/* Title strip. */}
            <div
              style={abs({
                left: win.x,
                top: win.y,
                width: win.w,
                height: TERM.strip,
                opacity: chrome,
              })}
            >
              {["#ff5f57", "#febc2e", "#28c840"].map((light, k) => (
                <span
                  key={light}
                  style={abs({
                    left: 17 + k * 19,
                    top: 12.5,
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    background: light,
                  })}
                />
              ))}
              <span
                style={abs({
                  left: win.w / 2 - 34,
                  top: 6,
                  lineHeight: "24px",
                  fontSize: 13,
                  color: N.soft,
                  whiteSpace: "nowrap",
                })}
              >
                claude — ~/gtm
              </span>
              <span
                style={abs({
                  right: 17,
                  top: 6,
                  lineHeight: "24px",
                  fontSize: 13,
                  color: N.dim,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  whiteSpace: "nowrap",
                })}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: N.green,
                  }}
                />
                pipe0 MCP
              </span>
              <span
                style={abs({
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 1,
                  background: N.line,
                })}
              />
            </div>
            <Crab
              x={lerp(win.x + win.w / 2 - 60, win.x + 20, pm)}
              y={lerp(win.y + 11.5, win.y + BAR / 2 - 6.5, pm)}
              unit={lerp(1.6, 1.7, pm)}
            />

            {/* The prompt: typed into a box, kept as the bar's line. */}
            <div
              style={abs({
                left: A.x + TERM.pad,
                top: A.y + 50,
                width: A.w - TERM.pad * 2,
                height: lerp(40, 66, boxTall),
                borderRadius: 9,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.03)",
                opacity: closing ? chrome : 1 - prog(frame, ENTER, 5),
              })}
            />
            <span
              style={abs({
                left: lerp(A.x + TERM.mark, B.x + 44, pm),
                top: promptAt(0).y - 12,
                lineHeight: "24px",
                fontSize: promptAt(0).size,
                color: LAVENDER,
              })}
            >
              &gt;
            </span>
            {promptInk > 0 && [0, 1].map(promptLine)}

            {/* What the agent does with it. */}
            {inTerminal && (
              <>
                {frame >= ENTER + 1 && frame < TOOL1 && (
                  <div
                    style={abs({
                      left: A.x + TERM.pad,
                      top: A.y + TERM.tool1 - 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      lineHeight: "24px",
                      color: N.orange,
                    })}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="-7 -7 14 14"
                      style={{ transform: `rotate(${frame * 14}deg)` }}
                    >
                      {[0, 60, 120].map((deg) => (
                        <line
                          key={deg}
                          x1="-6"
                          y1="0"
                          x2="6"
                          y2="0"
                          stroke={N.orange}
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          transform={`rotate(${deg})`}
                        />
                      ))}
                    </svg>
                    Thinking…
                  </div>
                )}
                {tool(
                  A.y + TERM.tool1,
                  TOOL1,
                  FOUND,
                  "search people",
                  "searching…",
                  "25 found",
                )}
                {tool(
                  A.y + TERM.tool2,
                  TOOL2,
                  MADE,
                  "create sheet",
                  "creating…",
                  <span
                    style={{
                      color: LAVENDER,
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                    }}
                  >
                    Growth leaders ↗
                  </span>,
                )}
                {/* The next prompt, waiting. */}
                <div
                  style={abs({
                    left: A.x + TERM.pad,
                    top: A.y + TERM.box,
                    width: A.w - TERM.pad * 2,
                    height: 38,
                    borderRadius: 9,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.03)",
                    opacity: prog(frame, ENTER, 5) * chrome,
                  })}
                >
                  <span
                    style={abs({
                      left: 15,
                      top: 6,
                      lineHeight: "24px",
                      color: LAVENDER,
                    })}
                  >
                    &gt;
                  </span>
                  <span
                    style={abs({
                      right: 15,
                      top: 6,
                      lineHeight: "24px",
                      fontSize: 13,
                      color: N.dim,
                    })}
                  >
                    {frame < MADE ? "esc to interrupt" : "? for shortcuts"}
                  </span>
                </div>
              </>
            )}

            {/* The printed list: two rules and three people. */}
            {frame < M + 64 && !closing && (
              <>
                {rule.y.map((y, k) => (
                  <span
                    key={k}
                    style={abs({
                      left: rule.left,
                      top: y,
                      width:
                        (rule.right - rule.left) *
                        prog(frame, k ? LINE[2] + 4 : FOUND, 6),
                      height: 1,
                      background: "rgba(255,255,255,0.2)",
                    })}
                  />
                ))}
                {PEOPLE.slice(0, 3).map((p, i) =>
                  frame < LINE[i]
                    ? null
                    : person(
                        p,
                        "dark",
                        lerp(LINE_Y(i), slotY(i), spread(i)),
                        i,
                        prog(frame, LINE[i], 4),
                      ),
                )}
              </>
            )}

            {/* The bar's right end: the team, and Run. */}
            {TEAM_FACES.map((face, k) => {
              const on = teamOn(k);
              return on <= 0.01 ? null : (
                <span
                  key={face}
                  style={abs({
                    left: RUN_X - 124 + k * 21,
                    top: BAR_Y - 14,
                    width: 28,
                    height: 28,
                    transform: `scale(${on})`,
                  })}
                >
                  <Face index={face} x={0} y={0} size={28} radius={14} />
                  <span
                    style={abs({
                      left: -2,
                      top: -2,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: "2px solid #14173a",
                    })}
                  />
                </span>
              );
            })}
            {runOn > 0 && frame < RUN + 2 && (
              <span
                style={abs({
                  left: RUN_X - 38,
                  top: BAR_Y - 15,
                  width: 76,
                  height: 30,
                  borderRadius: 15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  fontFamily: "var(--font-schibsted), sans-serif",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#fff",
                  background: "linear-gradient(180deg, #6f7af0 0%, #3b49e0 62%)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.16), 0 1px 2px rgba(0,0,0,0.3)",
                  opacity: runOn,
                  transform:
                    pointer.press && frame >= RUN - 1 ? "scale(0.93)" : undefined,
                })}
              >
                <Play size={11} fill="#fff" /> Run
              </span>
            )}
          </div>

          {/* The blind's roll: a line of light along the edge while it
              moves. */}
          <span
            style={abs({
              left: win.x,
              top: edge - 3,
              width: win.w,
              height: 4,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(203,197,247,0.9) 60%, rgba(255,255,255,0.6) 100%)",
              opacity: blind > 0.02 && blind < 0.98 ? 1 : 0,
            })}
          />
          {/* Night on the sheet: a little of the sky's blue. */}
          <span
            style={abs({
              left: win.x,
              top: edge,
              width: win.w,
              height: DEPTH,
              background: "#141a5c",
              opacity: 0.1 * night,
            })}
          />
        </div>

        {/* ---- On top of the window ---- */}

        {/* Run on its way to being the clock, then the clock, standing on
            the sheet's top edge. */}
        {frame >= RUN + 2 && frame < RUN + 13 && (
          <span
            style={abs({
              left: RUN_X - lerp(38, 28, toClock),
              top: lerp(BAR_Y - 15, B.y - 54, toClock),
              width: lerp(76, 56, toClock),
              height: lerp(30, 56, toClock),
              borderRadius: 28,
              background: `linear-gradient(180deg, ${toClock > 0.5 ? "#ffe38f" : "#6f7af0"} 0%, ${toClock > 0.5 ? "#f6bf38" : "#3b49e0"} 62%)`,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(20,26,90,0.25)",
              opacity: 1 - clamp01((frame - RUN - 10) / 3),
            })}
          />
        )}
        {clockOn > 0 && (
          <div
            style={abs({
              left: RUN_X - 37,
              top: B.y - 76,
              width: 74,
              height: 84,
              transformOrigin: "50% 92%",
              transform: `rotate(${shake}deg) scale(${(0.6 + 0.4 * clockIn) * clockOn})`,
            })}
          >
            <span
              style={abs({
                left: 9,
                top: 22,
                width: 56,
                height: 56,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 40% 30%, #ffffff 0%, #f1f3fb 100%)",
              })}
            />
            <span
              style={abs({
                inset: 0,
                backgroundImage: `url(${MEDIA}/clock.webp)`,
                backgroundSize: "100% 100%",
              })}
            />
            {[
              { deg: 150 + 480 * hours, w: 3.6, len: 13 },
              { deg: 1080 * hours, w: 2.6, len: 19 },
            ].map((hand) => (
              <span
                key={hand.len}
                style={abs({
                  left: 37 - hand.w / 2,
                  top: 50 - hand.len,
                  width: hand.w,
                  height: hand.len,
                  borderRadius: hand.w,
                  background: "#2a35b0",
                  transformOrigin: "50% 100%",
                  transform: `rotate(${hand.deg}deg)`,
                })}
              />
            ))}
            <span
              style={abs({
                left: 34,
                top: 47,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#f0593f",
              })}
            />
            {ringing > 0 &&
              [-1, 1].map((side) => (
                <svg
                  key={side}
                  width="18"
                  height="26"
                  viewBox="0 0 18 26"
                  style={abs({
                    left: side < 0 ? -20 : 76,
                    top: -4,
                    opacity: ringing,
                    transform: `scaleX(${side})`,
                  })}
                >
                  <path
                    d="M4 3q8 4 10 10M2 12q5 2 7 7"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              ))}
          </div>
        )}

        {/* The helper, and the shadow it throws on whatever it is over. */}
        <div
          style={abs({
            left: blob.x - 30,
            top: blob.ground - 5,
            width: 60,
            height: 11,
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(32,38,120,0.3), rgba(32,38,120,0))",
            opacity: blobOn * clamp01(1 - blob.lift / 70),
            transform: `scale(${1 - blob.lift / 160})`,
          })}
        />
        <div
          style={abs({
            left: blob.x - BLOB.w / 2,
            top: blob.ground - blob.lift - jump - BLOB.h + 3,
            width: BLOB.w,
            height: BLOB.h,
            backgroundImage: `url(${MEDIA}/blob.webp)`,
            backgroundSize: `${BLOB.w * 7}px ${BLOB.h}px`,
            backgroundPosition: `${-POSE[pose] * BLOB.w}px 0`,
            transformOrigin: "50% 100%",
            transform: `scale(${blobSx}, ${blobSy})`,
            opacity: blobOn,
          })}
        />

        {pose === "sleep" &&
          [0, 14].map((lag) => {
            const z = ((frame + lag) % 28) / 28;
            return (
              <span
                key={lag}
                style={abs({
                  left: blob.x + 22 + z * 12,
                  top: blob.ground - BLOB.h - 2 - z * 22,
                  fontSize: 11 + z * 6,
                  fontWeight: 700,
                  lineHeight: 1,
                  color: "#fff",
                  opacity: Math.sin(Math.PI * z) * 0.9 * night,
                })}
              >
                z
              </span>
            );
          })}

        {/* The terminal's cursor: a block of the helper's lavender. */}
        {cursor && (
          <span
            style={abs({
              left: cursor.x,
              top: cursor.y - cursor.h / 2,
              width: cursor.w,
              height: cursor.h,
              borderRadius: cursor.round,
              background: LAVENDER,
              opacity: cursor.on,
              transform: `rotate(${cursor.rot}deg)`,
            })}
          />
        )}

        {/* A teammate's pointer, with their face. */}
        <div
          style={abs({
            left: pointer.x,
            top: pointer.y,
            opacity: pointer.on,
            transform: pointer.press ? "scale(0.9)" : undefined,
            transformOrigin: "0 0",
          })}
        >
          <svg
            width="20"
            height="22"
            viewBox="0 0 20 22"
            style={{
              display: "block",
              filter: "drop-shadow(0 2px 3px rgba(20,26,90,0.3))",
            }}
          >
            <path
              d="M2 2l6 17 2.8-7L18 9.2z"
              fill="#f0593f"
              stroke="#fff"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={abs({
              left: 16,
              top: 16,
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "#f0593f",
              boxShadow: "0 2px 6px rgba(20,26,90,0.3)",
            })}
          >
            <Face index={4} x={2} y={2} size={22} radius={11} />
          </span>
        </div>
      </div>
    </div>
  );
}
