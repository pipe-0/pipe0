#!/usr/bin/env node
/**
 * Compares what crawlers and agents see on two deployments: status, redirect
 * target, content type, SEO tags and JSON-LD.
 *
 *   node scripts/parity/contract.mjs https://pipe0.com http://localhost:4173 [paths...]
 *
 * Without paths it reads the first site's sitemap and adds the routes a
 * sitemap doesn't list.
 */
const [base, candidate, ...only] = process.argv.slice(2);
const EXTRA = [
  "/llms.txt",
  "/llms-full.txt",
  "/robots.txt",
  "/sitemap.xml",
  "/blog/rss.xml",
  "/ai-instructions.md",
  "/opengraph-image",
];

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCodePoint(parseInt(h, 16)),
    )
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)')`, "i"));
  return m ? decode(m[1] ?? m[2]) : undefined;
};

function headOf(html) {
  const head = {};
  const add = (k, v) => {
    if (v !== undefined) (head[k] ??= []).push(v);
  };
  add("title", decode(html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? ""));
  for (const tag of html.match(/<meta\s[^>]*>/gi) ?? []) {
    const key = attr(tag, "property") ?? attr(tag, "name");
    if (!key || /^(viewport|next-size-adjust|theme-color)$/.test(key)) continue;
    // Next appends a content hash to file-convention images.
    add(
      key,
      /image$/.test(key)
        ? attr(tag, "content")?.split("?")[0]
        : attr(tag, "content"),
    );
  }
  for (const tag of html.match(/<link\s[^>]*>/gi) ?? []) {
    const rel = attr(tag, "rel");
    if (rel === "canonical") add("canonical", attr(tag, "href"));
    if (rel === "alternate")
      add(`alternate:${attr(tag, "type")}`, attr(tag, "href"));
  }
  const ld = [
    ...html.matchAll(
      /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ]
    .map((m) => {
      try {
        // Next's builds read file dates from a shallow clone, so those differ.
        return JSON.stringify(JSON.parse(m[1]), (k, v) =>
          k === "dateModified" ? undefined : v,
        );
      } catch {
        return "invalid";
      }
    })
    .sort();
  if (ld.length) head.jsonld = ld;
  return head;
}

async function probe(origin, path, headers) {
  const res = await fetch(origin + path, { redirect: "manual", headers });
  const type = (res.headers.get("content-type") ?? "")
    .replace(/;\s*/g, "; ")
    .toLowerCase();
  const location =
    res.headers.get("location")?.replace(origin, "") ?? undefined;
  const html = type.includes("html") ? await res.text() : "";
  if (!html) await res.arrayBuffer();
  return {
    status: res.status,
    type: type.split(";")[0],
    location,
    head: html ? headOf(html) : {},
  };
}

async function paths() {
  if (only.length) return only;
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname,
  );
  return [...new Set([...locs, ...EXTRA])];
}

const list = await paths();
const fields = new Map();
const note = (field, path, a, b) => {
  const hit = fields.get(field) ?? { count: 0, examples: [] };
  hit.count++;
  if (hit.examples.length < 3)
    hit.examples.push({ path, base: a, candidate: b });
  fields.set(field, hit);
};

let done = 0;
const queue = [...list];
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const path = queue.shift();
      const [a, b] = await Promise.all([
        probe(base, path),
        probe(candidate, path),
      ]);
      for (const k of ["status", "type", "location"])
        if (a[k] !== b[k]) note(k, path, a[k], b[k]);
      for (const k of new Set([
        ...Object.keys(a.head),
        ...Object.keys(b.head),
      ])) {
        const x = JSON.stringify(a.head[k]),
          y = JSON.stringify(b.head[k]);
        if (x !== y) note(k, path, a.head[k], b.head[k]);
      }
      done++;
    }
  }),
);

console.log(`${done} paths compared, ${fields.size} fields differ`);
for (const [field, { count, examples }] of [...fields].sort(
  (a, b) => b[1].count - a[1].count,
)) {
  console.log(`\n${field}: ${count}`);
  for (const e of examples)
    console.log(
      `  ${e.path}\n    base: ${JSON.stringify(e.base)?.slice(0, 230)}\n    new:  ${JSON.stringify(e.candidate)?.slice(0, 230)}`,
    );
}
process.exitCode = fields.size ? 1 : 0;
