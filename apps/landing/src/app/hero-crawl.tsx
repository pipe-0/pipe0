"use client";

import { PlaceholderAvatar } from "@/components/placeholder-avatar";
import { useEffect, useRef, useState } from "react";

/**
 * Hero crawl — a pipe0 sheet lying back into the distance like an opening
 * crawl, drifting slowly away. At the near edge a new row is always being
 * built: its cells fly in and click into place, the input first, the
 * enriched columns after. All the busy motion is at the bottom; the far end
 * barely moves, because perspective compresses it.
 *
 * DOM, not video: the cells carry real text, and slowly drifting fine text is
 * what video codecs smear worst. The scene is transparent, so it sits on the
 * hero sky as it is.
 *
 * Authored in a fixed 1320x574 space (the panel's 2.3 ratio) and scaled to
 * fit, like the hero film. One rAF writes one transform per frame (the
 * track); a row is mounted once per period and its cells animate in CSS
 * (`crawl-land` in globals.css). Everything on the sheet is flat, drawn
 * onto the one tilted plane: cells "lift" with scale and shadow, never with
 * real depth, which z-fought with the plane and dropped landed cells.
 */

const W = 1320;
const H = 574;

/** Seconds per row: how long the near edge takes to build one. */
const PERIOD = 2.8;
/** Row pitch on the plane, px. */
const PITCH = 58;
/** Rows kept mounted: enough to run past the fade at the far end. */
const KEEP = 15;
/** Rows already there on arrival, so the page opens on a full sheet. */
const START = KEEP - 2;

const C = {
  ink: "#1C2333",
  muted: "#5B6478",
  faint: "#98A1B5",
  line: "#E4E8F0",
  lineSoft: "#EFF2F7",
};

const LOGO = "https://imagedelivery.net/3B3AWuP94-S3Ro5eEac6JA";
const P = {
  leadmagic: `${LOGO}/508cb23a-47d4-40ee-1645-b5a8bf994c00/icon`,
  findymail: `${LOGO}/9e8ce38d-a49d-42a3-4317-506f7fbec900/icon`,
  prospeo: `${LOGO}/95032a9f-932b-4898-ff0d-45d49390d100/icon`,
  icypeas: `${LOGO}/d635119e-08ae-40cb-78bc-34161d422400/icon`,
  hunter: `${LOGO}/a612ed1c-d5cf-421a-23c5-3cf74f506100/icon`,
};

type Person = {
  name: string;
  domain: string;
  tile: string;
  title: string;
  /** Providers asked in order; the last one answered unless `miss`. */
  tried: string[];
  miss?: boolean;
};

const PEOPLE: Person[] = [
  { name: "Lucia Ferraro", domain: "fernhill.com", tile: "#7C5CE0", title: "Head of Growth", tried: [P.leadmagic] },
  { name: "Noah Becker", domain: "oakridge.so", tile: "#C2418F", title: "VP, Growth", tried: [P.findymail, P.prospeo] },
  { name: "Grace Liu", domain: "vireo.app", tile: "#6A4FD8", title: "VP of Growth & Data", tried: [P.leadmagic, P.findymail, P.icypeas], miss: true },
  { name: "Tom Hughes", domain: "castellan.io", tile: "#2F9E6A", title: "VP Growth", tried: [P.leadmagic, P.findymail, P.hunter] },
  { name: "Maya Lindqvist", domain: "heliolabs.com", tile: "#B8613A", title: "VP of Growth", tried: [P.leadmagic, P.prospeo] },
  { name: "Jonas Weber", domain: "northbeam.io", tile: "#8E44C9", title: "VP, Growth Marketing", tried: [P.findymail] },
  { name: "Priya Nair", domain: "quartzline.ai", tile: "#6FA43A", title: "Head of Growth", tried: [P.leadmagic, P.findymail, P.icypeas], miss: true },
  { name: "Elena Sorensen", domain: "tidewater.co", tile: "#2C7FB8", title: "Director of RevOps", tried: [P.prospeo] },
  { name: "Marc Aebischer", domain: "polarcraft.ch", tile: "#D14B4B", title: "VP of Sales", tried: [P.leadmagic, P.hunter] },
  { name: "Sofia Marino", domain: "aurelio.io", tile: "#3B49E0", title: "Head of Demand Gen", tried: [P.icypeas] },
  { name: "Daniel Okafor", domain: "kestrel.dev", tile: "#1F8A8A", title: "VP, Revenue", tried: [P.findymail, P.prospeo] },
  { name: "Hannah Roth", domain: "brightloop.de", tile: "#C98A1B", title: "Head of Growth", tried: [P.leadmagic] },
  { name: "Ivan Petrov", domain: "stackwise.io", tile: "#5965D6", title: "VP of Marketing", tried: [P.leadmagic, P.findymail] },
  { name: "Chloe Martin", domain: "lumen.so", tile: "#A64AC9", title: "Growth Lead", tried: [P.prospeo, P.icypeas] },
  { name: "Ravi Shah", domain: "orbitly.com", tile: "#3A9E5F", title: "VP, Growth", tried: [P.leadmagic, P.findymail, P.hunter], miss: true },
  { name: "Anna Kowalski", domain: "meridian.app", tile: "#D0603A", title: "Head of Lifecycle", tried: [P.findymail] },
  { name: "Leo Fischer", domain: "sundial.ai", tile: "#4A6FE0", title: "VP of Growth", tried: [P.leadmagic, P.prospeo] },
];

const local = (p: Person) =>
  p.name.toLowerCase().split(" ")[0] + "@" + p.domain;

// Columns on the plane, px: row number, name, company_domain, job_title,
// work_email. The input is the name; the rest is enrichment.
const COLS = [64, 260, 236, 268, 332];
const PLANE_W = COLS.reduce((a, b) => a + b, 0);
const GRID = COLS.map((c) => `${c}px`).join(" ");

// ---------------------------------------------------------------------------

function useScale(host: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const apply = () =>
      el.style.setProperty("--crawl-scale", String(el.clientWidth / W));
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [host]);
}

/** Newest row number, and the track ref the clock moves every frame. */
function useCrawl(host: React.RefObject<HTMLDivElement | null>) {
  const track = useRef<HTMLDivElement>(null);
  const [head, setHead] = useState(START);

  useEffect(() => {
    const el = host.current;
    const tr = track.current;
    if (!el || !tr) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Seconds of crawl so far. Row n reaches the near edge at n * PERIOD.
    let clock = START * PERIOD;
    let last = 0;
    let raf = 0;
    let visible = false;
    let shown = START;

    const tick = (now: number) => {
      // Capped step: a background tab resumes, it does not jump.
      if (last) clock += Math.min(0.05, (now - last) / 1000);
      last = now;
      tr.style.transform = `translate3d(0, ${(-clock / PERIOD) * PITCH}px, 0)`;
      const n = Math.floor(clock / PERIOD) + 1;
      if (n !== shown) {
        shown = n;
        setHead(n);
      }
      raf = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      if (visible && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      cancelAnimationFrame(raf);
    };
  }, [host]);

  return { track, head };
}

// ---------------------------------------------------------------------------

function Provider({ src, faded }: { src: string; faded?: boolean }) {
  return (
    <span
      style={{
        width: 22,
        height: 22,
        marginLeft: -6,
        borderRadius: "50%",
        background: "#fff",
        boxShadow: `0 0 0 1.5px #fff, inset 0 0 0 1px ${C.line}`,
        display: "grid",
        placeItems: "center",
        opacity: faded ? 0.45 : 1,
        flexShrink: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={13} height={13} loading="lazy" />
    </span>
  );
}

/** One cell's contents. `fresh` cells fly in, staggered by `order`. */
function Cell({
  order,
  fresh,
  children,
}: {
  order: number;
  fresh: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={fresh ? "crawl-cell crawl-land" : "crawl-cell"}
      style={fresh ? ({ "--crawl-i": order } as React.CSSProperties) : undefined}
    >
      {children}
    </span>
  );
}

function Row({ n, fresh }: { n: number; fresh: boolean }) {
  const p = PEOPLE[n % PEOPLE.length];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: n * PITCH,
        width: PLANE_W,
        height: PITCH,
        display: "grid",
        gridTemplateColumns: GRID,
        alignItems: "center",
        borderBottom: `1px solid ${C.lineSoft}`,
        fontSize: 19,
        color: C.ink,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ paddingLeft: 26, fontSize: 15, color: C.faint }}>
        {n + 1}
      </span>
      <Cell order={0} fresh={fresh}>
        <PlaceholderAvatar size={30} radius={15} />
        {p.name}
      </Cell>
      <Cell order={1} fresh={fresh}>
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: p.tile,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            display: "grid",
            placeItems: "center",
          }}
        >
          {p.domain[0].toUpperCase()}
        </span>
        {p.domain}
      </Cell>
      <Cell order={2} fresh={fresh}>
        <span style={{ color: "#F2B21B", fontSize: 18 }}>★</span>
        {p.title}
      </Cell>
      <Cell order={3} fresh={fresh}>
        <span style={{ display: "flex", paddingLeft: 6 }}>
          {p.tried.map((src, i) => (
            <Provider key={i} src={src} faded={p.miss} />
          ))}
        </span>
        <span style={{ color: p.miss ? C.faint : C.ink }}>
          {p.miss ? "No result" : local(p)}
        </span>
      </Cell>
    </div>
  );
}

export function HeroCrawl() {
  const host = useRef<HTMLDivElement>(null);
  useScale(host);
  const { track, head } = useCrawl(host);

  const rows: number[] = [];
  for (let n = Math.max(0, head - KEEP); n <= head; n++) rows.push(n);

  return (
    <div
      ref={host}
      className="crawl-stage absolute inset-0 overflow-hidden"
      role="img"
      aria-label="A pipe0 sheet drifting into the distance while new rows fill in at the front: each person's company, title and work email arrive and click into place, a few with no result."
    >
      <div className="crawl-inner" style={{ width: W, height: H }}>
        <div
          className="crawl-plane"
          // One spare pitch at the near edge for the row being built.
          style={{
            left: (W - PLANE_W) / 2,
            width: PLANE_W,
            height: (KEEP + 1) * PITCH,
          }}
        >
          <div
            ref={track}
            className="crawl-track"
            style={{
              top: (KEEP - 1) * PITCH,
              transform: `translate3d(0, ${-START * PITCH}px, 0)`,
            }}
          >
            {rows.map((n) => (
              // Row `head` is the one being built; it mounts fresh, so its
              // cells play their landing once and never again.
              <Row key={n} n={n} fresh={n > START} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
