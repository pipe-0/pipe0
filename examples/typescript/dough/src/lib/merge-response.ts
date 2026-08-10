import { inputFromRecord, type PipesInput, type PipesResponse } from "@pipe0/base";

export function mergeResponseIntoInput(input: PipesInput[], response: PipesResponse): PipesInput[] {
  const next = input.map((row) => {
    const record = response.records[String(row.id)];
    if (!record) return row;
    return inputFromRecord(record, { expandAllStatuses: true }) as PipesInput;
  });
  return next;
}
