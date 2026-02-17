import { SearchPage } from "@/components/features/docs/search-page";
import { SearchCatalogHeader } from "@/components/search-catalog-header";
import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import type { SearchId } from "@pipe0/ops";

export async function SearchEntryPage({ searchId }: { searchId: string }) {
  return (
    <DocsPage
      tableOfContent={{ enabled: false, component: null }}
      breadcrumb={{ enabled: false }}
      className="lg:col-[main-start/toc-end] max-w-6xl"
    >
      <SearchPage searchId={searchId as SearchId}>
        <SearchCatalogHeader searchId={searchId as SearchId} />
      </SearchPage>
    </DocsPage>
  );
}
