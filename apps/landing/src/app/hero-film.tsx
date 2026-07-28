"use client";

import { PlaceholderAvatar } from "@/components/placeholder-avatar";
import { useEffect, useRef, useState } from "react";

/**
 * Hero film — a cursor builds a revenue system, then the system runs.
 *
 * This is a DOM animation, not a video. It replaced a baked MP4 for one
 * reason: the video had to carry its own backdrop, and that backdrop had to
 * match the hero's gradient at whatever position the film happened to sit —
 * which changed with the panel's height AND the film's width, and so had to
 * be re-derived by hand every time the hero layout moved. Rendering the scene
 * as elements makes the background simply transparent, and the whole class of
 * problem disappears. It also buys crisp text at any size, the site's own
 * typeface, and ~1.4MB less above the fold.
 *
 * The scene is authored in a fixed 1200x500 coordinate space and scaled to fit
 * by `.hero-scene` (container query units), so every position below is a plain
 * number in that space and nothing needs to be responsive.
 */

// ---------------------------------------------------------------------------
// Timing — frames at 30fps, matching the composition this was ported from
// (closed/assets/remotion/src/HeroFilm.tsx), which is still used for social.
// ---------------------------------------------------------------------------

const FPS = 30;
const DURATION = 800;

const T = {
  cursorIn: [10, 40],
  click1: 46,
  btnOut: [52, 66],

  cursorPark: [54, 76],
  promptIn: [58, 78],
  typeStart: 84,
  cursorToSend: [174, 198],
  click2: 206,
  promptOut: [216, 232],

  sheetIn: [222, 242],
  popIn: [388, 406],
  popOut: [500, 514],
  sheetOut: [506, 524],

  slackIn: [516, 536],
  morph: 566,
  slackOut: [636, 652],

  scheduleIn: [644, 664],
  scheduleOut: [756, 772],

  btnBack: [756, 776],
} as const;

const PROMPT =
  "Every Monday, find companies hiring SDRs in DACH, get the VP of Sales, verify their work email, and route them to a rep.";
const CPS = 1.45;

/** Frame the still (reduced-motion) state rests on: sheet full, waterfall open. */
const STILL_FRAME = 470;

const C = {
  card: "#ffffff",
  ink: "#1C2333",
  muted: "#5B6478",
  faint: "#98A1B5",
  line: "#E4E8F0",
  lineSoft: "#EFF2F7",
  accent: "#3B49E0",
  green: "#1B7A52",
  greenSoft: "#E6F4ED",
};

const SHADOW = "0 30px 70px rgba(18,24,74,0.26), 0 4px 14px rgba(18,24,74,0.12)";

// ---------------------------------------------------------------------------
// Motion helpers
// ---------------------------------------------------------------------------

/** Strong ease-out, standing in for the composition's bezier(0.22,1,0.36,1). */
const ease = (t: number) => 1 - Math.pow(1 - t, 4);

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

const prog = (frame: number, start: number, dur: number) =>
  ease(clamp01((frame - start) / dur));

const between = (frame: number, r: readonly [number, number]) =>
  prog(frame, r[0], r[1] - r[0]);

const fadeIn = (frame: number, start: number, dur = 16) =>
  prog(frame, start, dur);

const typed = (text: string, frame: number, start: number, cps = CPS) =>
  text.slice(0, Math.max(0, Math.floor((frame - start) * cps)));

/** Fade in over `inR`, hold, fade out over `outR`, with a small settle. */
const scene = (
  frame: number,
  inR: readonly [number, number],
  outR: readonly [number, number],
) => {
  const t = between(frame, inR);
  return {
    opacity: Math.min(t, 1 - between(frame, outR)),
    transform: `scale(${0.985 + t * 0.015})`,
  };
};

// ---------------------------------------------------------------------------
// The clock
// ---------------------------------------------------------------------------

function useFilmFrame(host: React.RefObject<HTMLDivElement | null>) {
  const [frame, setFrame] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    // Read after mount, not during render: matchMedia does not exist on the
    // server and branching on it in the render pass would break hydration.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStill(true);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFrame(STILL_FRAME);
      return;
    }

    const el = host.current;
    if (!el) return;

    let raf = 0;
    let start = 0;
    let visible = false;

    const tick = (now: number) => {
      if (!start) start = now;
      setFrame((((now - start) / 1000) * FPS) % DURATION);
      raf = requestAnimationFrame(tick);
    };

    // Only run while on screen — an off-screen rAF loop still costs a frame
    // of layout and paint on every tick.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === visible) return;
        visible = entry.isIntersecting;
        if (visible) {
          start = 0;
          raf = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [host]);

  return { frame, still };
}

/** Keep --hero-scale equal to renderedWidth / 1200 so the fixed-size scene
    fits its column. See the note on .hero-scene-inner for why this is not
    done in pure CSS. */
function useSceneScale(host: React.RefObject<HTMLDivElement | null>) {
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

// ---------------------------------------------------------------------------
// Scene data
// ---------------------------------------------------------------------------

const ROWS = [
  { company: "Northbeam", vp: "Jonas Weber", email: "j.weber@northbeam.de", mobile: "+49 170 4412 093" },
  { company: "Helio Labs", vp: "Lena Brandt", email: "lena.brandt@heliolabs.de", mobile: "+49 151 2280 774" },
  { company: "Quartzline", vp: "Marc Aebischer", email: "m.aebischer@quartzline.ch", mobile: "+41 79 508 3311" },
  { company: "Tidewater", vp: "Sophie Hofer", email: "s.hofer@tidewater.at", mobile: "+43 664 1930 552" },
  { company: "Polarcraft", vp: "Tobias Krüger", email: "t.krueger@polarcraft.de", mobile: "+49 172 6650 118" },
  { company: "Aurelio", vp: "Nina Falk", email: "n.falk@aurelio.io", mobile: "+49 160 2247 806" },
  { company: "Kestrel", vp: "Paul Vermeer", email: "p.vermeer@kestrel.nl", mobile: "+31 6 2841 7730" },
];

/* The sheet, reduced to what actually tells the story: a band saying which
   columns came from where, and headers carrying each field's label over its
   key — the one detail that makes this read as pipe0 and not a generic table.
   The toolbar, selection column and copy affordances are all real, and all
   left out: at this size they were noise. */
/* Provider marks mirror `providerCatalog` in packages/base (logoUrl +
   background.light). Inlined rather than imported so the homepage's client
   bundle does not pull in the whole catalog for two icons. */
const PROVIDERS = {
  amplemarket: {
    label: "Amplemarket",
    logo: "https://imagedelivery.net/3B3AWuP94-S3Ro5eEac6JA/adecf16b-4187-409b-d77f-16fc07fc6100/icon",
    bg: "#EAEDF8",
  },
  prospeo: {
    label: "Prospeo",
    logo: "https://imagedelivery.net/3B3AWuP94-S3Ro5eEac6JA/95032a9f-932b-4898-ff0d-45d49390d100/icon",
    bg: "#EAECF8",
  },
};

/* Traced from a real pipe0 sheet: each pipe is a tab across the top carrying
   its provider mark and a run control, with the field key — not a prose label
   — on the row beneath it. The first tab is the input column and reads as
   selected. A "+ New empty row" foot closes the table. */
const SHEET = { x: 80, y: 68, w: 1040, tabH: 38, fieldH: 34, rowH: 38, footH: 36 };
const SEL_W = 36;
const FIELDS = [
  { tab: "Input", key: "company_name", w: 236, input: true },
  { tab: "VP of Sales", key: "full_name", w: 226, provider: PROVIDERS.amplemarket },
  { tab: "Work Email", key: "work_email", w: 300, provider: PROVIDERS.prospeo },
  { tab: "Mobile Number", key: "mobile_number", w: 242, provider: PROVIDERS.amplemarket },
];
const COLS = FIELDS.map((f) => f.w);
const colX = (i: number) => COLS.slice(0, i).reduce((a, b) => a + b, 0);

const VP_AT = (i: number) => 256 + i * 8;
const EMAIL_AT = (i: number) => 296 + i * 9;
const MOBILE_AT = (i: number) => 340 + i * 9;


const CURSOR_START = { x: 1020, y: 470 };
const BTN_HIT = { x: 646, y: 262 };
const PARK = { x: 830, y: 404 };
const SEND_HIT = { x: 986, y: 306 };

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function Cell({
  frame,
  at,
  value,
  figures,
}: {
  frame: number;
  at: number;
  value: string;
  figures?: boolean;
}) {
  const done = frame >= at;
  if (!done) {
    const working = frame >= at - 12;
    return (
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {working && (
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              border: `2px solid ${C.line}`,
              borderTopColor: C.accent,
              transform: `rotate(${frame * 16}deg)`,
            }}
          />
        )}
        <span
          style={{
            height: 9,
            width: working ? 70 : 92,
            borderRadius: 6,
            background: C.lineSoft,
          }}
        />
      </span>
    );
  }
  const flash = Math.max(0, 1 - (frame - at) / 16);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 7,
        padding: "5px 8px",
        margin: "-5px -8px",
        background: `rgba(230,244,237,${flash})`,
        fontSize: 14.5,
        fontVariantNumeric: figures ? "tabular-nums" : "normal",
        color: C.ink,
        opacity: fadeIn(frame, at, 6),
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </span>
  );
}

/** The "T" glyph the product uses to mark a text field. */
function TypeIcon() {
  return (
    <span style={{ fontSize: 13, color: C.faint, fontWeight: 500, width: 11 }}>T</span>
  );
}

function RunDot() {
  return (
    <span
      style={{
        width: 17,
        height: 17,
        borderRadius: "50%",
        border: `1px solid ${C.line}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={7} height={7} viewBox="0 0 8 8" aria-hidden>
        <path d="M2 1l4.5 3L2 7z" fill={C.muted} />
      </svg>
    </span>
  );
}

function Sheet({ frame }: { frame: number }) {
  const grid = `${SEL_W}px ${COLS.map((c) => `${c}px`).join(" ")}`;
  return (
    <div
      style={{
        position: "absolute",
        left: SHEET.x,
        top: SHEET.y,
        width: SHEET.w,
        /* One shadow for the whole silhouette, tabs included. A box-shadow on
           each part would trace two rectangles and give away that the tabs are
           separate; drop-shadow follows the actual outline, which is what
           makes the folder read as one moulded object. */
        filter: "drop-shadow(0 18px 34px rgba(18,24,74,0.22)) drop-shadow(0 3px 8px rgba(18,24,74,0.10))",
      }}
    >
      {/* A frosted tray the folder sits in. Only visible in the gaps between
          the tabs and as a lip around the edges, but that is enough to read as
          an enclosure rather than tabs floating loose on the panel. It is also
          the outermost shape, so the wrapper's drop-shadow now traces the tray
          instead of the folder's stepped outline. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          /* Tight to the folder — a wide lip read as a second card rather
             than an enclosure. */
          inset: -6,
          borderRadius: 14,
          /* Darker than the panel, not lighter. A white tint on an already
             light-blue background has almost nothing to contrast against; a
             muted indigo recedes and lets the white folder sit *in* it. */
          background: "rgba(22,28,74,0.24)",
          border: "1px solid rgba(255,255,255,0.14)",
          backdropFilter: "blur(16px) saturate(120%)",
          WebkitBackdropFilter: "blur(16px) saturate(120%)",
        }}
      />

      {/* Folder tabs. The row itself is transparent — the tray's frost shows
          between the tabs and to the right of the last one, exactly as the
          app's own background does. */}
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: grid,
          height: SHEET.tabH,
        }}
      >
        <span />
        {FIELDS.map((f) => (
          <span
            key={f.key}
            style={{
              justifySelf: "start",
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: "100%",
              padding: "0 14px",
              background: C.card,
              borderRadius: "9px 9px 0 0",
              fontSize: 14.5,
              fontWeight: 500,
              color: C.ink,
              whiteSpace: "nowrap",
            }}
          >
            {f.provider && (
              <span
                style={{
                  width: 17,
                  height: 17,
                  borderRadius: 4,
                  background: f.provider.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.provider.logo} alt="" width={10} height={10} aria-hidden />
              </span>
            )}
            {f.tab}
            {!f.input && <RunDot />}
          </span>
        ))}
      </div>

      {/* Body */}
      <div
        style={{
          position: "relative",
          background: C.card,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: grid,
            height: SHEET.fieldH,
            borderBottom: `1px solid ${C.line}`,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M2 8.5L6 12L14 4" stroke={C.faint} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {FIELDS.map((f, i) => (
            <span
              key={f.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "0 14px",
                borderLeft: i === 0 ? "none" : `1px solid ${C.lineSoft}`,
                fontSize: 14,
                color: C.faint,
              }}
            >
              <TypeIcon />
              {f.key}
            </span>
          ))}
        </div>

        {ROWS.map((row, i) => (
          <div
            key={row.company}
            style={{
              display: "grid",
              gridTemplateColumns: grid,
              height: SHEET.rowH,
              borderBottom: `1px solid ${C.lineSoft}`,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: 3,
                  border: `1.4px solid ${C.line}`,
                }}
              />
            </span>
            {[
              <span key="c" style={{ fontSize: 14.5, color: C.ink }}>{row.company}</span>,
              <Cell key="v" frame={frame} at={VP_AT(i)} value={row.vp} />,
              <Cell key="e" frame={frame} at={EMAIL_AT(i)} value={row.email} figures />,
              <Cell key="m" frame={frame} at={MOBILE_AT(i)} value={row.mobile} figures />,
            ].map((child, j) => (
              <span
                key={j}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 14px",
                  borderLeft: j === 0 ? "none" : `1px solid ${C.lineSoft}`,
                  overflow: "hidden",
                }}
              >
                {child}
              </span>
            ))}
          </div>
        ))}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            height: SHEET.footH,
            padding: "0 14px",
            fontSize: 14,
            color: C.muted,
          }}
        >
          <span style={{ fontSize: 15 }}>+</span> New empty row
        </div>
      </div>
    </div>
  );
}

function Waterfall({ frame }: { frame: number }) {
  const t = Math.min(between(frame, T.popIn), 1 - between(frame, T.popOut));
  if (t <= 0.002) return null;
  const steps = [
    { p: PROVIDERS.amplemarket, ok: false, value: "No result" },
    { p: PROVIDERS.prospeo, ok: true, value: "+41 79 508 3311" },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: SHEET.x + SEL_W + colX(3) - 170,
        top: SHEET.y + SHEET.tabH + SHEET.fieldH + SHEET.rowH * 4 - 8,
        width: 404,
        background: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: 14,
        boxShadow: "0 22px 50px rgba(18,24,74,0.34)",
        padding: "16px 18px",
        opacity: t,
        transform: `translateY(${(1 - t) * 10}px)`,
        zIndex: 20,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          color: C.faint,
          marginBottom: 12,
        }}
      >
        Waterfall · mobile number
      </div>
      {steps.map((s, i) => (
        <div
          key={s.p.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            paddingTop: i === 0 ? 0 : 12,
            opacity: fadeIn(frame, T.popIn[0] + 8 + i * 12, 10),
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              flexShrink: 0,
              borderRadius: 8,
              background: s.p.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: s.ok ? 1 : 0.55,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.p.logo} alt="" width={17} height={17} aria-hidden />
          </span>
          <span style={{ flex: 1, fontSize: 17, color: s.ok ? C.ink : C.muted }}>
            {s.p.label}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 16,
              fontVariantNumeric: "tabular-nums",
              color: s.ok ? C.green : C.faint,
            }}
          >
            {s.ok && <Check />}
            {s.value}
          </span>
        </div>
      ))}
      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: `1px solid ${C.lineSoft}`,
          fontSize: 15,
          color: C.muted,
          opacity: fadeIn(frame, T.popIn[0] + 34, 12),
        }}
      >
        Only the provider that answered is billed.
      </div>
    </div>
  );
}

function Check({ size = 15, color = C.green }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8.5L6.5 12L13 4.5"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Slack({ frame }: { frame: number }) {
  const answered = frame >= T.morph;
  const S = { text: "#1D1C1D", meta: "#616061", link: "#1264A3", mention: "#E8F2FB" };
  return (
    <div
      style={{
        position: "absolute",
        left: 130,
        top: "50%",
        transform: "translateY(-50%)",
        width: 940,
        background: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: 18,
        boxShadow: SHADOW,
        padding: "30px 34px",
      }}
    >
      <div style={{ display: "flex", gap: 16 }}>
        <PlaceholderAvatar size={44} radius={10} />
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 5 }}>
            <span style={{ fontSize: 19, fontWeight: 700, color: S.text }}>Florian</span>
            <span style={{ fontSize: 15, color: S.meta }}>9:04</span>
          </div>
          <div style={{ fontSize: 20, lineHeight: 1.5, color: S.text }}>
            <span
              style={{
                background: S.mention,
                color: S.link,
                borderRadius: 4,
                padding: "1px 5px",
                fontWeight: 600,
              }}
            >
              @pipe0
            </span>{" "}
            who from #customers works in engineering? Get their work emails.
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 26 }}>
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            flexShrink: 0,
            background: C.card,
            border: `1px solid ${C.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-small-light.svg" alt="" width={26} height={10} aria-hidden />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
            <span style={{ fontSize: 19, fontWeight: 700, color: S.text }}>pipe0</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.04em",
                color: S.meta,
                background: "#EFF2F7",
                borderRadius: 3,
                padding: "2px 5px",
              }}
            >
              APP
            </span>
          </div>
          {answered ? (
            <div style={{ opacity: fadeIn(frame, T.morph, 10) }}>
              <div style={{ fontSize: 20, lineHeight: 1.5, color: S.text }}>
                Found <strong>12 people</strong> in #customers with engineering
                titles — 11 work emails verified.
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 18,
                  color: S.link,
                  opacity: fadeIn(frame, T.morph + 8, 10),
                }}
              >
                Continue in pipe0: #customers · engineering
              </div>
            </div>
          ) : (
            <div
              style={{
                fontSize: 20,
                color: S.meta,
                opacity: fadeIn(frame, T.slackIn[0] + 18, 8),
              }}
            >
              ⏳ On it…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Schedule({ frame }: { frame: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          background: C.card,
          border: `1px solid ${C.line}`,
          borderRadius: 16,
          boxShadow: "0 22px 50px rgba(18,24,74,0.26)",
          padding: "22px 30px",
        }}
      >
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: C.greenSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Check size={19} />
        </span>
        <div>
          <div style={{ fontSize: 23, fontWeight: 600, color: C.ink }}>
            Runs every Monday, 08:00
          </div>
          <div style={{ marginTop: 5, fontSize: 18, color: C.muted }}>
            1,204 companies · 312 new contacts · 3 reps notified
          </div>
        </div>
      </div>
      {/* A chip rather than bare text: this is the only line that sits on the
          page's background instead of on a card, and the background is not
          ours to assume any more. */}
      <div
        style={{
          fontSize: 17,
          color: C.ink,
          background: "rgba(255,255,255,0.72)",
          borderRadius: 999,
          padding: "7px 16px",
          opacity: fadeIn(frame, T.scheduleIn[0] + 20, 14),
        }}
      >
        Your revenue system is live.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

export function HeroFilm() {
  const host = useRef<HTMLDivElement>(null);
  const { frame, still } = useFilmFrame(host);
  useSceneScale(host);

  const btnOpacity = still
    ? 0
    : Math.max(1 - between(frame, T.btnOut), between(frame, T.btnBack));
  const promptT = between(frame, T.promptIn);
  const promptOpacity = Math.min(promptT, 1 - between(frame, T.promptOut));
  const shown = typed(PROMPT, frame, T.typeStart);
  const typing = frame >= T.typeStart && shown.length < PROMPT.length;

  const l1 = between(frame, T.cursorIn);
  const l2 = between(frame, T.cursorPark);
  const l3 = between(frame, T.cursorToSend);
  const cx =
    CURSOR_START.x +
    (BTN_HIT.x - CURSOR_START.x) * l1 +
    (PARK.x - BTN_HIT.x) * l2 +
    (SEND_HIT.x - PARK.x) * l3;
  const cy =
    CURSOR_START.y +
    (BTN_HIT.y - CURSOR_START.y) * l1 +
    (PARK.y - BTN_HIT.y) * l2 +
    (SEND_HIT.y - PARK.y) * l3;
  const cursorOpacity = still
    ? 0
    : Math.min(fadeIn(frame, T.cursorIn[0], 8), 1 - fadeIn(frame, T.click2 + 6, 10));

  return (
    <div
      ref={host}
      className="hero-scene mx-auto w-full min-w-0 max-w-[1200px]"
      role="img"
      aria-label="Building a revenue system in pipe0: a prompt becomes an enriched list, a waterfall finds a phone number the first provider missed, a rep asks the same engine a question in Slack, and the whole thing settles into a weekly schedule."
    >
      <div className="hero-scene-inner">
        <div style={{ position: "absolute", inset: 0 }}>
        {/* Beat 1 — the button */}
        <div
          className="p0-glass"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            gap: 14,
            height: 62,
            padding: "0 32px",
            borderRadius: 999,
            opacity: btnOpacity,
            whiteSpace: "nowrap",
          }}
        >
          <svg width={20} height={24} viewBox="0 0 12 16" fill="none" aria-hidden>
            <path d="M7 0.5 L1 9 H5.4 L4.6 15.5 L11 7 H6.4 Z" fill={C.accent} />
          </svg>
          <span style={{ fontSize: 24, fontWeight: 600, color: C.ink }}>
            Create revenue system
          </span>
        </div>

        {/* Beat 2 — the prompt */}
        <div
          className="p0-composer"
          style={{
            position: "absolute",
            left: 160,
            top: 142,
            width: 880,
            height: 216,
            borderRadius: 20,
            padding: "30px 34px",
            display: "flex",
            flexDirection: "column",
            opacity: still ? 0 : promptOpacity,
            transform: `translateY(${(1 - promptT) * 14}px)`,
          }}
        >
          <div
            style={{
              flex: 1,
              fontSize: 27,
              lineHeight: 1.45,
              color: shown ? (frame >= T.click2 ? C.muted : C.ink) : C.faint,
            }}
          >
            {shown || "Describe the revenue system you want to build…"}
            {typing && (
              <span
                style={{
                  display: "inline-block",
                  width: 2.5,
                  height: 28,
                  background: C.ink,
                  marginLeft: 3,
                  verticalAlign: -4,
                  opacity: frame % FPS < FPS / 2 ? 1 : 0,
                }}
              />
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 28, color: C.faint, lineHeight: 1 }}>+</span>
            <span
              className="p0-primary-glass"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 0 ${
                  (frame >= T.click2 ? 1 - between(frame, [T.click2, T.click2 + 10]) : 0) * 14
                }px rgba(59,73,224,0.18)`,
              }}
            >
              <svg width={21} height={21} viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M5 12h13M13 6l6 6-6 6"
                  stroke="#fff"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* Beat 3 — the sheet, and the waterfall over it */}
        <div style={{ position: "absolute", inset: 0, ...scene(frame, T.sheetIn, T.sheetOut) }}>
          <Sheet frame={frame} />
          <Waterfall frame={frame} />
        </div>

        {/* Beat 4 — Slack */}
        <div style={{ position: "absolute", inset: 0, ...scene(frame, T.slackIn, T.slackOut) }}>
          <Slack frame={frame} />
        </div>

        {/* Beat 5 — the schedule */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            ...scene(frame, T.scheduleIn, T.scheduleOut),
          }}
        >
          <Schedule frame={frame} />
        </div>

        {/* Pointer */}
        {cursorOpacity > 0.002 && (
          <svg
            width={22}
            height={30}
            viewBox="0 0 12 19"
            aria-hidden
            style={{
              position: "absolute",
              left: cx,
              top: cy,
              opacity: cursorOpacity,
              zIndex: 40,
              filter: "drop-shadow(0 2px 4px rgba(18,24,74,0.35))",
            }}
          >
            <path
              d="M0.5 0.5 L0.5 15 L4 11.8 L6.4 17.5 L8.9 16.4 L6.5 10.9 L11 10.9 Z"
              fill="#fff"
              stroke={C.ink}
              strokeWidth={1}
            />
          </svg>
        )}
        {[
          { at: T.click1, p: BTN_HIT },
          { at: T.click2, p: SEND_HIT },
        ].map(({ at, p }) => {
          const t = between(frame, [at, at + 14]);
          if (still || t <= 0 || t >= 1) return null;
          const d = 14 + t * 30;
          return (
            <span
              key={at}
              aria-hidden
              style={{
                position: "absolute",
                left: p.x - d / 2 + 4,
                top: p.y - d / 2 + 4,
                width: d,
                height: d,
                borderRadius: "50%",
                border: `2.5px solid ${C.accent}`,
                opacity: 1 - t,
                zIndex: 39,
              }}
            />
          );
        })}
        </div>
      </div>
    </div>
  );
}
