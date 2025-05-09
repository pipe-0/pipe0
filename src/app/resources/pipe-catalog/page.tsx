import { getPipeEntries } from "@/app/resources/pipe-catalog/get-pipes";
import { IntegrationCatalog } from "@/components/features/docs/integration-catalog";
import { Suspense } from "react";

export const metadata = {
  title: "Pipe Catalog",
};

export default async function PipeCatalog() {
  const pipeEntries = await getPipeEntries();

  return (
    <div
      data-pagefind-ignore="all"
      className="mx-auto px-6 mb-12 min-h-screen"
      style={{ maxWidth: "var(--nextra-content-width)" }}
    >
      <Suspense>
        <IntegrationCatalog pipeEntries={pipeEntries} />
      </Suspense>
    </div>
  );
}
