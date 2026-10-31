#!/usr/bin/env node
/** Fails the build when the output would not match what the site promises. */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
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

for (const file of files(CLIENT).filter((f) => /\.(html|js|css)$/.test(f))) {
  if (readFileSync(file, "utf8").includes("/_next/")) {
    problems.push(`Next.js URL left in ${file}`);
  }
}

// Every request that reaches the app loads the router chunk and all it imports
// statically. @pipe0/base on that path adds two seconds and costs the isolate,
// and at 3 MB it trips this budget, so heavy code stays behind `import()`.
const seen = new Set();
const queue = files(join(SERVER, "assets")).filter((file) =>
  /\/router-[^/]+\.js$/.test(file),
);
if (queue.length === 0) problems.push("no router chunk found");
let startup = 0;
while (queue.length > 0) {
  const file = queue.pop();
  if (seen.has(file)) continue;
  seen.add(file);
  const code = readFileSync(file, "utf8");
  startup += code.length;
  for (const [, specifier] of code.matchAll(
    /(?:^|[;\n}])\s*(?:import|export)\s*(?:[\w$\{\}*\s,]+?\s*from\s*)?["'](\.[^"']+\.js)["']/g,
  )) {
    queue.push(join(dirname(file), specifier));
  }
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
  `Build verified: ${new Set(urls).size} pages, Worker ${size(bytes.length)} (${size(gzipped)} gzip)`,
);
