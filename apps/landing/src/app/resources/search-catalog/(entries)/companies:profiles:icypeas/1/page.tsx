import { PipePage } from "@/components/features/docs/pipe-page";
import { SearchPage } from "@/components/features/docs/search-page";
import { PipeCatalogHeader } from "@/components/pipe-catalog-header";
import { SearchCatalogHeader } from "@/components/search-catalog-header";
import { generatePipeMetadata, generateSearchMetadata } from "@/lib/utils";
import { SearchId } from "@pipe0/client-sdk";

const searchId: SearchId = "companies:profiles:icypeas@1";

export const metadata = generateSearchMetadata(searchId);

export default async function PipeDocs() {
  return (
    <SearchPage searchId={searchId}>
      <SearchCatalogHeader searchId={searchId} />
    </SearchPage>
  );
}
