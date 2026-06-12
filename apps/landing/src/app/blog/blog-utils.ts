import { blog, type BlogPage } from "@/lib/source";

/* ---- Placeholder cover art — a soft gradient derived from the title ---- */

/** Deterministic pseudo-random stream seeded by the post title. */
function titleRandom(title: string) {
  let seed = 0;
  for (let i = 0; i < title.length; i++) {
    seed = (seed * 31 + title.charCodeAt(i)) | 0;
  }
  return (n: number) => {
    let x = seed ^ (n * 0x9e3779b9);
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 0xffffffff;
  };
}

export function titleGradient(title: string): string {
  const rand = titleRandom(title);
  const base = Math.floor(rand(1) * 360);
  const accent = (base + 30 + Math.floor(rand(2) * 70)) % 360;
  const glow = (base + 300 + Math.floor(rand(3) * 40)) % 360;
  const at = (n: number) =>
    `${Math.floor(rand(n) * 100)}% ${Math.floor(rand(n + 7) * 100)}%`;

  return [
    `radial-gradient(90% 80% at ${at(4)}, hsl(${accent} 92% 72%) 0%, transparent 65%)`,
    `radial-gradient(80% 90% at ${at(5)}, hsl(${glow} 85% 82%) 0%, transparent 60%)`,
    `radial-gradient(110% 100% at ${at(6)}, hsl(${base} 90% 66%) 0%, transparent 70%)`,
    `linear-gradient(${Math.floor(rand(8) * 360)}deg, hsl(${base} 80% 80%) 0%, hsl(${accent} 75% 70%) 100%)`,
  ].join(", ");
}

/* ---- Post + tag helpers ---- */

export function displayTag(tag: string) {
  return tag.replace(/\b\w/g, (c) => c.toUpperCase());
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

export function allTags(posts: BlogPage[]): string[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      const key = tag.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}

/** Related reading — same primary tag first, padded with the most recent. */
export function relatedPosts(current: BlogPage, count: number): BlogPage[] {
  const posts = sortedPosts().filter((p) => p.url !== current.url);
  const currentTags = new Set(
    (current.data.tags ?? []).map((t) => t.toLowerCase()),
  );
  const sameTag = posts.filter((p) =>
    (p.data.tags ?? []).some((t) => currentTags.has(t.toLowerCase())),
  );
  const rest = posts.filter((p) => !sameTag.includes(p));
  return [...sameTag, ...rest].slice(0, count);
}
