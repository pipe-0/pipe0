import { PipeEntry } from "@/app/resources/pipe-catalog/get-pipes";
import {
  PipeId,
  pipeMetaCatalog,
  PipeMetaCatalogEntry,
} from "@pipe0/client-sdk";
import { clsx, type ClassValue } from "clsx";
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

function getPipeVersion(pipeId: PipeId): number {
  const regex = /.*@(\d+)/;
  const matches = pipeId.match(regex);
  const versionMatch = (matches || [])[1];
  if (!versionMatch) throw new Error("No pipe version found");

  return Number(versionMatch);
}

type CostPerProvider = {
  [provider: string]: {
    credits: number;
  };
};

export function getLowestCreditAmount(
  costPerProvider: CostPerProvider
): number {
  const creditValues = Object.values(costPerProvider).map((p) => p.credits);
  return Math.min(...creditValues);
}

/**
 * Sort pipes according to their base pipe.
 *
 * The arrays are sorted in descending order (the pipe with the highest verison comes first)
 */
export function sortPipeCatalogByBasePipe() {
  const res: Record<string, (PipeMetaCatalogEntry & { pipeId: PipeId })[]> = {};

  for (const [pipeId, pipeEntry] of Object.entries(pipeMetaCatalog)) {
    const { basePipe } = pipeEntry;

    res[basePipe] = [
      ...(res?.[basePipe] || []),
      { ...pipeEntry, pipeId: pipeId as PipeId },
    ].sort((a, b) => {
      const versionA = getPipeVersion(a.pipeId);
      const versionB = getPipeVersion(b.pipeId);

      // return in decending order
      return versionB - versionA;
    });
  }

  return res;
}

export function sortPipeCatalog() {
  const sortedByBase = sortPipeCatalogByBasePipe();

  // Record<FieldName, Entry>
  const byInputField: Record<
    string,
    (PipeMetaCatalogEntry & { pipeId: PipeId })[]
  > = {};
  const byOutputField: Record<
    string,
    (PipeMetaCatalogEntry & { pipeId: PipeId })[]
  > = {};
  const byTag: Record<string, (PipeMetaCatalogEntry & { pipeId: PipeId })[]> =
    {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_basePipeId, catalogEntry] of Object.entries(sortedByBase)) {
    const entry = catalogEntry[0];
    if (!entry) throw new Error("Found empty entry");

    for (const outputField of entry.outputFields) {
      if (byOutputField[outputField]) {
        byOutputField[outputField].push(entry);
      } else {
        byOutputField[outputField] = [entry];
      }
    }

    for (const { fields } of entry.inputGroups || []) {
      for (const [fieldName] of Object.entries(fields)) {
        if (byInputField[fieldName]) {
          byInputField[fieldName].push(entry);
        } else {
          byInputField[fieldName] = [entry];
        }
      }
    }

    for (const tag of entry.tags) {
      if (byTag[tag]) {
        byTag[tag].push(entry);
      } else {
        byTag[tag] = [entry];
      }
    }
  }

  return { byInputField, byOutputField, byTag, byBasePipe: sortedByBase };
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
