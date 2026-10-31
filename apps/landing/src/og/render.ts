import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import type { ReactNode } from "react";
import satori, { type SatoriOptions } from "satori";

const wasm = readFile(
  createRequire(import.meta.url).resolve("@resvg/resvg-wasm/index_bg.wasm"),
).then((bytes) => initWasm(bytes));

/** Satori and resvg at the versions next/og shipped, so cards render the same. */
export async function renderPng(
  element: ReactNode,
  options: { width: number; height: number; fonts: SatoriOptions["fonts"] },
) {
  await wasm;
  const svg = await satori(element, options);
  return new Resvg(svg, { fitTo: { mode: "width", value: options.width } })
    .render()
    .asPng();
}
