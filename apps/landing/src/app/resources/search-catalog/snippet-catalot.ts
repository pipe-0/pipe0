import {
  SearchesPayloadMap,
  SearchesRequest,
  SearchId,
} from "@pipe0/client-sdk";
import Oas from "oas";
import { OASDocument } from "oas/types";

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
    "/v1/searches/run": {
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

export const searchesMiniSpec = new Oas(miniSpec);

export const snippetCatalog = {
  "companies:profiles:icypeas@1": {
    config: {
      environment: "production",
      dedup: {
        strategy: "default",
      },
    },
    searches: [
      {
        search_id: "companies:profiles:icypeas@1",
        config: {
          limit: 100,
          filters: {
            headcount: {
              gte: null,
              gt: 1000,
              lt: null,
              lte: null,
            },
            industry: {
              include: ["Software Services"],
              exclude: [],
            },
            location: {
              include: ["Berlin, German"],
              exclude: [],
            },
          },
        },
      },
    ],
  },
  "people:profiles:icypeas@1": {
    config: {
      environment: "production",
      dedup: {
        strategy: "default",
      },
    },
    searches: [
      {
        search_id: "people:profiles:icypeas@1",
        config: {
          limit: 100,
          filters: {
            currentJobTitle: {
              include: ["Software Engineer"],
              exclude: [],
            },
            location: {
              include: ["San Francisco"],
              exclude: ["New York"],
            },
            keyword: {
              include: ["Scalar"],
              exclude: ["Python"],
            },
          },
        },
      },
    ],
  },
  "people:profiles:clado@1": {
    config: {
      environment: "production",
      dedup: {
        strategy: "default",
      },
    },
    searches: [
      {
        search_id: "people:profiles:clado@1",
        config: {
          limit: 100,
          filters: {
            query: "Go-to-market specialists in Rome, Italy.",
          },
        },
      },
    ],
  },
  "people:employees:leadmagic@1": {
    config: {
      environment: "production",
      dedup: {
        strategy: "default",
      },
    },
    searches: [
      {
        search_id: "people:employees:leadmagic@1",
        config: {
          limit: 20,
          filters: {
            company_website_url: "https://pipe0.com",
          },
        },
      },
    ],
  },
  "companies:profiles:exa@1": {
    config: {
      environment: "production",
      dedup: {
        strategy: "default",
      },
    },
    searches: [
      {
        search_id: "companies:profiles:exa@1",
        config: {
          limit: 10,
          filters: {
            query: "Top AI labs in the United States.",
          },
        },
      },
    ],
  },
  "people:profiles:exa@1": {
    config: {
      environment: "production",
      dedup: {
        strategy: "default",
      },
    },
    searches: [
      {
        search_id: "people:profiles:exa@1",
        config: {
          limit: 10,
          filters: {
            query: "Ruby on Rails experts in Berlin, Germany.",
          },
        },
      },
    ],
  },
} satisfies {
  [K in SearchId]: SearchesRequest & { searches: SearchesPayloadMap[K][] };
};
