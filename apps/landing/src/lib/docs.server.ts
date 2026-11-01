import { breadcrumbJsonLd, techArticleJsonLd } from "@/components/seo/json-ld";
import type { CodeExample } from "@/lib/api-snippets.server";
import type {
  PipeEntryData,
  SearchEntryData,
} from "@/lib/catalog-entry.server";
import { openapi, trimPreloaded } from "@/lib/openapi.server";
import {
  docsImage,
  isCatalogEntry,
  source,
  type Page,
} from "@/lib/source.server";
import { getBreadcrumbItems } from "fumadocs-core/breadcrumb";

export async function docsTree() {
  return { pageTree: await source.serializePageTree(source.getPageTree()) };
}

export type DocsTree = Awaited<ReturnType<typeof docsTree>>;

function structuredData(page: Page, lastModified: Date | undefined) {
  const items = getBreadcrumbItems(page.url, source.getPageTree(), {
    includePage: true,
  }).filter((item) => typeof item.name === "string") as {
    name: string;
    url?: string;
  }[];
  return [
    breadcrumbJsonLd([{ name: "Docs", url: "/docs" }, ...items]),
    techArticleJsonLd({
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      dateModified: lastModified ? new Date(lastModified) : undefined,
    }),
  ];
}

/** The spec narrowed to the operations an API page renders. */
async function apiPageData(page: Page) {
  const api = page.data._openapi;
  if (!api) return undefined;
  const { preloaded } = await openapi.preloadOpenAPIPage(page);
  return trimPreloaded(preloaded, api.preload[0]!, api.operations);
}

export type DocsPageData = {
  url: string;
  /** The file the MDX client loader reads. */
  path: string;
  title: string;
  full?: boolean;
  /** Search-result title and description, which differ from the on-page heading. */
  snippet: { title: string; description?: string };
  image: string;
  jsonLd: Record<string, unknown>[];
  preloaded?: Awaited<ReturnType<typeof apiPageData>>;
  pipe?: PipeEntryData;
  search?: SearchEntryData;
  codeExamples?: CodeExample[];
};

async function mdxPage(page: Page): Promise<DocsPageData> {
  const { lastModified } = await page.data.load();
  return {
    url: page.url,
    path: page.path,
    title: page.data.title,
    full: page.data.full,
    snippet: {
      // SERP title only; the rendered H1 and sidebar keep "Quickstart".
      title:
        page.url === "/docs"
          ? "Data Enrichment API Documentation"
          : page.data.title,
      description: page.data.description,
    },
    image: docsImage(page.url),
    jsonLd: structuredData(page, lastModified),
    preloaded: await apiPageData(page),
  };
}

export async function docsPage(slugs: string[]) {
  const page = source.getPage(slugs);
  const data = page
    ? await mdxPage(page)
    : isCatalogEntry(slugs)
      ? (await import("@/lib/catalog.server")).catalogDocsPage(slugs)
      : null;
  // The file a client navigation reads went through JSON, so prerender does
  // too. It also drops the functions catalog form configs carry.
  return data && (JSON.parse(JSON.stringify(data)) as DocsPageData);
}
