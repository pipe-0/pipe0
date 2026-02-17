import { PipeCatalogIndex } from "@/components/features/docs/pipes-catalog-index";
import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import { Suspense } from "react";

export async function PipeCatalogIndexPage() {
  return (
    <DocsPage
      tableOfContent={{ enabled: false, component: null }}
      className="lg:col-[main-start/toc-end] max-w-6xl"
    >
      <div className="mb-12 min-h-screen">
        <Suspense>
          <PipeCatalogIndex />
        </Suspense>
      </div>
    </DocsPage>
  );
}
