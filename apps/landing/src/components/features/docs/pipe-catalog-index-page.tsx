import { PageNav, type PageNavItem } from "@/components/features/docs/page-nav";
import { PipeCatalogIndex } from "@/components/features/docs/pipes-catalog-index";
import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import { Suspense } from "react";

export function PipeCatalogIndexPage({
  nav,
}: {
  nav: { previous?: PageNavItem; next?: PageNavItem };
}) {
  return (
    <DocsPage
      tableOfContent={{ enabled: false, component: null }}
      footer={{ enabled: false }}
      className="lg:col-[main-start/toc-end] max-w-[1200px]"
    >
      <div className="mb-12 min-h-screen">
        <Suspense>
          <PipeCatalogIndex />
        </Suspense>
        <PageNav {...nav} />
      </div>
    </DocsPage>
  );
}
