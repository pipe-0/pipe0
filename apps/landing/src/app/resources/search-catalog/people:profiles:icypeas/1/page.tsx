import { SearchPage } from "@/components/features/docs/search-page";
import { SearchCatalogHeader } from "@/components/search-catalog-header";
import { generateSearchMetadata } from "@/lib/utils";
import { SearchId } from "@pipe0/client-sdk";

const searchId: SearchId = "people:profiles:icypeas@1";

export const metadata = generateSearchMetadata(searchId);

export default async function PipeDocs() {
  return (
    <SearchPage searchId={searchId}>
      <SearchCatalogHeader searchId={searchId} />
    </SearchPage>
  );
}
