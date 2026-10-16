#!/usr/bin/env node
// Builds the ZIP uploaded to the OpenAI Plugins dashboard (ChatGPT and Codex).
// MCP-only package: the Codex manifest, the MCP config, assets, README, and LICENSE.
// Run with `node scripts/package.mjs`; requires the `zip` CLI.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const INCLUDE = [".codex-plugin", ".mcp.json", "assets", "README.md", "LICENSE"];

const listFiles = (rel) => {
  const abs = join(root, rel);
  if (!existsSync(abs)) throw new Error(`${rel} is missing`);
  if (!statSync(abs).isDirectory()) return [rel];
  return readdirSync(abs).flatMap((name) => listFiles(join(rel, name)));
};

const files = INCLUDE.flatMap(listFiles).filter((f) => !f.split("/").pop().startsWith(".DS_Store"));

const { version } = JSON.parse(readFileSync(join(root, ".codex-plugin/plugin.json"), "utf8"));
const out = join(root, "dist", `pipe0-${version}.zip`);
mkdirSync(dirname(out), { recursive: true });
rmSync(out, { force: true });
execFileSync("zip", ["-X", "-q", out, ...files], { cwd: root, stdio: "inherit" });

console.log(`${relative(root, out)} (${files.length} files):\n${files.map((f) => `  ${f}`).join("\n")}`);
