import { getBasePipeName, getPipeVersion, PipeId } from "@pipe0/base";

export function getPipeDocsURI(pipeId: PipeId) {
  return `/docs/pipe-catalog/${getBasePipeName(pipeId)}/${getPipeVersion(pipeId as PipeId)}`;
}
