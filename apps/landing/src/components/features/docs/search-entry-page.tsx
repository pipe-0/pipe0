import { SearchCatalogHeader } from "@/components/search-catalog-header";
import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import type { ComponentProps } from "react";

export function SearchEntryPage(
  props: ComponentProps<typeof SearchCatalogHeader>,
) {
  return (
    <DocsPage
      tableOfContent={{ enabled: false, component: null }}
      footer={{ enabled: false }}
      breadcrumb={{ enabled: false }}
      className="lg:col-[main-start/toc-end] max-w-6xl"
    >
      <SearchCatalogHeader {...props} />
    </DocsPage>
  );
}
