import { APIPage } from "@/components/api-page";
import { PageNav } from "@/components/features/docs/page-nav";
import { StraightToc } from "@/components/features/docs/straight-toc";
import { LLMCopyButton } from "@/components/page-actions";
import type { DocsPageData } from "@/lib/docs.server";
import { getMDXComponents } from "@/components/mdx";
import browserCollections from "collections/browser";
import { DocsBody, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import type { OpenAPIPageProps_Preloaded } from "fumadocs-openapi/ui";
import { createContext, use } from "react";

const Preloaded = createContext<DocsPageData["preloaded"]>(undefined);

/** <APIPage> as MDX writes it: the operations come from the page's loader. */
function PreloadedAPIPage(
  props: Omit<OpenAPIPageProps_Preloaded, "preloaded">,
) {
  return <APIPage {...props} preloaded={use(Preloaded)!} />;
}

const mdxComponents = getMDXComponents({ APIPage: PreloadedAPIPage });

export const docsContent = browserCollections.docs.createClientLoader({
  id: "docs",
  component({ toc, default: Mdx }, { page }: { page: DocsPageData }) {
    return (
      <DocsPage
        toc={toc}
        full={page.full}
        footer={{ enabled: false }}
        tableOfContent={{ component: <StraightToc /> }}
      >
        {/* Page description is intentionally not rendered in the docs body — it
            is kept for SEO/metadata and card previews only. */}
        <div className="flex flex-row items-start justify-between gap-4">
          <DocsTitle>{page.title}</DocsTitle>
          <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
        </div>
        <DocsBody>
          <Preloaded value={page.preloaded}>
            <Mdx components={mdxComponents} />
          </Preloaded>
          <PageNav />
        </DocsBody>
      </DocsPage>
    );
  },
});
