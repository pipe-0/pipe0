/**
 * Compares every link in the prerendered HTML of each sitemap URL: where it
 * points, its rel and its target. Text and screenshots cannot see a link that
 * looks right and goes somewhere else.
 *
 *   node links.mjs https://pipe0.com https://candidate.example
 */
const [production, candidate] = process.argv.slice(2);
const sitemap = await (await fetch(`${candidate}/sitemap.xml`)).text();
const urls = [
  ...new Set(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => new URL(match[1]).pathname,
    ),
  ),
];

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const clean = (href) =>
  decodeURIComponent(href.replaceAll("&amp;", "&")).replace(
    /^https:\/\/(www\.)?pipe0\.com(?=\/)/,
    "",
  );

async function links(origin, path) {
  const html = (await (await fetch(origin + path)).text())
    .replace(/<script\b[\s\S]*?<\/script>/g, "")
    .replace(/<template\b[\s\S]*?<\/template>/g, "");
  const found = [...html.matchAll(/<a\s[^>]*>/g)].flatMap(([tag]) => {
    const href = attr(tag, "href");
    if (href === undefined) return [];
    return [
      `${clean(href)} rel=${attr(tag, "rel") ?? ""} target=${attr(tag, "target") ?? ""}`,
    ];
  });
  return new Set(found);
}

let next = 0;
const differing = [];
await Promise.all(
  Array.from({ length: 10 }, async () => {
    while (next < urls.length) {
      const url = urls[next++];
      const [a, b] = await Promise.all([
        links(production, url),
        links(candidate, url),
      ]);
      const removed = [...a].filter((link) => !b.has(link));
      const added = [...b].filter((link) => !a.has(link));
      if (removed.length || added.length)
        differing.push({ url, removed, added });
    }
  }),
);

const counts = new Map();
for (const { removed, added } of differing) {
  for (const link of removed)
    counts.set(`- ${link}`, (counts.get(`- ${link}`) ?? 0) + 1);
  for (const link of added)
    counts.set(`+ ${link}`, (counts.get(`+ ${link}`) ?? 0) + 1);
}
for (const [link, count] of [...counts]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30)) {
  console.log(String(count).padStart(4), link);
}
console.log(
  `${urls.length - differing.length} of ${urls.length} pages have the same links`,
);
process.exitCode = differing.length > 0 ? 1 : 0;
