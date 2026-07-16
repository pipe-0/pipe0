import { blog, type BlogPage } from "@/lib/source";

/* ---- Generated cover art ----
   Deterministic SVG derived from the post title: a near-monochrome motif
   (one of six) with a single indigo accent, matching the light-theme
   neutral ramp. Highlighted posts get the inverted (dark) variant so
   editors' picks stand out in the grid. Colors are literal because the
   SVG ships as a data URI and can't read CSS variables. */

/** FNV-1a — stable across runs so covers never change between builds. */
function titleHash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

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
  const el: string[] = [];
  const bg = invert ? "#161616" : seed % 2 ? "#FAFAFA" : "#F4F4F4";
  const ink = invert ? "#D8D8D8" : "#5C5E63";
  const faint = invert ? "#3D3D3D" : "#DBDBDB";
  const fill = invert ? "#242424" : "#ECECEC";
  // Brand indigo — light/dark values of --primary.
  const A = invert ? "hsl(236 90% 68%)" : "hsl(236 77% 55%)";

  const motif = ["circle", "rings", "cubes", "glyph", "halftone", "rules"][
    seed % 6
  ];

  if (motif === "circle") {
    const r = H * 0.52;
    const cx = W * (0.28 + rnd() * 0.44);
    const cy = rnd() < 0.5 ? H * 0.1 : H * 0.9;
    el.push(
      `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${(r * 0.55).toFixed(0)}" fill="${fill}" stroke="none"/>`,
      `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="none" stroke="${ink}" stroke-width="2"/>`,
      `<circle cx="${(cx * 0.55).toFixed(0)}" cy="${(H - cy).toFixed(0)}" r="${(r * 0.32).toFixed(0)}" fill="none" stroke="${faint}" stroke-width="1.6"/>`,
      `<circle cx="${(cx + r * 0.71).toFixed(0)}" cy="${(cy + (cy < H / 2 ? r * 0.71 : -r * 0.71)).toFixed(0)}" r="8" fill="${A}"/>`,
    );
  } else if (motif === "rings") {
    const side = Math.floor(rnd() * 3);
    const cx = side === 0 ? 0 : side === 1 ? W : W / 2;
    const cy = side === 2 ? 0 : H / 2 + (rnd() < 0.5 ? -H / 2 : H / 2);
    const n = 8;
    const ai = 2 + Math.floor(rnd() * 4);
    for (let i = 1; i <= n; i++) {
      const r = i * (Math.max(W, H) / (n * 0.85));
      el.push(
        `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="none" stroke="${i === ai ? A : i % 2 ? faint : ink}" stroke-width="${i === ai ? 3 : 1.8}"/>`,
      );
    }
  } else if (motif === "cubes") {
    const cube = (
      x: number,
      y: number,
      w: number,
      hh: number,
      ft: string,
      fl: string,
      fr: string,
      st: string,
    ) => {
      const p = (d: string, f: string) =>
        `<path d="${d}" fill="${f}" stroke="${st}" stroke-width="1.5" stroke-linejoin="round"/>`;
      return (
        p(`M${x} ${y} l${w} ${-w / 2} l${w} ${w / 2} l${-w} ${w / 2} z`, ft) +
        p(`M${x} ${y} l${w} ${w / 2} v${hh} l${-w} ${-w / 2} z`, fl) +
        p(`M${x + w} ${y + w / 2} l${w} ${-w / 2} v${hh} l${-w} ${w / 2} z`, fr)
      );
    };
    const n = 5 + Math.floor(rnd() * 4);
    for (let i = 0; i < n; i++) {
      const w = 30 + rnd() * 28;
      const hh = w * (0.8 + rnd() * 0.5);
      const x = W * 0.16 + rnd() * W * 0.6;
      const y = H * 0.2 + rnd() * H * 0.55;
      const isA = i === n - 1;
      el.push(
        cube(
          +x.toFixed(0),
          +y.toFixed(0),
          +w.toFixed(0),
          +hh.toFixed(0),
          isA ? A : invert ? "#2E2E2E" : "#F4F4F4",
          fill,
          invert ? "#1D1D1D" : "#E2E2E2",
          isA ? A : ink,
        ),
      );
    }
  } else if (motif === "glyph") {
    const chars = ["&amp;", "§", "¶", "%", "#", "?", "*", "@"];
    const ch = chars[Math.floor(rnd() * chars.length)];
    const rot = (rnd() * 14 - 7).toFixed(1);
    el.push(
      `<text x="${W / 2}" y="${H * 0.56}" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="${(H * 0.88).toFixed(0)}" fill="${fill}" stroke="${ink}" stroke-width="2.5" transform="rotate(${rot} ${W / 2} ${H / 2})">${ch}</text>`,
      `<circle cx="${(W * (0.72 + rnd() * 0.14)).toFixed(0)}" cy="${(H * (0.16 + rnd() * 0.14)).toFixed(0)}" r="9" fill="${A}"/>`,
    );
  } else if (motif === "halftone") {
    const corner = [
      [0, 0],
      [W, 0],
      [0, H],
      [W, H],
    ][Math.floor(rnd() * 4)];
    const D = Math.hypot(W, H);
    for (let y = 26; y < H; y += 36)
      for (let x = 26; x < W; x += 36) {
        const d = Math.hypot(x - corner[0], y - corner[1]);
        const r = 7.5 * (1 - d / D) - 0.8;
        if (r > 0.6)
          el.push(
            `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="${ink}"/>`,
          );
      }
    el.push(
      `<circle cx="${(W * 0.72).toFixed(0)}" cy="${(H * 0.7).toFixed(0)}" r="8" fill="${A}"/>`,
    );
  } else {
    const n = 8 + Math.floor(rnd() * 4);
    for (let i = 0; i < n; i++) {
      const y = H * 0.14 + ((H * 0.72) / n) * i + rnd() * 8;
      const heavy = rnd() < 0.22;
      el.push(
        `<line x1="70" y1="${y.toFixed(0)}" x2="${W - 70}" y2="${y.toFixed(0)}" stroke="${heavy ? ink : faint}" stroke-width="${heavy ? 2.4 : 1.5}"/>`,
      );
    }
    const cx = W * (0.25 + rnd() * 0.5);
    el.push(
      `<circle cx="${cx.toFixed(0)}" cy="${(H / 2).toFixed(0)}" r="${(H * 0.24).toFixed(0)}" fill="none" stroke="${ink}" stroke-width="2"/>`,
      `<line x1="70" y1="${(H * 0.895).toFixed(0)}" x2="${W - 70}" y2="${(H * 0.895).toFixed(0)}" stroke="${A}" stroke-width="2.6"/>`,
    );
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${bg}"/>${el.join("")}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Cover for a post — highlighted posts get the inverted (dark) variant. */
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

export function sortedPosts(): BlogPage[] {
  return [...blog.getPages()].sort(
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
