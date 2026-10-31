import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { latestLegalVersion } from "./legal-versions.server";
import { legal } from "./source.server";

export const getLegalPage = createServerFn({ method: "GET" })
  .validator((slugs: string[]) => slugs)
  .handler(({ data }) => {
    const page = data.length > 0 ? legal.getPage(data) : undefined;
    if (!page) throw notFound();
    return {
      path: page.path,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
    };
  });

export const getLatestLegalUrl = createServerFn({ method: "GET" })
  .validator((family: string) => family)
  .handler(({ data }) => {
    const page = latestLegalVersion(data);
    if (!page) throw notFound();
    return page.url;
  });
