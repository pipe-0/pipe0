import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { docsPage, docsTree } from "./docs.server";

export const getDocsTree = createServerFn({ method: "GET" }).handler(() =>
  docsTree(),
);

export const getDocsPage = createServerFn({ method: "GET" })
  .validator((slugs: string[]) => slugs)
  .handler(async ({ data }) => {
    const page = await docsPage(data);
    if (!page) throw notFound();
    return page;
  });
