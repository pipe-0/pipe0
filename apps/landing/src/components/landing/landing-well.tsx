import {
  R_THROAT,
  TAU,
  WellSheet,
  n,
  project,
  toPath,
  type View,
} from "@/components/well-sheet";
import { useEffect, useRef } from "react";

/**
 * The moment — three building blocks falling into one.
 *
 * The site's sheet (components/well-sheet.tsx), bent into a gravity well.
 * Clay-like tables, GTM MCPs and B2B data APIs start on its rim as three
 * marbles and roll in to the same point, where the light is. That is the
 * claim of the section, as physics: enough of the right things in one
 * place, and something starts.
 *
 * The marbles are the glossy plastic of the illustrations above, in their
 * three colours: indigo, yellow, coral. The lines are the page's own. This
 * section is where the two meet, which is the point of it visually as well.
 *
 * Motion is the three marbles and nothing else. Each follows its own spiral
 * and speeds up as it falls, the way a thing in a well does. They run only
 * while the section is on screen, and not at all for readers who have asked
 * for less motion: the page then shows them at rest, part of the way in,
 * which is also what the server renders.
 *
 * The scene is authored around its own centre and scaled to cover its box,
 * so the labels can be placed from the same numbers the lines are drawn
 * from (--well-scale, set by a ResizeObserver, for the reason given on
 * .hero-scene-inner).
 */

/** The view the scene is authored in: 1200 by 480 around the well's mouth. */
const VIEW: View = { x: -600, y: -206, w: 1200, h: 480 };

/* ---- The three blocks ----------------------------------------------------
   Each starts on the rim at its own angle and winds in on a logarithmic
   spiral: the radius falls by the same factor for every step of angle. */

const R_START = 250;
const TURNS = 0.9;
/** Points along a path, evenly spaced by distance travelled on screen. */
const STEPS = 240;

/* The plastic's three colours, each as highlight, body and edge. */
export const colours = {
  indigo: ["#8a94f6", "#3b49e0", "#2a35b0"],
  yellow: ["#ffe38f", "#f6bf38", "#d99d1c"],
  coral: ["#ffa091", "#f0593f", "#cc432c"],
} as const;

/* The same three as a tag: a light tint of the marble for the face, a
   deeper one for its rim, and a dark shade for the name, which is pressed
   into the face. Each name clears 4.5:1 against its face. */
const tags = {
  indigo: { face: ["#f1f3ff", "#e0e4fd"], rim: "#b9c0f6", ink: "#27319c" },
  yellow: { face: ["#fff8dc", "#ffecae"], rim: "#ecc864", ink: "#6a4a00" },
  coral: { face: ["#fff0ec", "#ffdcd4"], rim: "#f3aa9c", ink: "#96291a" },
} as const;

export type Colour = keyof typeof colours;

const blocks = (
  [
    { name: "Clay-like tables", short: "Tables", at: 187, side: "left", colour: "indigo", rest: 0.4 },
    { name: "GTM MCPs", short: "MCPs", at: 90, side: "top", colour: "yellow", rest: 0.62 },
    { name: "B2B data APIs", short: "APIs", at: 353, side: "right", colour: "coral", rest: 0.3 },
  ] as const
).map((block, index) => {
  const start = (block.at * Math.PI) / 180;
  const fine = 600;
  const raw = Array.from({ length: fine + 1 }, (_, i) => {
    const u = i / fine;
    const r = R_START * (R_THROAT / R_START) ** u;
    return { r, point: project(r, start + TURNS * TAU * u) };
  });
  // Distance travelled on screen, so a fraction of the path means the same
  // thing to the marble and to the dash that trails it.
  const travelled = [0];
  for (let i = 1; i < raw.length; i++) {
    const [ax, ay] = raw[i - 1].point;
    const [bx, by] = raw[i].point;
    travelled.push(travelled[i - 1] + Math.hypot(bx - ax, by - ay));
  }
  const total = travelled[fine];
  let j = 0;
  const along = Array.from({ length: STEPS + 1 }, (_, i) => {
    const want = (i / STEPS) * total;
    while (j < fine - 1 && travelled[j + 1] < want) j++;
    const t = (want - travelled[j]) / (travelled[j + 1] - travelled[j] || 1);
    const a = raw[j];
    const b = raw[j + 1];
    return {
      x: a.point[0] + (b.point[0] - a.point[0]) * t,
      y: a.point[1] + (b.point[1] - a.point[1]) * t,
      r: a.r + (b.r - a.r) * t,
    };
  });
  return {
    ...block,
    index,
    along,
    x: raw[0].point[0],
    y: raw[0].point[1],
    d: toPath(raw.map((s) => s.point)),
  };
});

/* ---- Motion --------------------------------------------------------------
   One fall takes SECONDS; the three are a third of a fall apart. */

const SECONDS = 9;
/** The trail behind a marble: a few dashes of its path, all ending at the
 *  marble, short and strong near it, long and faint behind. */
const trail = [
  { length: 0.12, opacity: 0.14, width: 1.4 },
  { length: 0.065, opacity: 0.3, width: 1.7 },
  { length: 0.028, opacity: 0.6, width: 2 },
];

/** Where a marble is, how big and how solid, a fraction `phase` of the way
 *  through its fall. It starts slowly and speeds up; it grows in as it
 *  leaves the rim, and shrinks and fades as it reaches the light. */
function pose(block: (typeof blocks)[number], phase: number) {
  const s = phase ** 1.8;
  const at = s * STEPS;
  const i = Math.min(STEPS - 1, Math.floor(at));
  const t = at - i;
  const a = block.along[i];
  const b = block.along[i + 1];
  const r = a.r + (b.r - a.r) * t;
  const depth = 0.42 + 0.58 * Math.sqrt(r / R_START);
  const enter = Math.min(1, phase / 0.05);
  const leave = Math.min(1, (1 - s) / 0.07);
  return {
    s,
    transform: `translate(${n(a.x + (b.x - a.x) * t)} ${n(a.y + (b.y - a.y) * t)}) scale(${(depth * (0.6 + 0.4 * enter)).toFixed(3)})`,
    opacity: (enter * leave).toFixed(3),
  };
}

/* Beside its dot on wide screens. On a phone the two side dots sit at the
   edges of the screen, so their names go above them and inward. */
const labelSide = {
  left: "max-sm:-ml-2 max-sm:-translate-y-[150%] sm:-ml-4 sm:-translate-x-full sm:-translate-y-1/2",
  right:
    "max-sm:ml-2 max-sm:-translate-x-full max-sm:-translate-y-[150%] sm:ml-4 sm:-translate-y-1/2",
  top: "-mt-4 -translate-x-1/2 -translate-y-full",
} as const;

/** A tag in the plastic of its marble: lit from above, with a rim that
 *  catches the light at the top and darkens at the foot, like the buttons.
 *  The light line under each letter is what presses the name in. */
export const tag = (colour: Colour) => {
  const { face, rim, ink } = tags[colour];
  return {
    color: ink,
    background: `linear-gradient(180deg, ${face[0]} 0%, ${face[1]} 100%)`,
    border: `1px solid ${rim}`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -2px 0 ${rim}66, 0 1px 2px rgba(20,26,90,0.08), 0 4px 10px -4px ${colours[colour][2]}66`,
    textShadow: "0 1px 0 rgba(255,255,255,0.85)",
  };
};

export function LandingWell() {
  const host = useRef<HTMLDivElement>(null);
  const marbles = useRef<(SVGGElement | null)[]>([]);
  const trails = useRef<(SVGPathElement | null)[][]>([[], [], []]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    // The scene covers its box, so its scale is whichever axis needs more.
    const fit = () =>
      el.style.setProperty(
        "--well-scale",
        String(Math.max(el.clientWidth / VIEW.w, el.clientHeight / VIEW.h)),
      );
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return () => ro.disconnect();

    let raf = 0;
    let origin = 0;
    const tick = (now: number) => {
      if (!origin) origin = now;
      const turn = (now - origin) / 1000 / SECONDS;
      for (const block of blocks) {
        // Each marble picks up from where it rests, so nothing jumps when
        // the motion starts.
        const p = pose(block, (block.rest + turn) % 1);
        const marble = marbles.current[block.index];
        if (marble) {
          marble.setAttribute("transform", p.transform);
          marble.setAttribute("opacity", p.opacity);
        }
        trails.current[block.index].forEach((path, k) => {
          if (path)
            path.style.strokeDashoffset = String(trail[k].length - p.s);
        });
      }
      raf = requestAnimationFrame(tick);
    };
    // Only while the well is on screen.
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={host}
      className="relative h-[320px] overflow-hidden sm:h-[400px] lg:h-[460px]"
    >
      <WellSheet view={VIEW}>
        <defs>
          {(Object.keys(colours) as Colour[]).map((colour) => (
            <radialGradient
              key={colour}
              id={`marble-${colour}`}
              cx="36%"
              cy="30%"
              r="72%"
            >
              <stop offset="0" stopColor={colours[colour][0]} />
              <stop offset="0.6" stopColor={colours[colour][1]} />
              <stop offset="1" stopColor={colours[colour][2]} />
            </radialGradient>
          ))}
        </defs>
        {blocks.map((block) => {
          const p = pose(block, block.rest);
          const [, body, edge] = colours[block.colour];
          return (
            <g key={block.name}>
              {/* The way in, as a hairline; where it starts, a small ring. */}
              <path
                d={block.d}
                stroke={edge}
                strokeOpacity="0.34"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={n(block.x)}
                cy={n(block.y)}
                r="3"
                fill="var(--background)"
                stroke={edge}
                strokeOpacity="0.7"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              {trail.map((dash, k) => (
                <path
                  key={dash.length}
                  ref={(node) => {
                    trails.current[block.index][k] = node;
                  }}
                  d={block.d}
                  pathLength="1"
                  stroke={body}
                  strokeLinecap="round"
                  strokeOpacity={dash.opacity}
                  strokeWidth={dash.width}
                  strokeDasharray={`${dash.length} 2`}
                  style={{ strokeDashoffset: dash.length - p.s }}
                />
              ))}
              {/* The marble: its shadow on the sheet, the ball, the shine. */}
              <g
                ref={(node) => {
                  marbles.current[block.index] = node;
                }}
                transform={p.transform}
                opacity={p.opacity}
              >
                <ellipse cx="2.5" cy="7.5" rx="7.5" ry="2.6" fill="#1c2466" opacity="0.16" />
                <circle
                  r="7.5"
                  fill={`url(#marble-${block.colour})`}
                  stroke={edge}
                  strokeWidth="0.6"
                />
                <ellipse
                  cx="-2.4"
                  cy="-3"
                  rx="2.7"
                  ry="1.7"
                  fill="#fff"
                  opacity="0.6"
                  transform="rotate(-28 -2.4 -3)"
                />
              </g>
            </g>
          );
        })}
      </WellSheet>

      {/* The names, in the page's own type at its own size, placed from the
          same numbers as the lines. */}
      {blocks.map((block) => (
        <span
          key={block.name}
          className={`absolute whitespace-nowrap rounded-[8px] px-3 py-1 text-[14px] font-semibold leading-5 ${labelSide[block.side]}`}
          style={{
            ...tag(block.colour),
            left: `calc(50% + var(--well-scale, 1) * ${n(block.x - (VIEW.x + VIEW.w / 2))}px)`,
            top: `calc(50% + var(--well-scale, 1) * ${n(block.y - (VIEW.y + VIEW.h / 2))}px)`,
          }}
        >
          <span className="sm:hidden">{block.short}</span>
          <span className="max-sm:hidden">{block.name}</span>
        </span>
      ))}
    </div>
  );
}
