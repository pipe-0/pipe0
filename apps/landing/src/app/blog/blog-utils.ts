import { blog, type BlogPage } from "@/lib/source";

/* ---- Generated cover art ----
   Deterministic SVG scene derived from the post title: a saturated paper
   background, a centered geometric motif, and one or two color accents —
   every tile distinct while the family stays coherent. Highlighted posts
   get the single vivid brand-indigo tile so editors' picks stand out.
   Colors are literal because the SVG ships as a data URI and can't read
   CSS variables. */

/** FNV-1a — stable across runs so covers never change between builds. */
function titleHash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type CoverPalette = {
  bg: string;
  /** Primary drawing color. */
  ink: string;
  /** Soft shape fill, one step off the background. */
  fill: string;
  /** Primary accent — brand indigo on light tiles. */
  a1: string;
  /** Secondary warm accent. */
  a2: string;
};

const COVER_PALETTES: CoverPalette[] = [
  { bg: "#F2EDE1", ink: "#28251D", fill: "#E1D7BE", a1: "#3440E5", a2: "#C9502E" }, // cream
  { bg: "#F5E4DD", ink: "#2C1E19", fill: "#E9CBC0", a1: "#3440E5", a2: "#B4472A" }, // blush
  { bg: "#E2EAD8", ink: "#232920", fill: "#CBD9B6", a1: "#3440E5", a2: "#C07A2E" }, // sage
  { bg: "#DEE9F4", ink: "#1E2631", fill: "#C2D7EA", a1: "#3440E5", a2: "#C9502E" }, // sky
  { bg: "#F2E3BB", ink: "#2B2412", fill: "#E4CE8C", a1: "#3440E5", a2: "#A8431F" }, // butter
  { bg: "#B9835F", ink: "#2E1D10", fill: "#D0A683", a1: "#F4EEE1", a2: "#3440E5" }, // terracotta
  { bg: "#E6E2F2", ink: "#242032", fill: "#CFC8E7", a1: "#3440E5", a2: "#B4472A" }, // lavender
];

/** Editors' picks — the one vivid tile in the grid, brand indigo. */
const HIGHLIGHT_PALETTE: CoverPalette = {
  bg: "#3440E5",
  ink: "#F2F1E9",
  fill: "#5560EA",
  a1: "#F2F1E9",
  a2: "#F2C94C",
};

export function generatedCover(
  title: string,
  { ratio = 1.5, invert = false }: { ratio?: number; invert?: boolean } = {},
): string {
  const seed = titleHash(title);
  let s0 = seed;
  const rnd = () => {
    s0 = (s0 + 0x6d2b79f5) | 0;
    let t = Math.imul(s0 ^ (s0 >>> 15), 1 | s0);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const W = 900;
  const H = Math.round(900 / ratio);
  const cx = W / 2;
  const cy = H / 2;
  const p = invert
    ? HIGHLIGHT_PALETTE
    : COVER_PALETTES[seed % COVER_PALETTES.length];
  const el: string[] = [];

  // Motif choice decorrelated from the palette choice.
  const motif = ["orbit", "cubes", "glyph", "halftone", "flow", "sheet"][
    (seed >>> 3) % 6
  ];

  if (motif === "orbit") {
    const r = H * (0.24 + rnd() * 0.1);
    const discR = r * (0.4 + rnd() * 0.3);
    const outerR = r * (1.4 + rnd() * 0.35);
    const th = rnd() * Math.PI * 2;
    el.push(
      `<circle cx="${cx}" cy="${cy}" r="${outerR.toFixed(0)}" fill="none" stroke="${p.fill}" stroke-width="3"/>`,
      `<circle cx="${cx}" cy="${cy}" r="${discR.toFixed(0)}" fill="${p.fill}"/>`,
      `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(0)}" fill="none" stroke="${p.ink}" stroke-width="3"/>`,
      `<circle cx="${(cx + r * Math.cos(th)).toFixed(0)}" cy="${(cy + r * Math.sin(th)).toFixed(0)}" r="${(11 + rnd() * 5).toFixed(0)}" fill="${p.a1}"/>`,
      `<circle cx="${(cx + outerR * Math.cos(th + 2.4)).toFixed(0)}" cy="${(cy + outerR * Math.sin(th + 2.4)).toFixed(0)}" r="7" fill="${p.a2}"/>`,
    );
    if (rnd() < 0.5) {
      const mth = th + 3.6;
      el.push(
        `<circle cx="${(cx + outerR * Math.cos(mth)).toFixed(0)}" cy="${(cy + outerR * Math.sin(mth)).toFixed(0)}" r="16" fill="none" stroke="${p.ink}" stroke-width="2.5"/>`,
      );
    }
  } else if (motif === "cubes") {
    const cube = (
      x: number,
      y: number,
      w: number,
      hh: number,
      top: string,
      accent: boolean,
    ) => {
      const path = (d: string, fill: string, opacity?: number) =>
        `<path d="${d}" fill="${fill}"${opacity ? ` fill-opacity="${opacity}"` : ""} stroke="${p.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
      return (
        path(`M${x} ${y} l${w} ${-w / 2} l${w} ${w / 2} l${-w} ${w / 2} z`, top) +
        path(
          `M${x} ${y} l${w} ${w / 2} v${hh} l${-w} ${-w / 2} z`,
          accent ? p.a1 : p.ink,
          accent ? 0.55 : 0.22,
        ) +
        path(
          `M${x + w} ${y + w / 2} l${w} ${-w / 2} v${hh} l${-w} ${w / 2} z`,
          accent ? p.a1 : p.ink,
          accent ? 0.3 : 0.1,
        )
      );
    };
    const n = 5;
    for (let i = 0; i < n; i++) {
      const w = H * (0.11 + rnd() * 0.05);
      const hh = w * (0.9 + rnd() * 0.4);
      const x = cx - w + (rnd() - 0.5) * W * 0.34;
      const y = cy - hh / 2 + (rnd() - 0.5) * H * 0.42;
      const accent = i === n - 1;
      el.push(
        cube(
          +x.toFixed(0),
          +y.toFixed(0),
          +w.toFixed(0),
          +hh.toFixed(0),
          accent ? p.a1 : p.fill,
          accent,
        ),
      );
    }
  } else if (motif === "glyph") {
    const chars = ["&amp;", "§", "¶", "%", "#", "?", "*", "@"];
    const ch = chars[Math.floor(rnd() * chars.length)];
    const rot = (rnd() * 14 - 7).toFixed(1);
    el.push(
      `<text x="${cx}" y="${(H * 0.56).toFixed(0)}" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="${(H * 0.85).toFixed(0)}" fill="${p.fill}" stroke="${p.ink}" stroke-width="2.5" transform="rotate(${rot} ${cx} ${cy})">${ch}</text>`,
      `<circle cx="${(cx + H * (0.42 + rnd() * 0.1)).toFixed(0)}" cy="${(H * (0.2 + rnd() * 0.12)).toFixed(0)}" r="12" fill="${p.a2}"/>`,
      `<circle cx="${(cx - H * (0.46 + rnd() * 0.08)).toFixed(0)}" cy="${(H * (0.68 + rnd() * 0.12)).toFixed(0)}" r="8" fill="${p.a1}"/>`,
    );
  } else if (motif === "halftone") {
    const accentRing = 2;
    const accentAt = Math.floor(rnd() * accentRing * 6);
    for (let k = 0; k <= 6; k++) {
      const rad = k * H * 0.062;
      const count = k === 0 ? 1 : k * 6;
      const r = 8.5 * (1 - k / 7.5);
      for (let j = 0; j < count; j++) {
        const ang = (j * Math.PI * 2) / count + k * 0.35;
        const x = cx + rad * Math.cos(ang);
        const y = cy + rad * Math.sin(ang);
        const isAccent = k === accentRing && j === accentAt;
        el.push(
          `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(isAccent ? r + 3 : r).toFixed(1)}" fill="${isAccent ? p.a2 : p.ink}"/>`,
        );
      }
    }
    el.push(
      `<circle cx="${cx}" cy="${cy}" r="${(H * 0.44).toFixed(0)}" fill="none" stroke="${p.fill}" stroke-width="3"/>`,
    );
  } else if (motif === "flow") {
    const n = 3 + Math.floor(rnd() * 3);
    const span = W * (0.5 + rnd() * 0.16);
    const g = span / (n - 1);
    const r = H * (0.075 + rnd() * 0.03);
    const accIdx = Math.floor(rnd() * n);
    const tilt = (rnd() - 0.5) * H * 0.3;
    const yAt = (i: number) => cy - tilt / 2 + (tilt / (n - 1)) * i;
    el.push(
      `<line x1="${(cx - span / 2).toFixed(0)}" y1="${yAt(0).toFixed(0)}" x2="${(cx + span / 2).toFixed(0)}" y2="${yAt(n - 1).toFixed(0)}" stroke="${p.ink}" stroke-width="3"/>`,
    );
    for (let i = 0; i < n; i++) {
      const x = cx - span / 2 + i * g;
      el.push(
        i === accIdx
          ? `<circle cx="${x.toFixed(0)}" cy="${yAt(i).toFixed(0)}" r="${r.toFixed(0)}" fill="${p.a1}"/>`
          : `<circle cx="${x.toFixed(0)}" cy="${yAt(i).toFixed(0)}" r="${r.toFixed(0)}" fill="${p.bg}" stroke="${p.ink}" stroke-width="3"/>`,
      );
    }
    el.push(
      `<circle cx="${(cx + span / 2 + r).toFixed(0)}" cy="${(yAt(n - 1) - r * 1.7).toFixed(0)}" r="7" fill="${p.a2}"/>`,
    );
  } else {
    // sheet — a miniature grid with a header row and two accent cells
    const cols = 3 + Math.floor(rnd() * 2);
    const rows = 3;
    const cw = W * (cols === 3 ? 0.15 : 0.115);
    const chh = H * 0.16;
    const gap = 10;
    const x0 = cx - (cols * cw + (cols - 1) * gap) / 2;
    const y0 = cy - (rows * chh + (rows - 1) * gap) / 2;
    const acc1 = [1 + Math.floor(rnd() * 2), Math.floor(rnd() * cols)];
    const acc2 = [
      1 + Math.floor(rnd() * 2),
      (acc1[1] + 1 + Math.floor(rnd() * (cols - 1))) % cols,
    ];
    for (let rI = 0; rI < rows; rI++) {
      for (let c = 0; c < cols; c++) {
        const isA1 = rI === acc1[0] && c === acc1[1];
        const isA2 = !isA1 && rI === acc2[0] && c === acc2[1];
        const fill = isA1 ? p.a1 : isA2 ? p.a2 : rI === 0 ? p.fill : p.bg;
        el.push(
          `<rect x="${(x0 + c * (cw + gap)).toFixed(0)}" y="${(y0 + rI * (chh + gap)).toFixed(0)}" width="${cw.toFixed(0)}" height="${chh.toFixed(0)}" rx="10" fill="${fill}"${isA1 || isA2 ? "" : ` stroke="${p.ink}" stroke-width="2.5"`}/>`,
        );
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${p.bg}"/>${el.join("")}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Cover for a post — highlighted posts get the vivid brand-indigo tile. */
export function postCover(post: BlogPage, ratio: number): string {
  return generatedCover(post.data.title, {
    ratio,
    invert: post.data.highlight === true,
  });
}

/* ---- Author helpers ---- */

export function authorInitials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ---- Post + category helpers ---- */

/** Editorial sections in display order — Thinking leads. */
export const CATEGORIES = ["Thinking", "Engineering", "Sales data"] as const;
export type Category = (typeof CATEGORIES)[number];

export function categorySlug(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function categoryFromSlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => categorySlug(c) === slug);
}

/** Categories that actually have posts, in display order. */
export function usedCategories(posts: BlogPage[]): Category[] {
  const present = new Set(posts.map((p) => p.data.category));
  return CATEGORIES.filter((c) => present.has(c));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Published posts, newest first. Drafts never leave the repo. */
export function sortedPosts(): BlogPage[] {
  return blog
    .getPages()
    .filter((p) => p.data.draft !== true)
    .sort(
      (a, b) =>
        new Date(b.data.date ?? 0).getTime() -
        new Date(a.data.date ?? 0).getTime(),
    );
}

/** Related reading — editors' picks far outweigh topical overlap; newest wins ties. */
export function relatedPosts(current: BlogPage, count: number): BlogPage[] {
  const posts = sortedPosts().filter((p) => p.url !== current.url);
  const currentTags = new Set(
    (current.data.tags ?? []).map((t) => t.toLowerCase()),
  );
  const score = (p: BlogPage) =>
    (p.data.highlight ? 4 : 0) +
    ((p.data.tags ?? []).some((t) => currentTags.has(t.toLowerCase()))
      ? 2
      : 0) +
    (p.data.category === current.data.category ? 1 : 0);
  // Stable sort — posts stay newest-first within the same score.
  return posts.sort((a, b) => score(b) - score(a)).slice(0, count);
}
