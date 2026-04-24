import { getBasePipeName, getPipeVersion, PipeId } from "@pipe0/elements";

export function getPipeDocsURI(pipeId: PipeId) {
  return `/docs/pipes/pipes-catalog/${getBasePipeName(pipeId)}/${getPipeVersion(pipeId as PipeId)}`;
}
