import { getLastPipeVersionEntry } from "@/lib/utils";
import { PipeId, pipeMetaCatalog } from "@pipe0/client-sdk";
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
            const catalogEntry = pipeMetaCatalog[c.frontMatter.pipeId];

            if (!catalogEntry)
              throw new Error(
                `Pipe "${c.frontMatter.pipeId}" not found in pipeMetaCatalog`
              );

            return {
              ...c,
              ...catalogEntry,
            };
          }),
      };
    })
    .sort((a, b) => +a.name - +b.name);
}

export async function getTags() {
  const pipeEntries = await getPipeEntries();

  const tags = pipeEntries.flatMap((pipe) => {
    const lastVersion = getLastPipeVersionEntry(pipe);
    const pipeMetaEntry =
      pipeMetaCatalog[lastVersion?.frontMatter.pipeId as PipeId];
    return pipeMetaEntry.tags || [];
  });
  return tags;
}
