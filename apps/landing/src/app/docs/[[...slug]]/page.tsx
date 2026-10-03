import { getPageImage, source } from "@/lib/source";
import {
  DocsBody,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { openapi, trimPreloaded } from "@/lib/openapi";
import { APIPage } from "@/components/api-page";
import type { OpenAPIPageProps_Preloaded } from "fumadocs-openapi/ui";
import { LLMCopyButton } from "@/components/page-actions";
import { StraightToc } from "@/components/features/docs/straight-toc";
import { PipeEntryPage } from "@/components/features/docs/pipe-entry-page";
import { SearchCatalogIndexPage } from "@/components/features/docs/search-catalog-index-page";
import { SearchEntryPage } from "@/components/features/docs/search-entry-page";
import { PipeCatalogIndexPage } from "@/components/features/docs/pipe-catalog-index-page";
import { getBreadcrumbItems } from "fumadocs-core/breadcrumb";
import { getPipeEntry, getSearchEntry, PipeId, SearchId } from "@pipe0/base";
import {
  resolveCurrentPipe,
  resolveCurrentSearch,
} from "@/lib/catalog-lifecycle";
import {
  JsonLd,
  breadcrumbJsonLd,
  techArticleJsonLd,
} from "@/components/seo/json-ld";

function decodeSlug(slug: string[] | undefined): string[] | undefined {
  return slug?.map((s) => decodeURIComponent(s));
}

/** Catalog entry titles are "Label (<pipe_id>)"; SERPs read better without the id. */
function stripIdSuffix(title: string, id: string): string {
  return title.replace(` (${id})`, "");
}

/** Keep the entry description, move the id (and the product keywords) into the snippet tail. */
function withCatalogSuffix(
  description: string | undefined,
  suffix: string,
): string {
  if (!description) return suffix;
  const trimmed =
    description.length > 110
      ? `${description.slice(0, 110).trimEnd()}...`
      : description;
  const sep = /[.!?]$/.test(trimmed) || trimmed.endsWith("...") ? " " : ". ";
  return `${trimmed}${sep}${suffix}`;
}

function deprecatedDescription(id: string, successor: string | null): string {
  return successor
    ? `${id} is deprecated. Do not use it in new work; use ${successor} instead.`
    : `${id} is deprecated and has no current replacement. Do not use it in new work.`;
}

function structuredDataFor(page: NonNullable<ReturnType<typeof source.getPage>>) {
  const items = getBreadcrumbItems(page.url, source.getPageTree(), {
    includePage: true,
  }).filter((item) => typeof item.name === "string") as {
    name: string;
    url?: string;
  }[];
  const lastModified =
    "lastModified" in page.data && page.data.lastModified
      ? new Date(page.data.lastModified as Date | number)
      : undefined;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Docs", url: "/docs" }, ...items])}
      />
      <JsonLd
        data={techArticleJsonLd({
          title: page.data.title,
          description: page.data.description,
          url: page.url,
          dateModified: lastModified,
        })}
      />
    </>
  );
}

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(decodeSlug(params.slug));
  if (!page) notFound();

  const data = page.data as any;
  const structuredData = structuredDataFor(page);

  // Virtual pipe catalog index
  if (data._virtualType === "pipe-catalog-index") {
    return (
      <>
        {structuredData}
        <PipeCatalogIndexPage />
      </>
    );
  }

  // Virtual pipe entry
  if (data._virtualType === "pipe-entry") {
    return (
      <>
        {structuredData}
        <PipeEntryPage pipeId={data._pipeId} />
      </>
    );
  }

  // Virtual search catalog index
  if (data._virtualType === "search-catalog-index") {
    return (
      <>
        {structuredData}
        <SearchCatalogIndexPage />
      </>
    );
  }

  // Virtual search entry
  if (data._virtualType === "search-entry") {
    return (
      <>
        {structuredData}
        <SearchEntryPage searchId={data._searchId} />
      </>
    );
  }

  // Standard MDX page (existing code)
  const MDX = (page.data as { body?: typeof page.data.body }).body;
  if (!MDX) notFound();

  // API reference pages embed <APIPage>, a client component that can only
  // render documents preloaded on the server (declared in the page's
  // `_openapi.preload` frontmatter).
  const { preloaded } = data._openapi
    ? // The loader's page union includes the virtual catalog pages, which
      // don't carry doc data — but the `_openapi` guard means this branch only
      // ever sees real docs pages.
      await openapi.preloadOpenAPIPage(
        page as Parameters<typeof openapi.preloadOpenAPIPage>[0],
      )
    : { preloaded: undefined };

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      footer={{ enabled: false }}
      tableOfContent={{ component: <StraightToc /> }}
    >
      {structuredData}
      {/* Page description is intentionally not rendered in the docs body — it
          is kept for SEO/metadata and card previews only. */}
      <div className="flex flex-row items-start justify-between gap-4">
        <DocsTitle>{page.data.title}</DocsTitle>
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
            ...(preloaded && {
              APIPage: (
                props: Omit<OpenAPIPageProps_Preloaded, "preloaded">,
              ) => (
                <APIPage
                  {...props}
                  preloaded={trimPreloaded(
                    preloaded,
                    props.document,
                    props.operations,
                  )}
                />
              ),
            }),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

// Every param is enumerated by generateStaticParams, so there is nothing to
// render on demand. Pinning this keeps unknown paths on the 404 route instead
// of waking a function for them.
export const dynamicParams = false;

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(decodeSlug(params.slug));
  if (!page) notFound();

  const data = page.data as any;
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

  return {
    title,
    description,
    alternates: { canonical: page.url },
    openGraph: {
      title,
      description,
      url: page.url,
      images: getPageImage(page).url,
    },
  };
}
