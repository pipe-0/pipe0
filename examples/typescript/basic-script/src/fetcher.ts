import type { PipesRequest, PipesResponse } from "@pipe0/client";
import client from "./client";

export const requestBody: PipesRequest = {
  pipes: [
    {
      pipe_id: "person:profileurl:name@1",
    },
    {
      pipe_id: "person:profile:waterfall@2",
    },
    {
      pipe_id: "company:identity@3",
    },
    {
      pipe_id: "company:overview@3",
    },
  ],
  input: [
    {
      id: 1,
      name: "Han Wang",
      company_name: "Mintlify",
    },
  ],
};

export function toValueArr(
  response: PipesResponse,
): Array<{ [fieldName: string]: any }> {
  return Object.values(response.records).map((record) => {
    const recordFields: { [fieldName: string]: any } = {};
    Object.entries(record.fields).forEach(([fieldName, field]) => {
      recordFields[fieldName] = field.value;
    });
    return recordFields;
  });
}

export async function fetcher() {
  const data = await client.pipes.pipe(requestBody);

  if (data) {
    return { values: toValueArr(data), rawResponse: data };
  }

  return null;
}
