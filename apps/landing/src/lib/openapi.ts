import { createOpenAPI } from "fumadocs-openapi/server";

export const openapi = createOpenAPI({
  input: ["https://api.pipe0.com/openapi"],
});
