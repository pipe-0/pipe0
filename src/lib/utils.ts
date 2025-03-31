import { PipeEntry } from "@/app/resources/pipe-catalog/get-pipes";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  return process.env.NODE_ENV === "production"
    ? "https://pipe0.com"
    : "http://localhost:3000";
}

export function getLastPipeVersionEntry(
  entry: PipeEntry
): PipeEntry["children"][number] | undefined {
  const lastChild = entry.children[entry.children.length - 1];
  return lastChild;
}
