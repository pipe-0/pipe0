import { getSearchEntryMap } from "@/app/resources/search-catalog/get-searches";
import { SearchCatalogIndex } from "@/components/features/docs/searches-catalog-index";
import { Suspense } from "react";

export const metadata = {
  title: "Pipe Catalog",
};

export default async function PipeCatalog() {
  const searchEntryMap = await getSearchEntryMap();

  return (
    <div
      data-pagefind-ignore="all"
      className="mx-auto px-6 mb-12 min-h-screen max-w-2xl"
      style={{ maxWidth: "var(--nextra-content-width)" }}
    >
      <Suspense>
        <SearchCatalogIndex searchEntryMap={searchEntryMap} />
      </Suspense>
    </div>
  );
}
