import { PipeEntry } from "@/app/resources/pipe-catalog/get-pipes";
import { PipeId } from "@pipe0/client-sdk";
import { clsx, type ClassValue } from "clsx";
import { Metadata } from "next";
import { toast } from "sonner";
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

export function formatCredits(credits: number | string | null) {
  const c = credits ? Number(credits) : 0;
  const fixed = c.toFixed(1);
  return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
}

export const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
  toast("Copied to clipboard ✅");
};

export function generatePipeMetadata(pipeId: PipeId): Metadata {
  return {
    title: `Pipe0: ${pipeId}`,
    description: `Documentation for the data enrichment function with the id '${pipeId}'`,
    other: {
      pipeId: pipeId,
    },
  };
}
