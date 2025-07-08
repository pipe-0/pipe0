import {
  getPipeEntries,
  getPipeEntryMap,
} from "@/app/resources/pipe-catalog/get-pipes";
import { IntegrationCatalog } from "@/components/features/docs/integration-catalog";
import { Suspense } from "react";

export const metadata = {
  title: "Pipe Catalog",
};

export default async function PipeCatalog() {
  const pipeEntryMap = await getPipeEntryMap();

  return (
    <div
      data-pagefind-ignore="all"
      className="mx-auto px-6 mb-12 min-h-screen max-w-2xl"
      style={{ maxWidth: "var(--nextra-content-width)" }}
    >
      <Suspense>
        <IntegrationCatalog pipeEntryMap={pipeEntryMap} />
      </Suspense>
    </div>
  );
}
