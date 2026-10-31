#!/usr/bin/env node
/** Fails the build when the output would not match what the site promises. */
import { existsSync, readFileSync, readdirSync } from "node:fs";
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

for (const file of files(CLIENT).filter((f) => /\.(html|js|css)$/.test(f))) {
  if (readFileSync(file, "utf8").includes("/_next/")) {
    problems.push(`Next.js URL left in ${file}`);
  }
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
