import {
  SearchesPayloadMap,
  SearchesRequestPayload,
  SearchId,
} from "@pipe0/ops";
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
  "people:profiles:clado@2": {
    config: {
      environment: "production",
      dedup: {
        strategy: "default",
      },
    },
    searches: [
      {
        search_id: "people:profiles:clado@2",
        config: {
          limit: 100,
          offset: undefined,
          search_id: "",
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
  "people:profiles:crustdata@1": {
    config: {
      environment: "production",
      dedup: {
        strategy: "default",
      },
    },
    searches: [
      {
        search_id: "people:profiles:crustdata@1",
        config: {
          limit: 10,
          cursor: "",
          filters: {
            locations: ["Berlin", "Germany"],
            profile_headline_keywords: [],
            profile_summary_keywords: [],
            profile_languages: ["Arabic"],
            languages: [],
            skills: [],
            years_of_experience: ["1 to 2 years"],
            current_seniority_levels: {
              include: [],
              exclude: [],
            },
            current_employers: [],
            current_job_titles: [],
            current_employers_linkedin_industries: [],
            years_at_current_company: ["1 to 2 years"],
            previous_seniority_levels: {
              include: [],
              exclude: [],
            },
            previous_employers: [],
            previous_employers_linkedin_industries: [],
            previous_job_titles: [],
            certifications: [],
            honors: [],
            recently_changed_jobs: false,
            fields_of_study: [],
            degree_names: [],
            school_names: [],
            current_school_names: [],
            extracurricular_activities: [],
          },
        },
      },
    ],
  },
  "companies:profiles:crustdata@1": {
    config: {
      environment: "production",
      dedup: {
        strategy: "default",
      },
    },
    searches: [
      {
        search_id: "companies:profiles:crustdata@1",
        config: {
          limit: 10,
          cursor: "",
          filters: {
            company_types: [],
            headcount_growth_last_6m_in_percent: [],
            last_funding_amount: {
              from: null,
              to: null,
            },
            last_funding_type: [],
            linkedin_industries: [],
            linkedin_categories: [],
            crunchbase_categories: [],
            markets: [],
            revenue_in_usd: {
              from: 10000,
              to: 1000000,
            },
            crunchbase_investors: [],
            tracxn_investors: [],
            follower_growth_last_6m_in_percent: [],
            headcount: [],
            hq_locations: [],
            number_of_followers: [],
            profile_summary_keywords: [],
            competitor_websites: ["https://google.com"],
          },
        },
      },
    ],
  },
} satisfies {
  [K in SearchId]: SearchesRequestPayload & {
    searches: SearchesPayloadMap[K][];
  };
};
