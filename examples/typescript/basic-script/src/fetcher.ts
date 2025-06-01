import { pipe0Client, toValueArr, type PipelineRequest } from "./utils";

export const requestBody: PipelineRequest = {
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

export async function fetcher() {
  const { data } = await pipe0Client.POST("/v1/run/sync", {
    headers: {}, // Add your API key here AND change the url in './utils'
    body: requestBody,
  });

  if (data) {
    return { values: toValueArr(data), rawResponse: data };
  }

  return null;
}
