#!/usr/bin/env node
// Builds the GeoNames places CSV — places with coordinates for
// radius searches (`places:dataforseo@1`'s `location` filter).
//
// Source: GeoNames `cities5000` (every place with population >= 5,000), licensed
// CC BY 4.0 — https://www.geonames.org. Docs that use this list must credit GeoNames.
//
// Each row is `value,label,weight,widgets`:
//   value   "<label>|<lat>,<lng>" — the coordinates ride in the value, so a search
//           payload is self-describing and the runner needs no lookup table
//   label   "New York City, New York, United States"
//   weight  population, so large places rank first
//   widgets the country flag emoji, as in crustdata/regions.csv
//
// Usage: node scripts/autocomplete/build-geonames-cities.mjs   (needs `unzip` on PATH)
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

// Served from the pipe0-public-assets R2 bucket (public-assets.pipe0.com), not
// committed. Upload the output with the command printed at the end, then re-ingest
// the source in the autocomplete worker.
const R2_KEY = "autocomplete/geonames/cities.csv";
const outFile = process.env.OUT ?? join(tmpdir(), "geonames-cities.csv");
const BASE = "https://download.geonames.org/export/dump";

async function download(name, dir) {
  const response = await fetch(`${BASE}/${name}`);
  if (!response.ok) throw new Error(`GeoNames ${name}: ${response.status}`);
  const path = join(dir, name);
  writeFileSync(path, Buffer.from(await response.arrayBuffer()));
  return path;
}

const work = mkdtempSync(join(tmpdir(), "geonames-"));
const zip = await download("cities5000.zip", work);
execFileSync("unzip", ["-o", "-q", zip, "-d", work]);
const admin1Path = await download("admin1CodesASCII.txt", work);
const countryPath = await download("countryInfo.txt", work);

// "US.NY" -> "New York"
const admin1 = new Map(
  readFileSync(admin1Path, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [code, name] = line.split("\t");
      return [code, name];
    }),
);

// "US" -> "United States"
const countries = new Map(
  readFileSync(countryPath, "utf8")
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const cols = line.split("\t");
      return [cols[0], cols[4]];
    }),
);

const flag = (iso) =>
  iso.length === 2 ? String.fromCodePoint(...[...iso.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) : "";
const csvCell = (value) => `"${String(value).replaceAll('"', '""')}"`;

// geoname table columns: 1 name, 4 lat, 5 lng, 8 country, 10 admin1, 14 population
const byLabel = new Map();
for (const line of readFileSync(join(work, "cities5000.txt"), "utf8").split("\n")) {
  if (!line) continue;
  const cols = line.split("\t");
  const [name, lat, lng, country, admin1Code, population] = [cols[1], cols[4], cols[5], cols[8], cols[10], Number(cols[14])];
  const countryName = countries.get(country);
  if (!name || !countryName) continue;
  const region = admin1.get(`${country}.${admin1Code}`);
  const label = [name, region, countryName].filter(Boolean).join(", ");
  // Same name in the same region (rare): keep the larger place.
  const existing = byLabel.get(label);
  if (existing && existing.population >= population) continue;
  byLabel.set(label, { label, lat: Number(lat).toFixed(5), lng: Number(lng).toFixed(5), population, country });
}

const rows = [...byLabel.values()].sort((a, b) => b.population - a.population || a.label.localeCompare(b.label));
const lines = rows.map((r) =>
  [
    csvCell(`${r.label}|${r.lat},${r.lng}`),
    csvCell(r.label),
    csvCell(r.population),
    csvCell(JSON.stringify({ emoji: { char: flag(r.country) } })),
  ].join(","),
);

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${lines.join("\n")}\n`);
console.log(`Upload: npx wrangler r2 object put "pipe0-public-assets/${R2_KEY}" --file "${outFile}" --content-type "text/csv; charset=utf-8" --remote`);
console.log(`Wrote ${rows.length} places to ${outFile}`);
