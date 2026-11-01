/**
 * Clicks every tab and disclosure on a page, each on a fresh load, and compares
 * the result with production. Bugs in code that only runs after a click stay
 * invisible to every check that just loads pages.
 *
 *   node controls.mjs https://pipe0.com https://candidate.example [paths...]
 */
import { chromium } from "playwright";

const DEFAULT_PATHS = [
  "/",
  "/pricing",
  "/compare/pipe0-vs-clay",
  "/reviews/apollo",
  "/docs/api/pipes/run",
  "/docs/pipe-catalog",
  "/docs/search-catalog",
  "/docs/pipe-catalog/person:workemail:waterfall/1",
  "/docs/search-catalog/people:profiles:crustdata/3",
];
const CONTROLS = '[role=tab], button[aria-expanded="false"], summary';
const SKIPPED = /^(search|ask ai|book a demo)|previous|next/i;

const [production, candidate, ...args] = process.argv.slice(2);
const paths = args.length > 0 ? args : DEFAULT_PATHS;
const browser = await chromium.launch();

async function open(origin, path) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  await page.route(/n\.pipe0\.com|va\.vercel-scripts|vitals\.vercel/, (route) => route.abort());
  page.on("pageerror", (error) => errors.push(error.message.slice(0, 140)));
  await page.goto(origin + path, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(400);
  const reject = page.getByRole("button", { name: /^reject all$/i }).first();
  if (await reject.count()) await reject.click().catch(() => {});
  return { context, page, errors };
}

/** Controls by label, numbered within a label so repeats stay addressable. */
const list = (page) =>
  page.evaluate((selector) => {
    const seen = {};
    return [...document.querySelectorAll(selector)]
      .filter((element) => element.offsetParent !== null)
      .map((element) => {
        const label = element.textContent
          .trim()
          .replace(/\s+/g, " ")
          .slice(0, 50);
        seen[label] = (seen[label] ?? -1) + 1;
        return { label, nth: seen[label] };
      });
  }, CONTROLS);

async function press(origin, path, control) {
  const { context, page, errors } = await open(origin, path);
  const handle = await page.evaluateHandle(
    ({ selector, control }) => {
      const seen = {};
      for (const element of document.querySelectorAll(selector)) {
        if (element.offsetParent === null) continue;
        const label = element.textContent
          .trim()
          .replace(/\s+/g, " ")
          .slice(0, 50);
        seen[label] = (seen[label] ?? -1) + 1;
        if (label === control.label && seen[label] === control.nth)
          return element;
      }
      return null;
    },
    { selector: CONTROLS, control },
  );
  await handle
    .asElement()
    ?.click({ timeout: 3_000 })
    .catch(() => {});
  // The first open of a lazy panel fetches its chunk.
  await page.waitForTimeout(1_500);
  const text = await page.evaluate(() => document.body.innerText);
  const url = decodeURI(new URL(page.url()).pathname);
  await context.close();
  return { text, url, errors };
}

let checked = 0;
let failed = 0;
for (const path of paths) {
  const { context, page } = await open(production, path);
  const controls = await list(page);
  await context.close();
  for (const control of controls
    .filter((c) => !SKIPPED.test(c.label))
    .slice(0, 26)) {
    const [a, b] = await Promise.all([
      press(production, path, control),
      press(candidate, path, control),
    ]);
    checked++;
    const crashed = /something went wrong/i.test(b.text);
    if (a.text === b.text && a.url === b.url && !b.errors.length && !crashed)
      continue;
    failed++;
    console.log(path, JSON.stringify(control.label), {
      crashed,
      errors: b.errors,
    });
  }
}
await browser.close();
console.log(`${checked - failed} of ${checked} controls behave the same`);
process.exitCode = failed > 0 ? 1 : 0;
