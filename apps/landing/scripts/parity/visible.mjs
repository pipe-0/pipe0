/**
 * Compares what a browser renders on every sitemap URL, whitespace included.
 * It catches what head checks and sampled screenshots miss: error boundaries,
 * lost indentation, missing labels.
 *
 *   node visible.mjs https://pipe0.com https://candidate.example
 */
import { chromium } from "playwright";

const [production, candidate] = process.argv.slice(2);
const sitemap = await (await fetch(`${candidate}/sitemap.xml`)).text();
const urls = [
  ...new Set(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => new URL(match[1]).pathname,
    ),
  ),
];
const browser = await chromium.launch();
const blocked =
  /n\.pipe0\.com|va\.vercel-scripts|vitals\.vercel|\.mp4|imagedelivery|\.(png|jpe?g|webp|avif)(\?|$)|_next\/image/;

async function read(origin, url, settle) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await page.route(blocked, (route) => route.abort());
  try {
    await page.goto(origin + url, { waitUntil: "load", timeout: 45_000 });
    await page.waitForTimeout(settle);
    return await page.evaluate(() => document.body.innerText);
  } catch (error) {
    return `failed: ${error.message}`;
  } finally {
    await page.close();
  }
}

const compare = async (url, settle) => {
  const [a, b] = await Promise.all([
    read(production, url, settle),
    read(candidate, url, settle),
  ]);
  return { a, b };
};

let next = 0;
const differing = [];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (next < urls.length) {
      const url = urls[next++];
      let { a, b } = await compare(url, 800);
      // Either side may still be hydrating under this much traffic.
      if (a !== b) ({ a, b } = await compare(url, 3_000));
      if (a === b) continue;
      let at = 0;
      while (a[at] === b[at]) at++;
      differing.push({
        url,
        production: a.slice(Math.max(0, at - 40), at + 70),
        candidate: b.slice(Math.max(0, at - 40), at + 70),
      });
    }
  }),
);
await browser.close();

for (const item of differing) console.log(JSON.stringify(item));
console.log(
  `${urls.length - differing.length} of ${urls.length} pages render the same text`,
);
process.exitCode = differing.length > 0 ? 1 : 0;
