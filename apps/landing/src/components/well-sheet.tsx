import { cn } from "@/lib/utils";
import { useId } from "react";

/**
 * The sheet — the one drawing the whole site shares.
 *
 * A flat sheet of rings and spokes in hairlines, seen from a fixed height,
 * that can bend down into a well. The page's frame is already hairlines;
 * this is the same line, in perspective. It appears behind the hero film
 * (flat, in white on the indigo), as the gravity well in the middle of the
 * homepage (bent, on white, with things falling in), and in the closing
 * band of every page (the well again, in white). Everything else on the
 * page is a glossy object standing on it: buttons, bars, the illustrations.
 *
 * It is geometry, not a drawing. The surface is z = -K / r (K = 0 for the
 * flat sheet), and every line is that surface sampled and projected. All of
 * it is computed when the module loads, so the server and the browser print
 * the same markup.
 */

/* ---- Geometry ------------------------------------------------------------
   World: x right, y away from the viewer, z up. */

/** How hard the well pulls; its depth at radius r is WELL / r. */
export const WELL = 4200;
/** The mouth of the well, how far below it the lines run on, and the edge
 *  of the sheet. */
export const R_MOUTH = 24;
export const R_THROAT = 19.5;
const R_EDGE = 1100;
/** The camera's height above the horizon, and how strong its perspective is. */
const ELEVATION = (26 * Math.PI) / 180;
const FOCAL = 1900;
const SIN = Math.sin(ELEVATION);
const COS = Math.cos(ELEVATION);

export const TAU = Math.PI * 2;

/** A point of the sheet on screen. `pull` is WELL for the well, 0 for flat. */
export function project(
  r: number,
  theta: number,
  pull = WELL,
): [number, number] {
  const x = r * Math.cos(theta);
  const y = r * Math.sin(theta);
  const z = -pull / r;
  const p = FOCAL / (FOCAL + y * COS - z * SIN);
  return [x * p, -(y * SIN + z * COS) * p];
}

/* One decimal: enough for a hairline, and short markup. */
export const n = (v: number) => v.toFixed(1);
export const toPath = (points: [number, number][]) =>
  points.map(([x, y], i) => `${i ? "L" : "M"}${n(x)} ${n(y)}`).join("");

const SPOKES = 28;

function mesh(pull: number) {
  /* Rings: closer together toward the middle, where the well steepens. */
  const radii = [
    ...(pull ? [21] : []),
    R_MOUTH, 30, 40, 54, 73, 99, 134, 181, 245, 331, 447, 604, 815, 1100,
  ];
  const inner = pull ? R_THROAT : R_MOUTH;
  return {
    rings: radii.map((r) => ({
      r,
      d: `${toPath(Array.from({ length: 96 }, (_, i) => project(r, (i / 96) * TAU, pull)))}Z`,
    })),
    /* Spokes: from the edge of the sheet to the middle. */
    spokes: Array.from({ length: SPOKES }, (_, j) => {
      const theta = ((j + 0.5) / SPOKES) * TAU;
      const steps = 70;
      return {
        /** 1 at the back of the sheet, 0 at the front. */
        back: (Math.sin(theta) + 1) / 2,
        d: toPath(
          Array.from({ length: steps + 1 }, (_, i) =>
            project(R_EDGE * (inner / R_EDGE) ** (i / steps), theta, pull),
          ),
        ),
      };
    }),
  };
}

const sheets = { well: mesh(WELL), flat: mesh(0) };

/** The mouth's centre on screen, where the light sits. */
export const [, MOUTH_Y] = project(R_MOUTH, 0);

export type View = { x: number; y: number; w: number; h: number };

/**
 * The sheet's lines and, for the well, its light. An <svg> that covers its
 * box; anything passed as children is drawn over the lines, in the same
 * coordinates.
 */
export function WellSheet({
  view,
  shape = "well",
  tone = "default",
  light = true,
  className,
  children,
}: {
  /** The part of the scene to show, in its own units. */
  view: View;
  shape?: "well" | "flat";
  /** "inverse" draws in white, for the indigo surfaces. */
  tone?: "default" | "inverse";
  light?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const id = useId();
  const inverse = tone === "inverse";
  const { rings, spokes } = sheets[shape];
  const box = { x: view.x, y: view.y, width: view.w, height: view.h };
  return (
    <svg
      aria-hidden
      viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn("absolute inset-0 size-full", className)}
      fill="none"
    >
      <defs>
        {/* The sheet fades out toward the edges of its box, and the well
            fades out as it goes down. */}
        <radialGradient id={`${id}-fade`} cx="50%" cy="46%" r="50%">
          <stop offset="0.42" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-sink`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.74" stopColor="#fff" />
          <stop offset="0.86" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-edges`}>
          <rect {...box} fill={`url(#${id}-fade)`} />
        </mask>
        <mask id={`${id}-depth`}>
          <rect {...box} fill={shape === "well" ? `url(#${id}-sink)` : "#fff"} />
        </mask>
        <radialGradient id={`${id}-light`}>
          <stop
            offset="0"
            stopColor={inverse ? "#fff" : "#3b49e0"}
            stopOpacity={inverse ? 0.5 : 0.55}
          />
          <stop
            offset="0.3"
            stopColor={inverse ? "#dfe4ff" : "#5f6ae8"}
            stopOpacity="0.22"
          />
          <stop
            offset="1"
            stopColor={inverse ? "#fff" : "#8fa0ff"}
            stopOpacity="0"
          />
        </radialGradient>
      </defs>

      {/* The light in the well: under the lines, so they stay crisp. */}
      {light && shape === "well" && (
        <ellipse
          cx="0"
          cy={n(MOUTH_Y)}
          rx="130"
          ry="84"
          fill={`url(#${id}-light)`}
        />
      )}

      <g mask={`url(#${id}-depth)`}>
        <g
          mask={`url(#${id}-edges)`}
          stroke={inverse ? "#fff" : "var(--well-line)"}
          strokeOpacity={inverse ? 0.26 : 1}
          strokeWidth="1"
        >
          {rings.map((ring) => (
            <path key={ring.r} d={ring.d} vectorEffect="non-scaling-stroke" />
          ))}
          {spokes.map((spoke) => (
            <path
              key={spoke.d}
              d={spoke.d}
              // The far side is a little lighter than the near side, which
              // is most of what makes it read as a surface.
              opacity={n(1 - spoke.back * 0.45)}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
        {children}
      </g>
    </svg>
  );
}
