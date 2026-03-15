import type { PipesRequest, PipesResponse } from "@pipe0/client";
import client from "./client";

export const requestBody: PipesRequest = {
  pipes: [
    {
      pipe_id: "people:professionalprofileurl:name@1",
    },
    {
      pipe_id: "people:professionalprofile:waterfall@1",
    },
    {
      pipe_id: "company:identity@1",
    },
    {
      pipe_id: "company:overview@1",
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
