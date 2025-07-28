import { PipeId, pipeCatalog } from "@pipe0/client-sdk";
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
      pipeId: PipeId;
      root: string;
      filePath: string;
      description?: string;
      vendor?: string;
      other?: {
        pipeId: PipeId;
      };
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
    .map((p) => {
      return {
        ...p,
        children: p.children
          .filter((e) => e.name !== "index")
          .map((c) => {
            const pipeId = c.frontMatter.other?.pipeId || c.frontMatter.pipeId;
            const catalogEntry = pipeCatalog[pipeId];

            if (!catalogEntry) {
              throw new Error(`Pipe "${pipeId}" not found in pipeMetaCatalog`);
            }

            return {
              ...c,
              ...catalogEntry,
            };
          }),
      };
    })
    .sort((a, b) => +a.name - +b.name);
}

export type PipeEntryMap = Record<PipeId, PipeEntry["children"][number]>;

export async function getPipeEntryMap() {
  const result = {} as PipeEntryMap;

  const { directories } = normalizePages({
    list: await getPageMap("/resources/pipe-catalog"),
    route: "/resources/pipe-catalog",
  }) as unknown as { directories: PipeEntry[] };

  directories.forEach((p) => {
    p.children?.forEach((c) => {
      if (c.frontMatter.other?.pipeId) {
        result[c.frontMatter.other.pipeId] = c;
      }
    });
  });

  return result;
}
