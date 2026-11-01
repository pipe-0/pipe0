#!/usr/bin/env node
/** Fails the build when the output would not match what the site promises. */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const CLIENT = "dist/client";
const SERVER = "dist/server";
const MIB = 1024 * 1024;
const problems = [];

const files = (dir) =>
  readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));

// Every sitemap URL needs a file, or it would hit the Worker as a 404.
const sitemap = readFileSync(join(CLIENT, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => new URL(match[1]).pathname,
);
for (const path of new Set(urls)) {
  const file = join(CLIENT, decodeURIComponent(path), "index.html");
  if (!existsSync(file)) problems.push(`sitemap URL has no page: ${path}`);
}

// Client navigation reads these. A missing one is a 404 only on click, so it
// would pass every check that loads the page directly.
for (const path of new Set(urls)) {
  const docs = decodeURIComponent(path).match(/^\/docs(\/.*)?$/);
  if (docs && !existsSync(join(CLIENT, "data", `docs${docs[1] ?? ""}.json`))) {
    problems.push(`page has no data file: ${path}`);
  }
}

for (const file of files(CLIENT).filter((f) => /\.(html|js|css)$/.test(f))) {
  if (readFileSync(file, "utf8").includes("/_next/")) {
    problems.push(`Next.js URL left in ${file}`);
  }
}

// Every request that reaches the app loads the router chunk and all it imports
// statically. @pipe0/base on that path adds two seconds and costs the isolate,
// and at 3 MB it trips this budget, so heavy code stays behind `import()`.
const manifest = JSON.parse(
  readFileSync(join(SERVER, ".vite/manifest.json"), "utf8"),
);
const seen = new Set();
const queue = ["src/router.tsx"];
if (!manifest[queue[0]]) problems.push("no router chunk found");
let startup = 0;
while (queue.length > 0) {
  const key = queue.pop();
  if (seen.has(key) || !manifest[key]) continue;
  seen.add(key);
  startup += statSync(join(SERVER, manifest[key].file)).size;
  queue.push(...(manifest[key].imports ?? []));
}
if (startup > 4 * MIB) {
  problems.push(`router loads ${(startup / MIB).toFixed(1)} MiB up front`);
}

// Cloudflare's limit is 64 MiB uncompressed. Gzip is watched as a margin.
const worker = files(SERVER).filter((file) => file.endsWith(".js"));
const bytes = Buffer.concat(worker.map((file) => readFileSync(file)));
if (bytes.length > 64 * MIB)
  problems.push(`Worker is ${bytes.length / MIB} MiB`);
const gzipped = gzipSync(bytes).length;
if (gzipped > 10 * MIB) problems.push(`Worker gzips to ${gzipped / MIB} MiB`);

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
const size = (n) => `${(n / MIB).toFixed(1)} MiB`;
console.log(
  `Build verified: ${new Set(urls).size} pages, Worker ${size(bytes.length)} (${size(gzipped)} gzip), router ${size(startup)} up front`,
);
