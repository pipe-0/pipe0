import { APIPage } from "@/components/api-page";
import { PageNav } from "@/components/features/docs/page-nav";
import { StraightToc } from "@/components/features/docs/straight-toc";
import { LLMCopyButton } from "@/components/page-actions";
import type { DocsPageData } from "@/lib/docs.server";
import { getMDXComponents } from "@/mdx-components";
import browserCollections from "collections/browser";
import { DocsBody, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import type { OpenAPIPageProps_Preloaded } from "fumadocs-openapi/ui";

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
          <Mdx
            components={getMDXComponents({
              ...(page.preloaded && {
                APIPage: (props: Omit<OpenAPIPageProps_Preloaded, "preloaded">) => (
                  <APIPage {...props} preloaded={page.preloaded as never} />
                ),
              }),
            })}
          />
          <PageNav {...page.nav} />
        </DocsBody>
      </DocsPage>
    );
  },
});
