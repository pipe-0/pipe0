import { PageNav } from "@/components/features/docs/page-nav";
import { getSearchEntryMap } from "@/lib/get-searches";
import { SearchCatalogIndex } from "@/components/features/docs/search-catalog-index";
import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import { Suspense } from "react";

export async function SearchCatalogIndexPage() {
  const searchEntryMap = await getSearchEntryMap();

  return (
    <DocsPage
      tableOfContent={{ enabled: false, component: null }}
      footer={{ enabled: false }}
      className="lg:col-[main-start/toc-end] max-w-[1200px]"
    >
      <div className="mb-12 min-h-screen">
        <Suspense>
          <SearchCatalogIndex searchEntryMap={searchEntryMap} />
        </Suspense>
        <PageNav url="/docs/search-catalog" />
      </div>
    </DocsPage>
  );
}
