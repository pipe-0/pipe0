#!/usr/bin/env node
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SCOPE = "@pipe0/";
const workspaceFile = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "pnpm-workspace.yaml",
);

const original = readFileSync(workspaceFile, "utf8");

const entryRe = new RegExp(
  `^(\\s*)(["']?)(${SCOPE.replace("/", "\\/")}[^"'\\s:]+)\\2(\\s*:\\s*)(["'])([~^]?)([^"']+)\\5`,
  "gm",
);

const matches = [...original.matchAll(entryRe)];

if (matches.length === 0) {
  console.log(`No ${SCOPE}* entries found in catalog.`);
  process.exit(0);
}

const updates = [];
for (const m of matches) {
  const pkg = m[3];
  const currentPrefix = m[6];
  const currentVersion = m[7];
  let latest;
  try {
    latest = execSync(`npm view ${pkg} version`, { encoding: "utf8" }).trim();
  } catch (err) {
    console.error(`Failed to fetch latest version for ${pkg}:`, err.message);
    process.exit(1);
  }
  updates.push({ pkg, currentPrefix, currentVersion, latest });
}

let updated = original;
let changed = 0;
for (const { pkg, currentPrefix, currentVersion, latest } of updates) {
  if (currentVersion === latest) {
    console.log(`= ${pkg} ${currentPrefix}${currentVersion} (up to date)`);
    continue;
  }
  const replaceRe = new RegExp(
    `(["']${pkg.replace("/", "\\/")}["']\\s*:\\s*["'])[~^]?[^"']+(["'])`,
  );
  updated = updated.replace(replaceRe, `$1${currentPrefix}${latest}$2`);
  console.log(
    `↑ ${pkg} ${currentPrefix}${currentVersion} → ${currentPrefix}${latest}`,
  );
  changed++;
}

if (changed === 0) {
  console.log("\nAll up to date.");
  process.exit(0);
}

writeFileSync(workspaceFile, updated);
console.log(`\nUpdated ${changed} entr${changed === 1 ? "y" : "ies"}. Running pnpm install...`);
execSync("pnpm install", { stdio: "inherit" });
