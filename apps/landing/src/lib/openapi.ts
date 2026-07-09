import { createOpenAPI } from "fumadocs-openapi/server";

const OPENAPI_URL = "https://api.pipe0.com/openapi";

// fumadocs-openapi v11 resolves string inputs as file paths only, so remote
// schemas are fetched via a document factory. The key doubles as the schema id
// and must match the `document` prop in the generated API MDX pages.
export const openapi = createOpenAPI({
  input: {
    [OPENAPI_URL]: async () => {
      const res = await fetch(OPENAPI_URL);
      if (!res.ok) {
        throw new Error(`Failed to fetch OpenAPI schema: ${res.status}`);
      }
      return res.json();
    },
  },
});
