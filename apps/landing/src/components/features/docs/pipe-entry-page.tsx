import { PipeCatalogHeader } from "@/components/pipe-catalog-header";
import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import type { ComponentProps } from "react";

export function PipeEntryPage(props: ComponentProps<typeof PipeCatalogHeader>) {
  return (
    <DocsPage
      tableOfContent={{ enabled: false, component: null }}
      footer={{ enabled: false }}
      className="lg:col-[main-start/toc-end] max-w-6xl"
      breadcrumb={{ enabled: false }}
    >
      <PipeCatalogHeader {...props} />
    </DocsPage>
  );
}
