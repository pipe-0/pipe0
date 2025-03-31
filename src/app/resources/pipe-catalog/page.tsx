import {
  getPipeEntries,
  getTags,
} from "@/app/resources/pipe-catalog/get-pipes";
import { IntegrationCatalog } from "@/components/features/docs/integration-catalog";
import { Separator } from "@/components/ui/separator";
import { themeMdxComponents } from "@/mdx-components";

const H1 = themeMdxComponents.h1;
const P = themeMdxComponents.p;

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
      <div className="mb-8">
        <H1 className="text-2xl font-lg font-semibold ">{metadata.title}</H1>
        <P>
          Pipe automate data enrichment via various providers. The Pipe Catalog
          lists all available pipes for your apps.
        </P>
      </div>
      <Separator className="mb-6" />
      <IntegrationCatalog pipeEntries={pipeEntries} allTags={allTags} />
    </div>
  );
}
