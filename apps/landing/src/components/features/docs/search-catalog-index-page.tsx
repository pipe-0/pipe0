import { getSearchEntryMap } from "@/lib/get-searches";
import { SearchCatalogIndex } from "@/components/features/docs/searches-catalog-index";
import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import { Suspense } from "react";

export async function SearchCatalogIndexPage() {
  const searchEntryMap = await getSearchEntryMap();

  return (
    <DocsPage
      tableOfContent={{ enabled: false, component: null }}
      className="lg:col-[main-start/toc-end] max-w-6xl"
    >
      <div className="mb-12 min-h-screen">
        <Suspense>
          <SearchCatalogIndex searchEntryMap={searchEntryMap} />
        </Suspense>
      </div>
    </DocsPage>
  );
}
