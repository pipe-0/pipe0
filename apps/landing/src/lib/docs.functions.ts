import { notFound } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import type { DocsPageData, DocsTree } from "./docs.server";
import { readData } from "./static-data";

export const getDocsTree = createIsomorphicFn()
  .server(async () => (await import("./docs.server")).docsTree())
  .client(() => readData<DocsTree>("docs-tree"));

export const getDocsPage = createIsomorphicFn()
  .server(async (slugs: string[]) => {
    const { docsPage } = await import("./docs.server");
    const page = await docsPage(slugs);
    if (!page) throw notFound();
    return page;
  })
  .client((slugs) => readData<DocsPageData>("docs", ...slugs));
