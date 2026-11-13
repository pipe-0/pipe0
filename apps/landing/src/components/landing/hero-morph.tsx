import { Check, Mail, Play, Send, Sparkles, User } from "lucide-react";
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
 * Hero film: one piece of work, in three places, moved along by three
 * short prompts.
 *
 * It opens in a coding agent's terminal. Someone asks for a list; the agent
 * calls pipe0 over MCP and prints three people. Then they type "Move this
 * data to a sheet.", and the terminal becomes one: its window widens, its
 * dark rolls up like a blind into a bar that keeps the prompt, and the
 * three printed lines grow into three rows, their pixel portraits
 * sharpening into photographs. The terminal's cursor drops off the prompt
 * into the first empty cell, and when it lands it is the pipe0 helper: it
 * was the same thing all along. It works row by row, trying providers one
 * tile at a time until one finds the address, then reading up why now is
 * the moment to write. The team shows up to look.
 *
 * Then a third prompt, in the sheet's own bar: "Reach out to 2 people on
 * this list per day." A column for it grows in, and Run becomes an alarm
 * clock. Night passes with nobody there; the clock rings, and the helper
 * sends the day's two on its own. Then it hops back onto the prompt,
 * squares off into a cursor, and the blind comes down.
 *
 * The sheet is not a copy of the product. It is the idea of it at a size a
 * landing page can show: a few big rows, a column that is a job done for
 * every row, a waterfall of providers per cell, and somebody doing the
 * work. No provider logos; the providers are the plastic tiles.
 *
 * Flat things are DOM, so type stays crisp and nothing loads but a few
 * small pictures: the helper's poses, the clock and the portraits, made
 * with fal.ai (assets/illustrations/film_fal.md). The helper is animated
 * pose to pose, like a toy in stop motion, and moved from here. It moves
 * calmly on purpose: one thing at a time, low hops, no flicker.
 *
 * Authored in a fixed 1200x500 space and scaled by `.hero-scene`; every
 * number below is in that space. Frames are 30 a second. To look at one
 * frame, open the page with ?film=<frame>.
 *
 * Earlier films, both kept: hero-morph-v1.tsx (one prompt, a teammate
 * presses Run, a new row arrives) and hero-film.tsx.
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
      ["Opened Berlin", "indigo"],
    ],
  },
  {
    name: "Amara Okafor",
    title: "VP Marketing",
    company: "Vireo",
    email: "amara@vireo.app",
    face: 2,
    tries: ["yellow", "coral"],
    tags: [
      ["EU launch", "yellow"],
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
const TEAM_FACES = [5, 6, 7];

/** The three prompts: in the terminal, in the terminal again, and in the
 *  sheet's own bar. */
const ASK = [
  "Find growth leaders at Series B SaaS startups",
  "with their work emails and why now.",
];
const MOVE = "Move this data to a sheet.";
const AUTO = "Reach out to 2 people on this list per day.";

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
/** The walls after each column but the last: three columns while the sheet
 *  fills (the third number is the sheet's own edge), four once it is
 *  automated. */
const W3 = [B.x + 372, B.x + 706, B.x + B.w];
const W4 = [B.x + 318, B.x + 580, B.x + 842];
const FACE_X = B.x + 24;
const TEXT_X = B.x + 96;
const slotY = (slot: number) => ROWS + ROW * slot + ROW / 2;
/** Where the helper's feet stand in a row. */
const feet = (slot: number) => ROWS + ROW * (slot + 1) - 9;
/** It stands at the right of a cell, so what it finds can sit at the left
 *  and the column's name stays in view above it. */
const MAIL_X = W3[0] + 272;
const WHY_X = W3[1] + 290;
const SEND_X = W4[2] + 152;

/** The terminal's printed lines. */
const LINE_Y = (i: number) => A.y + TERM.line + TERM.pitch * i;
const CW = 9.6; // Geist Mono at 16px: every glyph is 0.6em wide
/** The prompt in the bar: one line, a touch smaller. */
const BAR_X = B.x + 62;
const BAR_CW = 8.7;
const BAR_Y = B.y + BAR / 2;
/** The cursor's seat at the end of a prompt in the bar. */
const seat = (text: string) => BAR_X + text.length * BAR_CW + 6;
const RUN_X = B.x + B.w - 54;
const PERCH = { x: RUN_X - 88, y: B.y + 9 };

/* ---- Time, in frames ---- */

/** When each letter of a prompt is typed. `slow` adds to every gap. */
function keystrokes(text: string, start: number, seed: number, slow = 0) {
  const at: number[] = [];
  let t = start;
  for (let k = 0; k < text.length; k++) {
    t +=
      0.34 +
      slow +
      noise(seed + k) * 0.56 +
      (text[k - 1] === " " ? noise(seed * 3 + k) * 0.5 : 0);
    at.push(t);
  }
  return at;
}
const last = (at: number[]) => Math.ceil(at[at.length - 1]);

/* One: the question, and the agent's answer. */
const KEYS = [keystrokes(ASK[0], 12, 1)];
KEYS.push(keystrokes(ASK[1], last(KEYS[0]) + 1.5, 2));
const ENTER = last(KEYS[1]) + 5;
const TOOL1 = ENTER + 8;
const FOUND = TOOL1 + 15;
const LINE = [FOUND + 2, FOUND + 8, FOUND + 14];
/* Two: "Move this data to a sheet.", and the terminal becomes one. */
const TYPE2 = LINE[2] + 14;
const KEYS2 = keystrokes(MOVE, TYPE2, 5, 0.12);
const ENTER2 = last(KEYS2) + 5;
const TOOL2 = ENTER2 + 2;
const MADE = TOOL2 + 13;
const M = MADE + 7;
/** The cursor tips off the prompt; and the frame it lands as the helper. */
const TIP = M + 44;
const BORN = TIP + 17;

type Job = { start: number; done: number; leave: number };
/** An email cell: a glance, then one try every ten frames. */
const mailJob = (start: number, tries: number): Job => {
  const done = start + 8 + (tries - 1) * 10 + 6;
  return { start, done, leave: done + 11 };
};
const whyJob = (start: number): Job => ({
  start,
  done: start + 9,
  leave: start + 17,
});
const sendJob = (start: number): Job => ({
  start,
  done: start + 8,
  leave: start + 17,
});
/** Hops, in frames: across a row, and down to the start of the next. */
const ACROSS = 11;
const DOWN = 12;
/** Row by row: the address, then the reason. */
const MAIL: Job[] = [];
const WHY: Job[] = [];
PEOPLE.slice(0, 3).forEach((p, i) => {
  MAIL.push(mailJob(i ? WHY[i - 1].leave + DOWN : BORN + 2, p.tries.length));
  WHY.push(whyJob(MAIL[i].leave + ACROSS));
});
/** The team arrives while the last row is being done. */
const TEAM = MAIL[2].start;
/** The sheet is full; the helper goes up to the top edge to watch. */
const FILLED = WHY[2].leave + 2;
const TO_PERCH = 14;
/* Three: "Reach out to 2 people on this list per day.", typed in the bar. */
const TYPE3 = FILLED + 10;
const KEYS3 = keystrokes(AUTO, TYPE3, 9, 0.12);
const ENTER3 = last(KEYS3) + 6;
/** Run starts turning into the clock. */
const SET = ENTER3 + 2;
const NIGHT = ENTER3 + 16;
const DAWN = NIGHT + 40;
const RING = DAWN + 12;
const WAKE = RING + 2;
/** The day's two, sent by the helper on its own. */
const SEND: Job[] = [sendJob(RING + 24)];
SEND.push(sendJob(SEND[0].leave + DOWN));
/** The helper goes home and the blind comes down. */
const CLOSE = SEND[1].leave + 8;
const HOME = CLOSE + 12;
const DURATION = CLOSE + 60;
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
  { go: FILLED, hop: TO_PERCH, x: PERCH.x, y: PERCH.y },
  { go: SEND[0].start - 13, hop: 13, x: SEND_X, y: feet(0) },
  { go: SEND[0].leave, hop: DOWN, x: SEND_X, y: feet(1) },
  { go: CLOSE, hop: 12, x: seat(AUTO) + 4, y: BAR_Y + 10 },
];

function blobAt(frame: number) {
  let k = 0;
  for (let i = 0; i < STOPS.length; i++) if (frame >= STOPS[i].go) k = i;
  const to = STOPS[k];
  const from = STOPS[Math.max(0, k - 1)];
  const p = to.hop ? clamp01((frame - to.go) / to.hop) : 1;
  const far = Math.hypot(to.x - from.x, to.y - from.y);
  /* Low, unhurried hops. */
  const lift = p < 1 ? (14 + far * 0.09) * 4 * p * (1 - p) : 0;
  const next = STOPS[k + 1];
  /* Squash and stretch, a little of each: it crouches before a hop,
     stretches in the air and settles when it lands. */
  const crouch = next ? clamp01((frame - (next.go - 3)) / 3) : 0;
  const since = frame - (to.go + to.hop);
  const settle =
    since >= 0 ? Math.exp(-since / 2.6) * Math.cos(since * 1.05) : 0;
  const air = p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0;
  const sy = 1 + 0.06 * air - 0.11 * settle - 0.07 * crouch;
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
  for (const job of MAIL) {
    if (frame < job.start || frame >= job.leave) continue;
    if (frame < job.start + 1) return "idle";
    if (frame < job.start + 7) return "glance";
    return frame < job.done ? "look" : "mail";
  }
  for (const job of WHY)
    if (frame >= job.start + 1 && frame < job.start + 11) return "look";
  // Sending: it holds the letter up.
  for (const job of SEND)
    if (frame >= job.start + 2 && frame < job.leave - 2) return "mail";
  // On the top edge: it watches the prompt being typed, then sleeps.
  const perched = FILLED + TO_PERCH;
  if (frame >= perched + 2 && frame < ENTER3) return "glance";
  if (frame >= NIGHT + 12 && frame < WAKE) return "sleep";
  if (frame >= NIGHT + 4 && frame < WAKE + 2) return "blink";
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
  const fall = 1 - ease(clamp01(t / 6));
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
  set: setText = text,
  t,
  from,
  to,
  width,
  ink,
  weight,
}: {
  text: string;
  /** What it reads in the sheet's type, if not the same. */
  set?: string;
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
  const set = width || setText.length * to.size * 0.52;
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
          {setText}
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

export function HeroMorph() {
  const host = useRef<HTMLDivElement>(null);
  const frame = useFilmFrame(host);
  useSceneScale(host);
  const widths = useWidths(host);

  /* Where the film is: frames into the morph, and frames into the close. */
  const mf = Math.max(0, frame - M);
  const c = frame - CLOSE;
  const closing = c > 0;
  const back = closing ? spring(c, 30, 20, 0.15) : 0;

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
    ? 1 - inOut(clamp01((c - 14) / 16))
    : inOut(clamp01((mf - 18) / 24));
  const edge = lerp(win.y + win.h, win.y + BAR, blind);
  /* How far the terminal's things have gone to their places in the bar. */
  const pm = closing ? 1 - back : spring(mf, 0, 22, 0.1);
  /* The terminal's own furniture: title strip, tool lines, input boxes. */
  const chrome = closing ? prog(c, 42, 12) : 1 - prog(mf, 0, 8);
  const inTerminal = frame < M + 10 && !closing;

  /* The rows growing out of the lines: the lowest first, so each makes
     room for the one above it, and the blind meets them in that order. */
  const spread = (i: number) => spring(mf, 6 + 3 * (2 - i), 18, 0.3);
  const reset = (i: number) => inOut(clamp01((mf - 8 - 3 * (2 - i)) / 14));
  const sharpen = (i: number) => clamp01((mf - 14 - 3 * (2 - i)) / 22);
  /* The portraits keep one left edge on the way. */
  const faceAlong = spring(mf, 8, 18, 0.25);

  /* The automation's column growing in: the walls move over to make room. */
  const col = spring(frame, ENTER3 + 2, 18, 0.15);
  const wall = W3.map((x, k) => lerp(x, W4[k], col));

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
  const count = (at: number[]) => at.filter((k) => k <= frame).length;
  const typed = KEYS.map(count);
  const moved = count(KEYS2);
  const asked = count(KEYS3);
  const boxTall = closing ? 0 : spring(frame, KEYS[1][0] - 1, 9, 0.2);
  /* The bar's line: the second prompt once the blind is up, then the third
     typed over it. */
  const barInk = closing ? 1 - prog(c, 18, 10) : prog(mf, 12, 8);
  const moveInk = 1 - prog(frame, TYPE3 - 8, 6);

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
    return (
      <div key={`${side}-${p.name}`} style={abs({ left: 0, top: 0, opacity })}>
        <Face
          index={p.face}
          x={lerp(A.x + TERM.pad, FACE_X, i === undefined ? 1 : faceAlong)}
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
            {/* The company brings its dot with it, so the two words are
                never read as one on the way. */}
            <Reset
              text={p.company}
              set={`· ${p.company}`}
              t={re}
              from={{ x: A.x + TERM.company, y: yc, size: 16 }}
              to={{ x: TEXT_X + titleW + 5, y: yc + 13, size: 14.5 }}
              width={widths[`c${i}`]}
              ink={dark ? N.soft : S.muted}
              weight={400}
            />
          </>
        )}
      </div>
    );
  };

  /* ---- A row's jobs ---- */
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
  const jobs = (
    p: Person,
    key: string,
    yc: number,
    mail?: Job,
    why?: Job,
    send?: Job,
  ) => {
    const mx = wall[0] + 24;
    const wx = wall[1] + 24;
    const sx = wall[2] + 24;
    const flash = mail ? clamp01(1 - (frame - mail.done) / 20) : 0;
    return (
      <div key={key} style={abs({ left: 0, top: 0 })}>
        {/* Work email: a soft green as it lands, the tries, the address. */}
        {mail && frame >= mail.done && flash > 0 && (
          <span
            style={abs({
              left: wall[0] + 1,
              top: yc - ROW / 2 + 1,
              width: wall[1] - wall[0] - 1,
              height: ROW - 1,
              background: `rgba(95,214,160,${0.16 * flash})`,
            })}
          />
        )}
        {waiting(mx, yc, mail ? 1 - prog(frame, mail.start - 2, 4) : 1)}
        {mail &&
          p.tries.map((colour, k) => (
            <Tile
              key={k}
              frame={frame}
              at={mail.start + 8 + 10 * k}
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
            {p.email.slice(0, Math.floor((frame - mail.done) * 2))}
          </span>
        )}
        {/* Why now: what has just happened there, as tags. */}
        {waiting(wx, yc, why ? 1 - prog(frame, why.start - 2, 4) : 1, 96)}
        {why && (
          <span style={abs({ left: wx, top: yc - 15, display: "flex", gap: 8 })}>
            {p.tags.map(([name, colour], j) => {
              const at = why.start + 8 + 4 * j;
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
                    opacity: clamp01((frame - at) / 3),
                    transform: `scale(${0.7 + 0.3 * spring(frame, at, 11, 0.3)})`,
                  }}
                >
                  {name}
                </span>
              );
            })}
          </span>
        )}
        {/* Outreach: sent for today's two; the rest wait their turn. */}
        {send
          ? frame >= send.done && (
              <span
                style={{
                  ...tag("indigo"),
                  position: "absolute",
                  left: sx,
                  top: yc - 15,
                  height: 30,
                  padding: "0 12px 0 9px",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 13.5,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  opacity: clamp01((frame - send.done) / 3),
                  transformOrigin: "0 50%",
                  transform: `scale(${0.7 + 0.3 * spring(frame, send.done, 11, 0.3)})`,
                }}
              >
                <Check size={14} strokeWidth={2.8} /> Sent
              </span>
            )
          : frame >= SEND[1].done && (
              <span
                style={abs({
                  left: sx,
                  top: yc - 12,
                  lineHeight: "24px",
                  fontSize: 14.5,
                  color: S.muted,
                  opacity: prog(frame, SEND[1].done + 4, 12),
                })}
              >
                Tomorrow
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
  /* Little lifts in place: something found or sent, a ring that wakes it. */
  const lifted = [...MAIL, ...SEND].find(
    (j) => frame >= j.done && frame < j.done + 9,
  );
  const jump =
    (lifted ? 5 * Math.sin((Math.PI * (frame - lifted.done)) / 9) : 0) +
    (frame >= WAKE && frame < WAKE + 9
      ? 13 * Math.sin((Math.PI * (frame - WAKE)) / 9)
      : 0);
  const breath = pose === "sleep" ? 0.025 * Math.sin(frame / 6) : 0;
  const blobOn = clamp01((frame - (BORN - 2)) / 2) * (1 - home);
  const blobSx = blob.sx * lerp(1.35, 1, birth) * lerp(1, 0.4, home) - breath;
  const blobSy = blob.sy * lerp(0.4, 1, birth) * lerp(1, 0.5, home) + breath;

  /* ---- The cursor ---- */
  const cursor = (() => {
    const blinkOn = Math.floor(frame / 9) % 2 === 0;
    const block = { rot: 0, round: 1.5, on: 1 };
    /* In the terminal's lower box, after whatever has been typed there. */
    const lower = {
      x: A.x + TERM.text + moved * CW,
      y: A.y + TERM.box + 19,
    };
    if (frame >= TIP && frame < HOME) {
      if (frame >= BORN) return null;
      // It tips off the end of the prompt and drops into the first cell,
      // rounding off and filling out on the way: half block, half helper.
      const q = clamp01((frame - TIP) / 14);
      const squash = clamp01((frame - TIP - 14) / 3);
      const w = lerp(BAR_CW, 30, q * q);
      const h = lerp(18, 28, q * q);
      return {
        x: lerp(seat(MOVE), MAIL_X - 15, glide(q)),
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
        x: lerp(seat(AUTO), A.x + TERM.text, back),
        y: lerp(BAR_Y, A.y + TERM.ask, back),
        w: lerp(BAR_CW * 3, lerp(BAR_CW, CW, back), grow),
        h: lerp(8, lerp(18, 20, back), grow),
        round: lerp(8, 1.5, grow),
      };
    }
    if (frame >= M) {
      // It rides up into the bar, to the end of the line it just typed.
      return {
        ...block,
        x: lerp(lower.x, seat(MOVE), pm),
        y: lerp(lower.y, BAR_Y, pm) - 22 * Math.sin(Math.PI * clamp01(pm)),
        w: lerp(CW, BAR_CW, pm),
        h: lerp(20, 18, pm),
        on: mf < 26 || blinkOn ? 1 : 0,
      };
    }
    if (frame >= ENTER) {
      const typing = frame >= TYPE2 && frame < ENTER2 - 4;
      return { ...block, ...lower, w: CW, h: 20, on: typing || blinkOn ? 1 : 0 };
    }
    const line = typed[1] > 0 ? 1 : 0;
    const typing = frame >= 12 && frame < ENTER - 4;
    return {
      ...block,
      x: A.x + TERM.text + typed[line] * CW,
      y: A.y + TERM.ask + TERM.lead * line,
      w: CW,
      h: 20,
      on: typing || blinkOn ? 1 : 0,
    };
  })();

  /* ---- The team: here while the sheet fills, gone by night ---- */
  const teamOn = (k: number) =>
    spring(frame, TEAM + k * 5, 12, 0.3) * (1 - prog(frame, NIGHT - 4 + k * 2, 8));

  /* ---- Run, which becomes the alarm clock ---- */
  const runOn = closing ? 0 : prog(mf, 46, 10);
  const pressed = frame >= ENTER3 && frame < ENTER3 + 3;
  const toClock = clamp01((frame - SET) / 8);
  const clockIn = spring(frame, SET + 7, 12, 0.4);
  const clockOn = frame >= SET + 7 ? 1 - (closing ? prog(c, 0, 8) : 0) : 0;
  /* Night: five in the afternoon to nine in the morning, hands running. */
  const night = prog(frame, NIGHT, 18) * (1 - prog(frame, DAWN, 16));
  const hours = inOut(clamp01((frame - NIGHT - 2) / (DAWN + 10 - NIGHT - 2)));
  const ringing =
    frame >= RING && frame < RING + 16 ? 1 - (frame - RING) / 20 : 0;
  const shake = ringing ? ((frame - RING) % 4 < 2 ? 1 : -1) * 6 * ringing : 0;

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
            opacity: done || Math.floor(frame / 6) % 2 ? 1 : 0.4,
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
  const box: CSSProperties = {
    borderRadius: 9,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.03)",
  };

  return (
    <div
      ref={host}
      className="hero-scene mx-auto w-full min-w-0 max-w-[1200px]"
      role="img"
      aria-label="In a terminal, an agent finds a list of people through pipe0. Asked to move it to a sheet, the terminal becomes one, and its cursor turns into a small helper that fills in each person's work email and why to write now. Asked to reach out to two people a day, the sheet gets an alarm clock; overnight nobody is there, and in the morning the helper sends the day's two on its own."
    >
      <div className="hero-scene-inner" aria-hidden>
        {/* Hidden copies, to measure how wide the sheet's type sets each
            word. */}
        {PEOPLE.slice(0, 3).map((p, i) => (
          <span key={p.name}>
            <Measure id={`n${i}`} text={p.name} size={20} weight={600} />
            <Measure id={`t${i}`} text={p.title} size={14.5} weight={400} />
            <Measure id={`c${i}`} text={`· ${p.company}`} size={14.5} weight={400} />
          </span>
        ))}

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
            {PEOPLE.map((p, i) => {
              const yc =
                i < 3 ? lerp(LINE_Y(i), slotY(i), spread(i)) : slotY(i);
              return (
                <div key={p.name}>
                  {person(p, "light", yc, i < 3 ? i : undefined)}
                  {jobs(p, `jobs-${p.name}`, yc, MAIL[i], WHY[i], SEND[i])}
                </div>
              );
            })}
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
            {/* The head: three columns, and a fourth once the sheet is told
                to reach out. */}
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
            {wall.map((x, k) => (
              <span
                key={k}
                style={abs({
                  left: x,
                  top: TOP,
                  width: 1,
                  height: DEPTH,
                  background: S.soft,
                  opacity: k === 2 ? col : 1,
                })}
              />
            ))}
            {[
              { x: B.x + 24, icon: <User size={15} />, label: "Person", on: 1 },
              { x: wall[0] + 24, icon: <Mail size={15} />, label: "Work email", on: 1 },
              { x: wall[1] + 24, icon: <Sparkles size={15} />, label: "Why now", on: 1 },
              { x: wall[2] + 24, icon: <Send size={15} />, label: "Outreach", on: col },
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
                  opacity: head.on,
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

            {/* The first prompt: typed into a box at the top. */}
            <div
              style={abs({
                ...box,
                left: A.x + TERM.pad,
                top: A.y + 50,
                width: A.w - TERM.pad * 2,
                height: lerp(40, 66, boxTall),
                opacity: closing ? chrome : 1 - prog(frame, ENTER, 5),
              })}
            />
            {(inTerminal || closing) && (
              <span
                style={abs({
                  left: A.x + TERM.mark,
                  top: A.y + TERM.ask - 12,
                  lineHeight: "24px",
                  color: LAVENDER,
                  opacity: chrome,
                })}
              >
                &gt;
              </span>
            )}
            {inTerminal &&
              [0, 1].map((idx) => (
                <span
                  key={idx}
                  style={abs({
                    left: A.x + TERM.text,
                    top: A.y + TERM.ask + TERM.lead * idx - 12,
                    lineHeight: "24px",
                    color: frame < ENTER ? N.ink : "#d5d9ee",
                    whiteSpace: "pre",
                    opacity: chrome,
                  })}
                >
                  {ASK[idx].slice(0, typed[idx])}
                </span>
              ))}

            {/* What the agent does with it, and the second prompt. */}
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
                    growth-leaders ↗
                  </span>,
                )}
                <div
                  style={abs({
                    ...box,
                    left: A.x + TERM.pad,
                    top: A.y + TERM.box,
                    width: A.w - TERM.pad * 2,
                    height: 38,
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
                      left: TERM.text - TERM.pad - 1,
                      top: 6,
                      lineHeight: "24px",
                      whiteSpace: "pre",
                      color: frame < ENTER2 ? N.ink : "#d5d9ee",
                    })}
                  >
                    {MOVE.slice(0, moved)}
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
                    {(frame >= ENTER && frame < FOUND) ||
                    (frame >= ENTER2 && frame < MADE)
                      ? "esc to interrupt"
                      : "? for shortcuts"}
                  </span>
                </div>
              </>
            )}

            {/* The bar's line: "Move this data to a sheet.", and later the
                third prompt typed over it. */}
            {frame >= M && barInk > 0 && (
              <>
                <span
                  style={abs({
                    left: B.x + 44,
                    top: win.y + BAR / 2 - 12,
                    lineHeight: "24px",
                    fontSize: 14.5,
                    color: LAVENDER,
                    opacity: barInk,
                  })}
                >
                  &gt;
                </span>
                <span
                  style={abs({
                    left: BAR_X,
                    top: win.y + BAR / 2 - 12,
                    lineHeight: "24px",
                    fontSize: 14.5,
                    whiteSpace: "pre",
                    opacity: barInk,
                  })}
                >
                  {frame < TYPE3 ? (
                    <span style={{ opacity: moveInk }}>{MOVE}</span>
                  ) : (
                    AUTO.slice(0, asked)
                  )}
                </span>
                {/* A plain caret for this one: the cursor is busy being
                    the helper. */}
                {frame >= TYPE3 - 3 && frame < ENTER3 + 3 && (
                  <span
                    style={abs({
                      left: BAR_X + asked * BAR_CW + 1,
                      top: win.y + BAR / 2 - 9,
                      width: 2,
                      height: 18,
                      borderRadius: 1,
                      background: LAVENDER,
                    })}
                  />
                )}
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
                        prog(frame, LINE[i], 5),
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
                    left: RUN_X - 212 + k * 21,
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
            {runOn > 0 && frame < SET && (
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
                  transform: pressed ? "scale(0.93)" : undefined,
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
        {frame >= SET && frame < SET + 11 && (
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
              opacity: 1 - clamp01((frame - SET - 8) / 3),
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
      </div>
    </div>
  );
}
