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
import { LLMCopyButton } from "@/components/page-actions";
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

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      footer={{ enabled: false }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      {/* Page description is intentionally not rendered in the docs body — it
          is kept for SEO/metadata and card previews only. */}
      <div className="flex flex-row gap-2 items-center -mt-2">
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
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
