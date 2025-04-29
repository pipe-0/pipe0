import {
  getPipeEntries,
  getTags,
} from "@/app/resources/pipe-catalog/get-pipes";
import { IntegrationCatalog } from "@/components/features/docs/integration-catalog";

export const metadata = {
  title: "Pipe Catalog",
};

export default async function PipeCatalog() {
  const pipeEntries = await getPipeEntries();

  const tags = await getTags();
  const allTags = {} as Record<string, number>;

  for (const tag of tags) {
    allTags[tag] ??= 0;
    allTags[tag] += 1;
  }

  return (
    <div
      data-pagefind-ignore="all"
      className="mx-auto px-6 mb-12 min-h-screen"
      style={{ maxWidth: "var(--nextra-content-width)" }}
    >
      <IntegrationCatalog pipeEntries={pipeEntries} allTags={allTags} />
    </div>
  );
}
