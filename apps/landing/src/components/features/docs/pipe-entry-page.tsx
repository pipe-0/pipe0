import { PipeCatalogHeader } from "@/components/pipe-catalog-header";
import type { PipeId } from "@pipe0/elements";
import { DocsPage } from "fumadocs-ui/layouts/docs/page";

export async function PipeEntryPage({ pipeId }: { pipeId: string }) {
  return (
    <DocsPage
      tableOfContent={{ enabled: false, component: null }}
      className="lg:col-[main-start/toc-end] max-w-6xl"
      breadcrumb={{ enabled: false }}
    >
      <PipeCatalogHeader pipeId={pipeId as PipeId} />
    </DocsPage>
  );
}
