import { PipePage } from "@/components/features/docs/pipe-page";
import { PipeCatalogHeader } from "@/components/pipe-catalog-header";
import { generatePipeMetadata } from "@/lib/utils";
import { PipeId } from "@pipe0/client-sdk";

const pipeId: PipeId = "message:send:slack@1";

export const metadata = generatePipeMetadata(pipeId);

export default async function PipeDocs() {
  return (
    <PipePage pipeId={pipeId}>
      <PipeCatalogHeader pipeId={pipeId} />
    </PipePage>
  );
}
