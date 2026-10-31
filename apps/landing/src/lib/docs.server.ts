import { breadcrumbJsonLd, techArticleJsonLd } from "@/components/seo/json-ld";
import {
  resolveCurrentPipe,
  resolveCurrentSearch,
} from "@/lib/catalog-lifecycle";
import { getSearchEntryMap } from "@/lib/get-searches";
import { openapi, trimPreloaded } from "@/lib/openapi.server";
import { getPageImage, source } from "@/lib/source.server";
import {
  getPipeEntry,
  getSearchEntry,
  type PipeId,
  type SearchId,
} from "@pipe0/base";
import { getBreadcrumbItems } from "fumadocs-core/breadcrumb";
import type * as PageTree from "fumadocs-core/page-tree";
import { flattenTree, getPageTreeRoots } from "fumadocs-core/page-tree";
import { renderToString } from "react-dom/server.edge";

type Page = NonNullable<ReturnType<typeof source.getPage>>;

/**
 * The tree is serialized into every docs page and every navigation, and it
 * holds a node for each catalog entry. Page descriptions, `$ref` source paths
 * and page `$id`s are never read on the client: the sidebar shows names and
 * keys items by position, and the page footer that would show descriptions is
 * disabled. Folder descriptions stay; the tab dropdown renders them.
 */
function slimTree<T extends PageTree.Root | PageTree.Folder>(node: T): T {
  const { $ref: _ref, ...rest } = node as T & { $ref?: unknown };
  const out = {
    ...rest,
    children: node.children.map((child) =>
      child.type === "folder"
        ? slimTree(child)
        : child.type === "page"
          ? slimPage(child)
          : child,
    ),
  } as PageTree.Root | PageTree.Folder;
  if (out.type === "folder" && out.index) out.index = slimPage(out.index);
  if (out.type === "root" && out.fallback)
    out.fallback = slimTree(out.fallback);
  return out as T;
}

function slimPage(item: PageTree.Item): PageTree.Item {
  // Catalog entries are in the tree only so the sidebar can resolve its root
  // on detail pages (see catalogEntryTreePlugin). They never render, so the
  // URL is all they need.
  if (item.$id?.startsWith("catalog-entry:")) {
    return { type: "page", name: "", url: item.url };
  }
  const {
    description: _description,
    $ref: _ref,
    $id: _id,
    ...rest
  } = item as PageTree.Item & { $ref?: unknown };
  return rest;
}

export async function docsTree() {
  return {
    pageTree: await source.serializePageTree(slimTree(source.getPageTree())),
  };
}

/** Item names can be JSX (method labels, catalog icons), so they travel as HTML. */
const navItem = (item: PageTree.Item | undefined) =>
  item && { html: renderToString(item.name), url: item.url };

/**
 * Previous and next page within the current section (Documentation, Sheets,
 * API reference, …), skipping the hidden catalog-entry nodes the tree carries
 * for sidebar resolution (empty name).
 */
function neighbours(url: string) {
  for (const root of getPageTreeRoots(source.getPageTree())) {
    const pages = flattenTree(root.children).filter((item) =>
      typeof item.name === "string" ? item.name !== "" : true,
    );
    const index = pages.findIndex((item) => item.url === url);
    if (index === -1) continue;
    return {
      previous: navItem(pages[index - 1]),
      next: navItem(pages[index + 1]),
    };
  }
  return {};
}

/** Catalog entry titles are "Label (<pipe_id>)"; SERPs read better without the id. */
const stripIdSuffix = (title: string, id: string) =>
  title.replace(` (${id})`, "");

/** Keep the entry description, move the id (and the product keywords) into the snippet tail. */
function withCatalogSuffix(description: string | undefined, suffix: string) {
  if (!description) return suffix;
  const trimmed =
    description.length > 110
      ? `${description.slice(0, 110).trimEnd()}...`
      : description;
  const sep = /[.!?]$/.test(trimmed) || trimmed.endsWith("...") ? " " : ". ";
  return `${trimmed}${sep}${suffix}`;
}

function deprecatedDescription(id: string, successor: string | null) {
  return successor
    ? `${id} is deprecated. Do not use it in new work; use ${successor} instead.`
    : `${id} is deprecated and has no current replacement. Do not use it in new work.`;
}

/** Search-result title and description, which differ from the on-page heading. */
function searchSnippet(page: Page) {
  const data = page.data as Record<string, any>;
  let title: string = page.data.title;
  let description = page.data.description;

  if (page.url === "/docs") {
    // SERP title only; the rendered H1 and sidebar keep "Quickstart".
    title = "Data Enrichment API Documentation";
  } else if (data._virtualType === "pipe-entry" && data._pipeId) {
    const pipeId = data._pipeId as PipeId;
    if (getPipeEntry(pipeId).lifecycle?.deprecatedOn) {
      // Every version shares a label, so a deprecated page needs its id and
      // status in the title, and a description that names the replacement.
      title = `${page.data.title} (deprecated)`;
      description = deprecatedDescription(pipeId, resolveCurrentPipe(pipeId));
    } else {
      title = `${stripIdSuffix(page.data.title, pipeId)} pipe`;
      description = withCatalogSuffix(
        description,
        `Run ${pipeId} via the pipe0 data enrichment API or in Sheets.`,
      );
    }
  } else if (data._virtualType === "search-entry" && data._searchId) {
    const searchId = data._searchId as SearchId;
    if (getSearchEntry(searchId).lifecycle?.deprecatedOn) {
      title = `${page.data.title} (deprecated)`;
      description = deprecatedDescription(
        searchId,
        resolveCurrentSearch(searchId),
      );
    } else {
      title = stripIdSuffix(page.data.title, searchId);
      description = withCatalogSuffix(
        description,
        `Run ${searchId} via the pipe0 data enrichment API or in Sheets.`,
      );
    }
  }
  return { title, description };
}

/** `lastModified` sits behind load() on async collections; virtual pages have neither. */
async function lastModifiedOf(page: Page) {
  if (!("load" in page.data)) return undefined;
  const { lastModified } = await page.data.load();
  return lastModified ? new Date(lastModified) : undefined;
}

async function structuredData(page: Page) {
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
      dateModified: await lastModifiedOf(page),
    }),
  ];
}

/** The operations an API page renders, read from its <APIPage> tag. */
async function apiPageData(page: Page) {
  const data = page.data as Record<string, any>;
  if (!data._openapi) return undefined;
  const { preloaded } = await openapi.preloadOpenAPIPage(page as never);
  const text: string = (await data.getText("processed")).replaceAll(
    "&#x22;",
    '"',
  );
  const match = text.match(
    /<APIPage document="+([^"]+)"+ operations="(\[.*?\])"/,
  );
  if (!match) throw new Error(`${page.url} has no <APIPage>`);
  return trimPreloaded(preloaded, match[1]!, JSON.parse(match[2]!));
}

export async function docsPage(slugs: string[]) {
  const page = source.getPage(slugs.map((slug) => decodeURIComponent(slug)));
  if (!page) return null;
  const data = page.data as Record<string, any>;

  return {
    url: page.url,
    path: page.path,
    title: page.data.title,
    full: page.data.full as boolean | undefined,
    snippet: searchSnippet(page),
    image: getPageImage(page).url,
    jsonLd: await structuredData(page),
    nav: neighbours(page.url),
    virtualType: data._virtualType as string | undefined,
    pipeId: data._pipeId as string | undefined,
    searchId: data._searchId as string | undefined,
    preloaded: await apiPageData(page),
    searchEntryMap:
      data._virtualType === "search-catalog-index"
        ? await getSearchEntryMap()
        : undefined,
  };
}

export type DocsPageData = NonNullable<Awaited<ReturnType<typeof docsPage>>>;
