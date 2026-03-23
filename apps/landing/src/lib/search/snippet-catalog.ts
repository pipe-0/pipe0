import { ClientSearchPayloadMap } from "@pipe0/client";
import { SearchId, SearchPayloadCatalog } from "@pipe0/ops";
import Oas from "oas";
import { OASDocument } from "oas/types";
import z from "zod";

export type SearchRequestPayloadMap = {
  [k in keyof SearchPayloadCatalog]: z.input<SearchPayloadCatalog[k]>;
};

const miniSpec: OASDocument = {
  openapi: "3.1.0",
  info: { title: "Pipe0 API", version: "0.5.0" },
  servers: [
    {
      url: "https://api.pipe0.com",
    },
  ],
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
  paths: {
    "/v1/search/run": {
      post: {
        summary: "Run a search",
        operationId: "createUser",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                },
                required: ["name", "email"],
              },
              example: {
                name: "Alice",
                email: "alice@example.com",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created",
          },
        },
      },
    },
  },
};

export const searchMiniSpec = new Oas(miniSpec);
