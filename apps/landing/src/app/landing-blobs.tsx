/* Little animated "bots" — blobby characters with two tick-mark eyes that
   bob, wobble and blink in place. Decorative only (always aria-hidden); the
   copy around them carries the meaning.

   Each one is a plain inline SVG sized in `em`, so it sits in running text at
   whatever size the text is. All motion is CSS (see "Blobs" in globals.css)
   and is switched off under prefers-reduced-motion. */

export type BlobKind =
  | "round"
  | "bulb"
  | "clover"
  | "triangle"
  | "diamond"
  | "cluster"
  | "rainbow";

export type BlobTone =
  | "indigo"
  | "sky"
  | "green"
  | "amber"
  | "coral"
  | "navy"
  | "violet"
  | "paper";

/* Kept inside the app's palette: indigo is `--primary`, sky/green are the
   hero film's accents, navy the ink; amber and coral echo `--chart-4` and
   `--chart-1`. Saturated enough to read on both the light and dark ground. */
const TONES: Record<BlobTone, string> = {
  indigo: "#3B49E0",
  sky: "#3A86DD",
  green: "#2E9C74",
  amber: "#E2AE3F",
  coral: "#E56D4C",
  navy: "#2B3350",
  violet: "#7A5CF0",
  /* Near-white body for bots that sit on a dark indigo ground (the hero
     pills); pair it with an indigo `ink` so the eyes still read. */
  paper: "#F4F6FF",
};

/* Two short slanted ticks. The `eyes` group is what blinks. */
function Eyes({
  x = 50,
  y = 50,
  tilt = -12,
  ink = "#fff",
}: {
  x?: number;
  y?: number;
  tilt?: number;
  ink?: string;
}) {
  return (
    /* Position on the outer group, blink on the inner one: a CSS transform
       animation replaces an element's own `transform` attribute, so the two
       must not share an element. */
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <g
        className="blob-eyes"
        stroke={ink}
        strokeWidth={7}
        strokeLinecap="round"
        opacity={0.95}
      >
        <line x1={-11} y1={-6} x2={-11} y2={6} />
        <line x1={11} y1={-6} x2={11} y2={6} />
      </g>
    </g>
  );
}

function Body({
  kind,
  tone,
  ink,
}: {
  kind: BlobKind;
  tone: BlobTone;
  ink: string;
}) {
  const fill = TONES[tone];
  switch (kind) {
    case "round":
      return (
        <>
          <circle cx={50} cy={50} r={44} fill={fill} />
          <Eyes ink={ink} />
        </>
      );
    case "bulb":
      return (
        <>
          <path
            d="M10 84 Q10 98 24 98 H76 Q90 98 90 84 V46 A40 40 0 0 0 10 46 Z"
            fill={fill}
          />
          {/* Cheek highlight, bottom-left. */}
          <ellipse cx={30} cy={82} rx={11} ry={7} fill={ink} opacity={0.42} />
          <Eyes y={48} tilt={-10} ink={ink} />
        </>
      );
    case "clover":
      return (
        <>
          <g fill={fill}>
            <circle cx={33} cy={33} r={27} />
            <circle cx={67} cy={33} r={27} />
            <circle cx={33} cy={67} r={27} />
            <circle cx={67} cy={67} r={27} />
            <rect x={28} y={28} width={44} height={44} />
          </g>
          <ellipse cx={30} cy={78} rx={10} ry={6} fill={ink} opacity={0.42} />
          <Eyes y={46} tilt={8} ink={ink} />
        </>
      );
    case "triangle":
      return (
        <>
          {/* A fat round-joined stroke on a smaller triangle gives the soft
              corners without hand-rolling curves. */}
          <polygon
            points="50,20 84,82 16,82"
            fill={fill}
            stroke={fill}
            strokeWidth={16}
            strokeLinejoin="round"
          />
          {/* Notification dot — "someone answered". */}
          <circle cx={86} cy={22} r={10} fill={TONES.coral} />
          <Eyes y={60} tilt={-14} ink={ink} />
        </>
      );
    case "diamond":
      return (
        <>
          <rect
            x={15}
            y={15}
            width={70}
            height={70}
            rx={24}
            fill={fill}
            transform="rotate(45 50 50)"
          />
          <Eyes tilt={-22} ink={ink} />
        </>
      );
    case "cluster":
      return (
        <>
          <circle cx={62} cy={36} r={23} fill={TONES.green} />
          <circle cx={34} cy={60} r={25} fill={TONES.sky} />
          <circle cx={66} cy={66} r={25} fill={TONES.indigo} />
          <Eyes x={66} y={68} tilt={-10} ink={ink} />
        </>
      );
    case "rainbow":
      return (
        <>
          <circle cx={50} cy={50} r={44} fill={fill} />
          {/* Three ribbons across the crown, in the app's own colours. */}
          <g
            fill="none"
            strokeWidth={7}
            strokeLinecap="round"
            transform="rotate(-24 50 50)"
          >
            <path d="M24 34 Q50 14 76 34" stroke={TONES.indigo} />
            <path d="M27 42 Q50 24 73 42" stroke={TONES.green} />
            <path d="M31 50 Q50 34 69 50" stroke={TONES.coral} />
          </g>
          <Eyes y={62} tilt={-8} ink={ink} />
        </>
      );
  }
}

export function Blob({
  kind,
  tone = "indigo",
  className = "",
  /* Stagger so a row of them never moves in lockstep. Seconds. */
  delay = 0,
  /* Height in em of the surrounding text. */
  size = 1,
  /* Eye (and cheek highlight) colour. White on the saturated tones; set
     to an indigo when the body itself is light (`tone="paper"`). */
  ink = "#fff",
}: {
  kind: BlobKind;
  tone?: BlobTone;
  className?: string;
  delay?: number;
  size?: number;
  ink?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      focusable="false"
      className={`blob inline-block shrink-0 ${className}`}
      style={
        {
          height: `${size}em`,
          width: `${size}em`,
          "--blob-delay": `${delay}s`,
        } as React.CSSProperties
      }
    >
      <Body kind={kind} tone={tone} ink={ink} />
    </svg>
  );
}

/* A word set in a small glossy indigo pill with a bot on its left. The pill
   is a miniature of the hero panel below it — the same top-of-sky gradient,
   the same darker-than-fill border and the same one-pixel highlight along
   the top edge (see `.bot-pill` in globals.css) — so the two read as one
   material. White type on the indigo keeps contrast in both themes, and the
   bot is set in a near-white body with indigo eyes so it stands off the
   ground instead of sinking into it. The text inside is the same size as
   the text around it, so the pill reads as part of the sentence, not a tag
   stuck on it. `align-middle` centres the pill on the surrounding x-height;
   the tiny nudge lines the two baselines up. */
export function BotPill({
  kind,
  delay = 0,
  children,
}: {
  kind: BlobKind;
  delay?: number;
  children: string;
}) {
  return (
    <span className="bot-pill inline-flex translate-y-[-0.04em] items-center gap-[0.28em] rounded-full pl-[0.3em] pr-[0.55em] py-[0.06em] align-middle leading-none whitespace-nowrap">
      <Blob kind={kind} tone="paper" ink="#2c37a4" size={1.05} delay={delay} />
      <span>{children}</span>
    </span>
  );
}
