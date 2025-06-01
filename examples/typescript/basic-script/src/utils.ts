import { type paths } from "./schema.ts";
import createClient from "openapi-fetch";

export const pipe0Client = createClient<paths>({
  // Requests use a test endpoint that only returns fake data
  // set to "https://api.pipe0.com" to use production data
  // baseUrl: "https://api.pipe0.com"
  baseUrl: "https://sandbox-proxy.pipe0.com",
});

export type PipelineRequest =
  paths["/v1/run/sync"]["post"]["requestBody"]["content"]["application/json"];
export type PipelineResponse =
  paths["/v1/run/sync"]["post"]["responses"]["200"]["content"]["application/json"];

export function toValueArr(
  response: PipelineResponse
): Array<{ [fieldName: string]: any }> {
  return Object.values(response.records).map((record) => {
    const recordFields: { [fieldName: string]: any } = {};
    Object.entries(record.fields).forEach(([fieldName, field]) => {
      recordFields[fieldName] = field.value;
    });
    return recordFields;
  });
}
