import { PipePage } from "@/components/features/docs/pipe-page";
import { PipeCatalogHeader } from "@/components/pipe-catalog-header";
import { generatePipeMetadata } from "@/lib/utils";
import { PipeId } from "@pipe0/ops";

const pipeId: PipeId = "people:workemail:waterfall@1";

export const metadata = generatePipeMetadata(pipeId);

export default async function PipeDocs() {
  return (
    <PipePage pipeId={pipeId}>
      <PipeCatalogHeader pipeId={pipeId} />
    </PipePage>
  );
}
