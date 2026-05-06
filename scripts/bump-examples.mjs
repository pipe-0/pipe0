#!/usr/bin/env node
import { execSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCOPE = "@pipe0/";
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const examplesRoot = join(repoRoot, "examples");

function findPackageJsons(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...findPackageJsons(full));
    } else if (entry === "package.json") {
      out.push(full);
    }
  }
  return out;
}

const pkgFiles = findPackageJsons(examplesRoot);
if (pkgFiles.length === 0) {
  console.log("No example package.json files found.");
  process.exit(0);
}

const depFields = ["dependencies", "devDependencies", "peerDependencies"];
const referenced = new Set();
const parsed = pkgFiles.map((file) => {
  const json = JSON.parse(readFileSync(file, "utf8"));
  for (const field of depFields) {
    const deps = json[field];
    if (!deps) continue;
    for (const name of Object.keys(deps)) {
      if (name.startsWith(SCOPE)) referenced.add(name);
    }
  }
  return { file, json };
});

if (referenced.size === 0) {
  console.log(`No ${SCOPE}* dependencies found in examples.`);
  process.exit(0);
}

const latestByPkg = new Map();
for (const pkg of referenced) {
  try {
    const version = execSync(`npm view ${pkg} version`, { encoding: "utf8" }).trim();
    latestByPkg.set(pkg, version);
  } catch (err) {
    console.error(`Failed to fetch latest version for ${pkg}:`, err.message);
    process.exit(1);
  }
}

let totalChanged = 0;
const skipped = [];

for (const { file, json } of parsed) {
  let original = readFileSync(file, "utf8");
  let updated = original;
  const relPath = file.slice(repoRoot.length + 1);

  for (const field of depFields) {
    const deps = json[field];
    if (!deps) continue;
    for (const [name, current] of Object.entries(deps)) {
      if (!name.startsWith(SCOPE)) continue;
      const latest = latestByPkg.get(name);
      if (current === "workspace:*" || current.startsWith("workspace:") || current === "catalog:" || current.startsWith("catalog:")) {
        skipped.push(`${relPath}: ${name} = "${current}" (skipped — non-version reference)`);
        continue;
      }
      const prefixMatch = current.match(/^([~^]?)(.+)$/);
      const prefix = current === "latest" ? "" : prefixMatch?.[1] ?? "";
      const currentVersion = current === "latest" ? "latest" : prefixMatch?.[2] ?? current;
      const next = `${prefix}${latest}`;
      if (current === next) {
        console.log(`= ${relPath}: ${name} ${current} (up to date)`);
        continue;
      }
      const escapedName = name.replace(/[/.@]/g, (c) => `\\${c}`);
      const replaceRe = new RegExp(
        `(["']${escapedName}["']\\s*:\\s*["'])${current.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(["'])`,
      );
      const before = updated;
      updated = updated.replace(replaceRe, `$1${next}$2`);
      if (updated === before) {
        console.error(`Failed to rewrite ${name} in ${relPath}`);
        process.exit(1);
      }
      console.log(`↑ ${relPath}: ${name} ${current} → ${next}`);
      totalChanged++;
    }
  }

  if (updated !== original) {
    writeFileSync(file, updated);
  }
}

if (skipped.length > 0) {
  console.log("\nSkipped:");
  for (const line of skipped) console.log(`  ${line}`);
}

if (totalChanged === 0) {
  console.log("\nAll up to date.");
  process.exit(0);
}

console.log(`\nUpdated ${totalChanged} entr${totalChanged === 1 ? "y" : "ies"}. Running pnpm install...`);
execSync("pnpm install", { stdio: "inherit", cwd: repoRoot });
