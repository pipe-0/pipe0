import { PipePage } from "@/components/features/docs/pipe-page";
import { PipeCatalogHeader } from "@/components/pipe-catalog-header";
import { generatePipeMetadata } from "@/lib/utils";
import { PipeId } from "@pipe0/client-sdk";

const pipeId: PipeId = "people:is:workemail@1";

export const metadata = generatePipeMetadata(pipeId);

export default async function PipeDocs() {
  return (
    <PipePage>
      <PipeCatalogHeader pipeId={pipeId} />
    </PipePage>
  );
}
