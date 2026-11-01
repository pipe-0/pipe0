/**
 * Writes the social cards into the build output. Runs after `vite build`
 * because Start's prerenderer reads every response as text, which corrupts
 * PNGs. Cards never change between deploys, so no Worker renders them.
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { generate, getImageResponseOptions } from "../src/og/generate";
import { renderPng } from "../src/og/render";
import { resourcesImage } from "../src/og/resources-image";
import { siteImage } from "../src/og/site-image";

const OUT = "dist/client";
const MANIFEST = join(OUT, "og-manifest.json");

type Card = { path: string; title: string; description?: string };

async function write(path: string, png: Uint8Array) {
  const file = join(OUT, decodeURIComponent(path));
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, png);
}

const cards: Card[] = JSON.parse(await readFile(MANIFEST, "utf8"));
const options = await getImageResponseOptions();

await write("/opengraph-image", await siteImage());
await write("/resources/opengraph-image-5fam9d", await resourcesImage());
for (const { path, title, description } of cards) {
  await write(path, await renderPng(generate({ title, description }), options));
}

await rm(MANIFEST);
console.log(`Wrote ${cards.length + 2} social cards`);
