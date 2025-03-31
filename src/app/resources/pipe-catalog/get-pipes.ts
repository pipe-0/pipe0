import { getLastPipeVersionEntry } from "@/lib/utils";
import { normalizePages } from "nextra/normalize-pages";
import { getPageMap } from "nextra/page-map";

export type PipeEntry = {
  name: string;
  type: string;
  route: string;
  children: {
    name: string;
    route: string;
    frontMatter: {
      title: string;
      pipe: string;
      root: string;
      filePath: string;
      tags?: string[];
      description?: string;
      vendor?: string;
    };
  }[];
};

export async function getPipeEntries() {
  const { directories } = normalizePages({
    list: await getPageMap("/resources/pipe-catalog"),
    route: "/resources/pipe-catalog",
  }) as unknown as { directories: PipeEntry[] };
  return directories
    .filter(
      (pipeEntry) => pipeEntry.name !== "index" && pipeEntry.type !== "page"
    )
    .map((p) => ({
      ...p,
      children: p.children.filter((e) => e.name !== "index"),
    }))
    .sort((a, b) => +a.name - +b.name);
}

export async function getTags() {
  const pipeEntries = await getPipeEntries();

  const tags = pipeEntries.flatMap((pipe) => {
    const lastVersion = getLastPipeVersionEntry(pipe);
    return lastVersion?.frontMatter?.tags || [];
  });
  return tags;
}
