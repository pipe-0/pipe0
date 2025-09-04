import { getPipeEntryMap } from "@/app/resources/pipe-catalog/get-pipes";
import { PipeCatalogIndex } from "@/components/features/docs/pipes-catalog-index";
import { Suspense } from "react";

export const metadata = {
  title: "Pipe Catalog",
};

export default async function PipeCatalog() {
  const pipeEntryMap = await getPipeEntryMap();

  return (
    <div
      className="mx-auto px-6 mb-12 min-h-screen max-w-2xl"
      style={{ maxWidth: "var(--nextra-content-width)" }}
    >
      <Suspense>
        <PipeCatalogIndex pipeEntryMap={pipeEntryMap} />
      </Suspense>
    </div>
  );
}
