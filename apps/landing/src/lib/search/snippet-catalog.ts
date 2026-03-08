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

export const searchSnippetCatalog = {
  "people:profiles:crustdata@1": {
    search_id: "people:profiles:crustdata@1",
    config: {
      cursor: "",
      limit: 10,
      filters: {
        locations: { include: ["Berlin", "Germany"] },
        profile_headline_keywords: { include: ["Marketing"], exclude: [] },
        profile_summary_keywords: {
          exclude: [],
        },
        profile_languages: { include: ["Arabic"] },
        languages: { include: [] },
        skills: { include: ["Python", "Data Analysis"] },
        years_of_experience: ["1 to 2 years"],
        current_seniority_levels: {
          include: ["Senior"],
          exclude: [],
        },
        current_employers: { include: [], exclude: [] },
        current_employers_website_urls: { include: [], exclude: [] },
        current_job_titles: { include: ["Software Engineer"] },
        current_employers_linkedin_industries: { include: [], exclude: [] },
        years_at_current_company: ["1 to 2 years"],
        previous_seniority_levels: {
          include: [],
          exclude: [],
        },
        previous_employers: { include: [], exclude: [] },
        previous_employers_website_urls: { include: [], exclude: [] },
        previous_employers_linkedin_industries: { include: [], exclude: [] },
        previous_job_titles: { include: [], exclude: [] },
        certifications: { include: [], exclude: [] },
        honors: { include: [], exclude: [] },
        recently_changed_jobs: false,
        fields_of_study: { include: [], exclude: [] },
        degree_names: { include: [], exclude: [] },
        school_names: { include: [], exclude: [] },
        current_school_names: { include: [], exclude: [] },
        extracurricular_activities: { include: [], exclude: [] },
      },
    },
  },
  "companies:profiles:crustdata@1": {
    search_id: "companies:profiles:crustdata@1",
    config: {
      cursor: "",
      limit: 10,
      filters: {
        hq_locations: { include: ["San Francisco, CA"] },
        crunchbase_categories: { include: ["Artificial Intelligence"] },
        crunchbase_investors: { include: [], exclude: [] },
        tracxn_investors: { include: [], exclude: [] },
        company_types: { include: [], exclude: [] },
        linkedin_industries: ["Technology"],
        markets: { include: [], exclude: [] },
        linkedin_categories: { include: [], exclude: [] },
        headcount: { include: [], exclude: [] },
        headcount_growth_last_6m_in_percent: [],
        revenue_in_usd: {
          from: 10000,
          to: 1000000,
        },
        last_funding_type: { include: [], exclude: [] },
        last_funding_amount: {
          from: null,
          to: null,
        },
        number_of_followers: [],
        follower_growth_last_6m_in_percent: [],
        profile_summary_keywords: { include: [], exclude: [] },
        competitor_websites: { include: ["https://google.com"] },
      },
    },
  },
} as {
  [K in SearchId]: SearchRequestPayloadMap[K];
};
