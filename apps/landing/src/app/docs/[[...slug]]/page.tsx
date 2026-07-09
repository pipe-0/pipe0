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
import { openapi } from "@/lib/openapi";
import { APIPage } from "@/components/api-page";
import { LLMCopyButton } from "@/components/page-actions";
import { StraightToc } from "@/components/features/docs/straight-toc";
import { PipeEntryPage } from "@/components/features/docs/pipe-entry-page";
import { SearchCatalogIndexPage } from "@/components/features/docs/search-catalog-index-page";
import { SearchEntryPage } from "@/components/features/docs/search-entry-page";
import { PipeCatalogIndexPage } from "@/components/features/docs/pipe-catalog-index-page";

function decodeSlug(slug: string[] | undefined): string[] | undefined {
  return slug?.map((s) => decodeURIComponent(s));
}

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(decodeSlug(params.slug));
  if (!page) notFound();

  const data = page.data as any;

  // Virtual pipe catalog index
  if (data._virtualType === "pipe-catalog-index") {
    return <PipeCatalogIndexPage />;
  }

  // Virtual pipe entry
  if (data._virtualType === "pipe-entry") {
    return <PipeEntryPage pipeId={data._pipeId} />;
  }

  // Virtual search catalog index
  if (data._virtualType === "search-catalog-index") {
    return <SearchCatalogIndexPage />;
  }

  // Virtual search entry
  if (data._virtualType === "search-entry") {
    return <SearchEntryPage searchId={data._searchId} />;
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
              APIPage: (props: React.ComponentProps<typeof APIPage>) => (
                <APIPage {...props} preloaded={preloaded} />
              ),
            }),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(decodeSlug(params.slug));
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
