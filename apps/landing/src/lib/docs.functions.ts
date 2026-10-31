import { createIsomorphicFn } from "@tanstack/react-start";
import { found, readData } from "./static-data";

export const getDocsTree = createIsomorphicFn()
  .server(async () => (await import("./docs.server")).docsTree())
  .client(() => readData("docs-tree"));

export const getDocsPage = createIsomorphicFn()
  .server(async (slugs: string[]) => {
    const { docsPage } = await import("./docs.server");
    return found(await docsPage(slugs));
  })
  .client((slugs) => readData("docs", ...slugs));
