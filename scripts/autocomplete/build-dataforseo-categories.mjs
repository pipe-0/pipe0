#!/usr/bin/env node
// Builds the DataForSEO business-category CSV — the categories
// `places:dataforseo@1` filters on, ranked by how many businesses carry each.
//
// Source: DataForSEO's free `business_listings/categories` endpoint, which returns
// every category id with a worldwide business count. DataForSEO has no search or
// autocomplete endpoint of its own, so the full list is snapshotted here and served
// by the autocomplete worker. Re-run roughly monthly; the list changes rarely.
//
// Each row is `value,label,weight,widgets`. The widgets (an emoji per category) are
// curated in the published CSV itself; a re-run carries them over, and a category new
// to DataForSEO starts without one until it is added there.
//
// Usage: DATAFORSEO_LOGIN=… DATAFORSEO_PASSWORD=… node scripts/autocomplete/build-dataforseo-categories.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

// Served from the pipe0-public-assets R2 bucket (public-assets.pipe0.com), not
// committed. Upload the output with the command printed at the end, then re-ingest
// the source in the autocomplete worker.
const R2_KEY = "autocomplete/dataforseo/categories.csv";
const outFile = process.env.OUT ?? join(tmpdir(), "dataforseo-categories.csv");

// Ids are lowercase snake_case; these tokens read as acronyms in a label.
const ACRONYMS = new Set(["atm", "atv", "bbq", "bmx", "cbd", "cpa", "diy", "dj", "dmv", "dvd", "hvac", "lgbtq", "mri", "rv", "tv", "ups", "usps", "vfw", "ymca"]);

function labelFor(id) {
  const words = id.split("_").map((w) => (ACRONYMS.has(w) ? w.toUpperCase() : w));
  const [first, ...rest] = words;
  return [first.charAt(0).toUpperCase() + first.slice(1), ...rest].join(" ");
}

const csvCell = (value) => `"${String(value).replaceAll('"', '""')}"`;

// value -> widgets JSON, from the CSV currently served.
const published = await fetch(`https://public-assets.pipe0.com/${R2_KEY}`);
if (!published.ok) throw new Error(`Published CSV responded ${published.status}`);
const widgets = new Map(
  (await published.text())
    .split("\n")
    .map((line) => line.match(/^"([^"]*)",.*,"(\{.*\})"$/))
    .filter(Boolean)
    .map(([, value, json]) => [value, json.replaceAll('""', '"')]),
);

const { DATAFORSEO_LOGIN: login, DATAFORSEO_PASSWORD: password } = process.env;
if (!login || !password) {
  console.error("Set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD.");
  process.exit(1);
}

const response = await fetch("https://api.dataforseo.com/v3/business_data/business_listings/categories", {
  headers: { Authorization: `Basic ${Buffer.from(`${login}:${password}`).toString("base64")}` },
});
if (!response.ok) throw new Error(`DataForSEO responded ${response.status}`);
const body = await response.json();
const task = body.tasks?.[0];
if (task?.status_code !== 20000) throw new Error(`DataForSEO task failed: ${task?.status_message}`);

const categories = (task.result ?? [])
  .filter((c) => c.category_name && (c.business_count ?? 0) > 0)
  .sort((a, b) => b.business_count - a.business_count || a.category_name.localeCompare(b.category_name));

const lines = categories.map((c) =>
  [
    csvCell(c.category_name),
    csvCell(labelFor(c.category_name)),
    csvCell(c.business_count),
    csvCell(widgets.get(c.category_name) ?? ""),
  ].join(","),
);

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${lines.join("\n")}\n`);
console.log(`Upload: npx wrangler r2 object put "pipe0-public-assets/${R2_KEY}" --file "${outFile}" --content-type "text/csv; charset=utf-8" --remote`);
console.log(`Wrote ${categories.length} categories to ${outFile}`);
