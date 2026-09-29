#!/usr/bin/env node
// Fails when docs, site code, or examples name a pipe or search id that is
// deprecated or not in the catalog. Agents copy ids from examples; a single
// stale id in a docs page sends new integrations to a deprecated pipe.
//
// Usage: node scripts/check-catalog-ids.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const base = await import(
  pathToFileURL(
    join(repoRoot, "apps/landing/node_modules/@pipe0/base/dist/index.mjs"),
  ).href
);

const ROOTS = [
  "apps/landing/src/content",
  "apps/landing/src/components",
  "apps/landing/src/app",
  "apps/landing/src/lib",
  "examples",
];
const EXTENSIONS = /\.(mdx?|tsx?|mjs|js|json)$/;
const SKIP_DIRS = new Set(["node_modules", "dist", ".next", ".source"]);

// Files that name deprecated ids on purpose. Keep each entry justified.
const ALLOW_DEPRECATED = new Set([
  // Explains deprecation using real deprecated ids as the example.
  "apps/landing/src/content/docs/(docs)/versions.mdx",
  // Doc comment illustrating a replacedBy chain.
  "apps/landing/src/lib/catalog-lifecycle.ts",
  // Ask AI prompt: explains that @2 and @3 of a pipe coexist.
  "apps/landing/src/app/api/chat/ask-ai-instructions.md",
]);

// A pipe or search id: lowercase segments joined by ":" and a version.
const ID_PATTERN = /(?<![\w:/.-])([a-z][a-z0-9_]*(?::[a-z0-9_]+)+@\d+)(?![\w.-])/g;

const known = new Map();
for (const [id, entry] of Object.entries(base.pipeCatalog)) known.set(id, entry);
for (const [id, entry] of Object.entries(base.searchCatalog)) known.set(id, entry);
// Sheet and report effects share the id format and have no lifecycle.
for (const id of [...base.SHEET_EFFECT_IDS, ...base.REPORT_EFFECT_IDS]) {
  if (!known.has(id)) known.set(id, { lifecycle: null });
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (EXTENSIONS.test(name)) yield full;
  }
}

const problems = [];
for (const root of ROOTS) {
  for (const file of walk(join(repoRoot, root))) {
    const rel = relative(repoRoot, file);
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      for (const [, id] of line.matchAll(ID_PATTERN)) {
        const entry = known.get(id);
        if (!entry) {
          problems.push(`${rel}:${i + 1}  ${id} is not in the pipe, search, or effect catalog`);
        } else if (entry.lifecycle?.deprecatedOn && !ALLOW_DEPRECATED.has(rel)) {
          const next = entry.lifecycle.replacedBy
            ? `, replaced by ${entry.lifecycle.replacedBy}`
            : "";
          problems.push(
            `${rel}:${i + 1}  ${id} is deprecated since ${entry.lifecycle.deprecatedOn}${next}`,
          );
        }
      }
    });
  }
}

if (problems.length) {
  console.error(`Found ${problems.length} stale catalog id(s):\n`);
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("All pipe and search ids are current.");
