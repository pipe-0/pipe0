#!/usr/bin/env node
// Structural checks for the pipe0 OpenAI plugin. No dependencies; run with `node scripts/validate.mjs`.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const fail = (msg) => errors.push(msg);
const readJson = (rel) => {
  try {
    return JSON.parse(readFileSync(join(root, rel), "utf8"));
  } catch (e) {
    fail(`${rel}: ${e.message}`);
    return null;
  }
};

const NAME_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
const SEMVER_RE = /^\d+\.\d+\.\d+$/;
const MCP_URL = "https://api.pipe0.com/v1/mcp";

const rel = ".codex-plugin/plugin.json";
const m = readJson(rel);
const mcp = readJson(".mcp.json");

if (m) {
  if (!NAME_RE.test(m.name ?? "")) fail(`${rel}: name must be kebab-case, got ${JSON.stringify(m.name)}`);
  if (!SEMVER_RE.test(m.version ?? "")) fail(`${rel}: version must be semver, got ${JSON.stringify(m.version)}`);
  if (!m.description) fail(`${rel}: description is required`);
  if (!m.license) fail(`${rel}: license must be stated`);
  if (!m.author?.name) fail(`${rel}: author.name is required`);
  if (m.skills) fail(`${rel}: the package is MCP-only; do not declare skills`);
  if (m.mcpServers !== "./.mcp.json") fail(`${rel}: mcpServers must be "./.mcp.json"`);

  const ui = m.interface ?? {};
  for (const [key, max] of [["displayName", 30], ["shortDescription", 30], ["longDescription", 4000], ["developerName", 80], ["category", 80]]) {
    if (!ui[key]) fail(`${rel}: interface.${key} is required`);
    else if (ui[key].length > max) fail(`${rel}: interface.${key} is ${ui[key].length} characters (max ${max})`);
  }
  if (ui.developerName && ui.developerName !== m.author?.name) fail(`${rel}: interface.developerName must match author.name`);
  for (const key of ["websiteURL", "supportURL", "privacyPolicyURL", "termsOfServiceURL"]) {
    if (!/^https:\/\//.test(ui[key] ?? "")) fail(`${rel}: interface.${key} must be an https URL`);
  }
  for (const key of ["logo", "composerIcon"]) {
    if (!ui[key]) fail(`${rel}: interface.${key} is required`);
    else if (!existsSync(join(root, ui[key]))) fail(`${rel}: interface.${key} ${ui[key]} does not exist`);
  }
}

if (mcp) {
  const server = mcp.mcpServers?.pipe0;
  if (!server) fail(".mcp.json: mcpServers.pipe0 is missing");
  else {
    if (server.type !== "http") fail(`.mcp.json: pipe0 server type must be "http", got ${JSON.stringify(server.type)}`);
    if (server.url !== MCP_URL) fail(`.mcp.json: pipe0 server url must be ${MCP_URL}`);
    if (server.headers) fail(".mcp.json: the server uses OAuth; do not ship static headers");
  }
}

const changelog = existsSync(join(root, "CHANGELOG.md")) ? readFileSync(join(root, "CHANGELOG.md"), "utf8") : "";
if (m?.version && !changelog.includes(`## ${m.version}`)) fail(`CHANGELOG.md has no entry for ${m.version}`);
for (const f of ["README.md", "LICENSE"]) if (!existsSync(join(root, f))) fail(`${f} is missing`);

if (errors.length) {
  console.error("pipe0 plugin validation failed:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log(`pipe0 plugin ${m.version}: all checks passed`);
