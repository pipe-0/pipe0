import { notFound } from "@tanstack/react-router";

/**
 * Reads what the build prerendered at `/data/{$}.json`. The asset layer answers
 * these, so client navigation never wakes the Worker, where loading
 * `@pipe0/base` takes two seconds and costs the isolate.
 */
export async function readData<T>(...key: string[]): Promise<T> {
  const path = key.map(encodeURIComponent).join("/");
  const response = await fetch(`/data/${path}.json`);
  if (response.status === 404) throw notFound();
  if (!response.ok) throw new Error(`/data/${path}.json: ${response.status}`);
  return response.json();
}
