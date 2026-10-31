import { notFound } from "@tanstack/react-router";

/**
 * Reads a loader's result from the file the build wrote for it, at the key the
 * route `/data/{$}.json` serves. Every public page is prerendered, so its data
 * never changes between deploys. Client navigation gets it from the asset layer
 * and never wakes the Worker, where loading `@pipe0/base` takes two seconds and
 * costs the isolate.
 *
 * Typed `never` so an isomorphic function keeps its `.server()` return type:
 * this file is that result. It went through JSON, so a value must not rely on
 * being a Date.
 */
export async function readData(...key: string[]): Promise<never> {
  const path = key.map(encodeURIComponent).join("/");
  const response = await fetch(`/data/${path}.json`);
  if (response.status === 404) throw notFound();
  if (!response.ok) throw new Error(`/data/${path}.json: ${response.status}`);
  return (await response.json()) as never;
}

/** For the server side of a loader, which 404s when the content is missing. */
export function found<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw notFound();
  return value;
}
