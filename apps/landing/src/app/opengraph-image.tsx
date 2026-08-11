import { readFile } from "fs/promises";
import { ImageResponse } from "next/og";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "pipe0 — Operate your Revenue Factory";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

/* The card mirrors the landing hero: white page, dark headline over a muted
   subhead, and below them the blue sky panel with the globe scene and the
   trusted-by row set into its foot. Colors are lifted verbatim from
   globals.css (.hero-sky, .trusted-scrim) and the scene geometry from the
   GlobeLoop composition (closed/assets/remotion/src/GlobeLoop.tsx), frozen at
   the moment the connection arc completes. */

const TITLE = "Operate a Revenue Factory";
const SUBTITLE =
  "From morning briefings to the signal engine behind your pipeline.";

// ---------------------------------------------------------------------------
// Globe scene — static SVG, same math as the GlobeLoop composition: a planet
// so large only its gently bent waterline crosses the frame.
// ---------------------------------------------------------------------------

const SCENE_W = 1144;
const SCENE_H = 464;
const R = 3000;
const CX = SCENE_W / 2;
const APEX_Y = 255;
const CY = APEX_Y + R;

const surfaceY = (x: number) => CY - Math.sqrt(R * R - (x - CX) * (x - CX));
const surfaceTiltRad = (x: number) => Math.asin((x - CX) / R);
const tiltDeg = (x: number) => (surfaceTiltRad(x) * 180) / Math.PI;

/** Island silhouettes: baseline at y=0, land at y<0. */
const ISLAND_SCALE = 0.9;

type Island = {
  x: number;
  path: string;
  peak: { x: number; y: number };
  connects?: "a" | "b";
};

const ISLANDS: Island[] = [
  {
    // medium double-hump, far left
    x: 92,
    path: "M -110 0 Q -86 -12 -60 -19 Q -36 -25 -16 -19 Q -2 -15 14 -21 Q 44 -29 74 -15 Q 94 -8 110 0 Z",
    peak: { x: 50, y: -27 },
  },
  {
    // connection endpoint A
    x: 330,
    path: "M -130 0 Q -102 -11 -76 -21 Q -46 -33 -10 -37 Q 26 -33 56 -21 Q 92 -11 130 0 Z",
    peak: { x: -10, y: -36 },
    connects: "a",
  },
  {
    // connection endpoint B
    x: 796,
    path: "M -120 0 Q -94 -10 -64 -17 Q -30 -25 2 -27 Q 30 -31 56 -24 Q 90 -15 120 0 Z",
    peak: { x: 28, y: -29 },
    connects: "b",
  },
  {
    // small islet, far right
    x: 1050,
    path: "M -70 0 Q -52 -8 -30 -13 Q -6 -18 14 -14 Q 42 -9 56 -5 Q 64 -3 70 0 Z",
    peak: { x: 0, y: -16 },
  },
];

/** World-space anchor of an island's peak, following the surface tilt. */
const peakAnchor = (island: Island) => {
  const th = surfaceTiltRad(island.x);
  const cos = Math.cos(th);
  const sin = Math.sin(th);
  return {
    x: island.x + ISLAND_SCALE * (island.peak.x * cos - island.peak.y * sin),
    y:
      surfaceY(island.x) +
      ISLAND_SCALE * (island.peak.x * sin + island.peak.y * cos),
  };
};

/** Point on the quadratic bezier M a Q c b at parameter t. */
const quadPoint = (
  a: { x: number; y: number },
  c: { x: number; y: number },
  b: { x: number; y: number },
  t: number,
) => {
  const m = 1 - t;
  return {
    x: m * m * a.x + 2 * m * t * c.x + t * t * b.x,
    y: m * m * a.y + 2 * m * t * c.y + t * t * b.y,
  };
};

// Meridian ticks crossing the waterline, and specular glints just below it —
// both hand-placed stand-ins for the composition's animated versions.
const TICKS = Array.from({ length: 14 }, (_, i) => 40 + i * 82);
const GLINTS: Array<[x: number, dy: number, w: number, op: number]> = [
  [70, 14, 34, 0.16],
  [152, 24, 50, 0.1],
  [242, 9, 22, 0.22],
  [382, 18, 40, 0.12],
  [472, 28, 56, 0.09],
  [560, 12, 30, 0.2],
  [642, 22, 44, 0.12],
  [732, 8, 26, 0.24],
  [842, 16, 38, 0.14],
  [932, 26, 52, 0.1],
  [1012, 11, 24, 0.18],
  [186, 33, 44, 0.08],
  [564, 35, 60, 0.07],
  [902, 7, 20, 0.26],
  [1096, 18, 36, 0.13],
];

function GlobeScene() {
  const islandA = ISLANDS.find((i) => i.connects === "a") as Island;
  const islandB = ISLANDS.find((i) => i.connects === "b") as Island;

  const a = peakAnchor(islandA);
  const b = peakAnchor(islandB);
  // Lift the endpoints slightly off the peaks.
  a.y -= 8;
  b.y -= 8;

  const chord = Math.hypot(b.x - a.x, b.y - a.y);
  const ctrl = {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2 - (0.18 * chord + 28),
  };
  const travel = quadPoint(a, ctrl, b, 0.62);

  return (
    <svg
      width={SCENE_W}
      height={SCENE_H}
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      style={{ position: "absolute", bottom: 0, left: 0 }}
    >
      <defs>
        <linearGradient
          id="globe-body"
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={APEX_Y}
          x2={0}
          y2={SCENE_H}
        >
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.16} />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity={0.05} />
          <stop offset="1" stopColor="#ffffff" stopOpacity={0.02} />
        </linearGradient>
        {/* Drifting light pools from .hero-sky, frozen. */}
        <radialGradient id="pool-a">
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.38} />
          <stop offset="0.7" stopColor="#ffffff" stopOpacity={0.06} />
          <stop offset="1" stopColor="#ffffff" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="pool-b">
          <stop offset="0" stopColor="#8cc4ff" stopOpacity={0.42} />
          <stop offset="0.7" stopColor="#8cc4ff" stopOpacity={0.07} />
          <stop offset="1" stopColor="#8cc4ff" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="pool-c">
          <stop offset="0" stopColor="#788cff" stopOpacity={0.3} />
          <stop offset="0.7" stopColor="#788cff" stopOpacity={0.05} />
          <stop offset="1" stopColor="#788cff" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="pool-d">
          <stop offset="0" stopColor="#badeff" stopOpacity={0.4} />
          <stop offset="0.7" stopColor="#badeff" stopOpacity={0.06} />
          <stop offset="1" stopColor="#badeff" stopOpacity={0} />
        </radialGradient>
      </defs>

      <ellipse cx={243} cy={322} rx={300} ry={130} fill="url(#pool-a)" />
      <ellipse cx={880} cy={288} rx={270} ry={120} fill="url(#pool-b)" />
      <ellipse cx={770} cy={66} rx={240} ry={100} fill="url(#pool-c)" />
      <ellipse cx={508} cy={346} rx={250} ry={110} fill="url(#pool-d)" />

      {/* Globe body + waterline */}
      <circle cx={CX} cy={CY} r={R} fill="url(#globe-body)" />
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="#ffffff"
        strokeWidth={8}
        opacity={0.12}
      />
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="#ffffff"
        strokeWidth={2}
        opacity={0.85}
      />

      {/* Latitude arcs */}
      <circle
        cx={CX}
        cy={CY}
        r={R - 55}
        fill="none"
        stroke="#ffffff"
        strokeWidth={1}
        opacity={0.1}
      />
      <circle
        cx={CX}
        cy={CY}
        r={R - 120}
        fill="none"
        stroke="#ffffff"
        strokeWidth={1}
        opacity={0.06}
      />

      {/* Meridian ticks */}
      {TICKS.map((x) => (
        <line
          key={x}
          x1={0}
          y1={-5}
          x2={0}
          y2={42}
          stroke="#ffffff"
          strokeWidth={1.4}
          strokeLinecap="round"
          opacity={0.14}
          transform={`translate(${x} ${surfaceY(x)}) rotate(${tiltDeg(x)})`}
        />
      ))}

      {/* Water glints */}
      {GLINTS.map(([x, dy, w, op]) => (
        <rect
          key={`${x}-${dy}`}
          x={x - w / 2}
          y={surfaceY(x) + dy - 1}
          width={w}
          height={2}
          rx={1}
          fill="#ffffff"
          opacity={op}
          transform={`rotate(${tiltDeg(x)} ${x} ${surfaceY(x) + dy})`}
        />
      ))}

      {/* Land, with a faint reflection in the water */}
      {ISLANDS.map((island) => (
        <g
          key={island.x}
          transform={`translate(${island.x} ${surfaceY(island.x)}) rotate(${tiltDeg(island.x)}) scale(${ISLAND_SCALE})`}
        >
          <path d={island.path} fill="#ffffff" opacity={0.92} />
          <path
            d={island.path}
            fill="#ffffff"
            opacity={0.14}
            transform="scale(1 -0.35)"
          />
        </g>
      ))}

      {/* The connection — a soft under-stroke stands in for the composition's
          drop-shadow glow, which satori/resvg cannot filter. */}
      <path
        d={`M ${a.x} ${a.y} Q ${ctrl.x} ${ctrl.y} ${b.x} ${b.y}`}
        fill="none"
        stroke="#ffffff"
        strokeWidth={6.5}
        strokeLinecap="round"
        opacity={0.22}
      />
      <path
        d={`M ${a.x} ${a.y} Q ${ctrl.x} ${ctrl.y} ${b.x} ${b.y}`}
        fill="none"
        stroke="#ffffff"
        strokeWidth={2.2}
        strokeLinecap="round"
        opacity={0.95}
      />
      {/* Endpoint nodes with pulse rings */}
      <circle cx={a.x} cy={a.y} r={10} fill="#ffffff" opacity={0.3} />
      <circle cx={a.x} cy={a.y} r={5} fill="#ffffff" />
      <circle cx={a.x} cy={a.y} r={16} fill="none" stroke="#ffffff" strokeWidth={1.2} opacity={0.26} />
      <circle cx={a.x} cy={a.y} r={25} fill="none" stroke="#ffffff" strokeWidth={1.2} opacity={0.12} />
      <circle cx={b.x} cy={b.y} r={10} fill="#ffffff" opacity={0.3} />
      <circle cx={b.x} cy={b.y} r={5} fill="#ffffff" />
      <circle cx={b.x} cy={b.y} r={14} fill="none" stroke="#ffffff" strokeWidth={1.2} opacity={0.22} />
      {/* Pulse traveling the arc */}
      <circle cx={travel.x} cy={travel.y} r={7} fill="#ffffff" opacity={0.3} />
      <circle cx={travel.x} cy={travel.y} r={3.5} fill="#ffffff" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Assets — everything is read from disk and inlined: satori cannot apply the
// hero's `brightness-0 invert`, so the wordmarks are whitened by rewriting
// their fills before embedding.
// ---------------------------------------------------------------------------

const whiten = (svg: string) =>
  svg.replace(/fill="(?!none)[^"]*"/g, 'fill="#ffffff"');

const svgSrc = (svg: string) =>
  `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

export default async function Image() {
  const [interLight, interSemiBold, logo, pie, lightfield, augusta, aries] =
    await Promise.all([
      readFile(join(process.cwd(), "assets/inter-light.ttf")),
      readFile(join(process.cwd(), "assets/inter-semibold.otf")),
      readFile(join(process.cwd(), "public/logo-small-light.svg"), "utf8"),
      readFile(
        join(process.cwd(), "public/media/website/logos/pie-light.svg"),
        "utf8",
      ),
      readFile(
        join(process.cwd(), "public/media/website/logos/lightfield.svg"),
        "utf8",
      ),
      readFile(
        join(process.cwd(), "public/media/website/logos/augusta-dark.svg"),
        "utf8",
      ),
      readFile(
        join(process.cwd(), "public/media/website/logos/aries-light.svg"),
        "utf8",
      ),
    ]);

  // Heights follow the hero's ratios; widths from each file's viewBox.
  const trustedLogos = [
    { src: svgSrc(whiten(pie)), width: 50, height: 32 },
    { src: svgSrc(whiten(lightfield)), width: 141, height: 26 },
    { src: svgSrc(whiten(augusta)), width: 121, height: 26 },
    { src: svgSrc(whiten(aries)), width: 66, height: 26 },
  ];

  return new ImageResponse(
    <div
      style={{
        /* Not pure white: unfurls often sit on white pages, and a card with
           no edge contrast reads as floating text. A faintly cool near-white
           keeps the light look while giving the card a silhouette. */
        backgroundColor: "#f4f5f8",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "26px 28px",
        fontFamily: "Inter",
      }}
    >
      {/* Header — the hero's copy block: headline and subhead share one font
          and size, separated only by tone, so they read as one short
          paragraph. The cube mark alone sits top-right. */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 31,
            fontWeight: 600,
            letterSpacing: "-0.018em",
            lineHeight: 1.36,
          }}
        >
          <div style={{ color: "#0a0a0a" }}>{TITLE}</div>
          <div style={{ color: "#737373" }}>{SUBTITLE}</div>
        </div>
        <img
          src={svgSrc(logo)}
          alt=""
          width={46}
          height={47}
          style={{ marginTop: 2 }}
        />
      </div>

      {/* The sky panel — .hero-sky's dusk gradient inside .hero-panel's
          rounded, dark-edged frame. */}
      <div
        style={{
          flexGrow: 1,
          position: "relative",
          display: "flex",
          borderRadius: 22,
          border: "1px solid #1f2673",
          overflow: "hidden",
          /* .hero-sky's stops, stretched downward: this panel is much
             squatter than the hero's 16:9, and at the original percentages
             the deep blues compress into a thin band at the top. */
          background:
            "linear-gradient(180deg, #2c37a4 0%, #3a49c4 18%, #4d61d6 36%, #7b94e8 56%, #b5d2f6 74%, #cde4fb 90%, #d6e9fc 100%)",
        }}
      >
        <GlobeScene />

        {/* Gloss highlight along the top edge (.hero-panel::after) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 56,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.17) 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0) 100%)",
          }}
        />

        {/* Trusted-by row in the foot, over the darkening scrim */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 170,
            background:
              "linear-gradient(180deg, rgba(44,55,164,0) 0%, rgba(44,55,164,0.16) 30%, rgba(42,52,158,0.38) 60%, rgba(38,47,148,0.6) 85%, rgba(35,44,140,0.72) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 38,
            paddingBottom: 28,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            TRUSTED BY
          </div>
          {trustedLogos.map((l) => (
            <img
              key={l.src}
              src={l.src}
              alt=""
              width={l.width}
              height={l.height}
              style={{ opacity: 0.9 }}
            />
          ))}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interLight,
          style: "normal",
          weight: 400,
        },
        {
          name: "Inter",
          data: interSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
