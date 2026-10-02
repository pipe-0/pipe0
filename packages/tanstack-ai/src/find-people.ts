import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";
import { type Pipe0ToolOptions, resolveClient, summarizeProfile } from "./shared.js";

const SENIORITY = [
  "Owner / Partner",
  "CXO",
  "Vice President",
  "Director",
  "Experienced Manager",
  "Entry Level Manager",
  "Strategic",
  "Senior",
  "Entry Level",
  "In Training",
] as const;

const JOB_FUNCTIONS = [
  "Engineering",
  "Sales",
  "Consulting",
  "Marketing",
  "Operations",
  "Finance",
  "Research",
  "Customer Success and Support",
  "Arts and Design",
  "Human Resources",
  "Legal",
  "Product Management",
] as const;

const HEADCOUNT = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1,000",
  "1,001-5,000",
  "5,001-10,000",
  "10,001+",
] as const;

const inputSchema = z.object({
  jobTitles: z
    .array(z.string())
    .optional()
    .describe("Current job titles to match, e.g. ['Head of Sales', 'VP Sales']."),
  companyDomains: z
    .array(z.string())
    .optional()
    .describe("Only people currently employed at these company domains, e.g. ['stripe.com']."),
  companyNames: z
    .array(z.string())
    .optional()
    .describe("Only people currently employed at these companies, by name."),
  locations: z
    .array(z.string())
    .optional()
    .describe("Locations as 'City, Country' or a country, e.g. ['Berlin, Germany', 'France']."),
  seniority: z.array(z.enum(SENIORITY)).optional().describe("Current seniority levels."),
  jobFunctions: z.array(z.enum(JOB_FUNCTIONS)).optional().describe("Current job functions."),
  companyHeadcount: z
    .array(z.enum(HEADCOUNT))
    .optional()
    .describe("Headcount brackets of the current employer."),
  keywords: z
    .array(z.string())
    .optional()
    .describe("Keywords that must appear in the person's profile headline."),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10)
    .describe("Maximum number of people to return. Each result spends credits."),
});

type Input = z.infer<typeof inputSchema>;

const include = (values?: string[]) =>
  values && values.length > 0 ? { include: values, exclude: [] } : undefined;

export function buildPeopleFilters(input: Input): Record<string, unknown> {
  const filters: Record<string, unknown> = {
    current_employment_job_titles: include(input.jobTitles),
    current_employer_domains: include(input.companyDomains),
    current_employer_names: include(input.companyNames),
    locations: include(input.locations),
    profile_headline_keywords: include(input.keywords),
    current_employment_seniority_levels: input.seniority,
    current_employment_job_functions: input.jobFunctions,
    current_employer_headcount_brackets: input.companyHeadcount,
  };
  return Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && !(Array.isArray(v) && !v.length)),
  );
}

/** Search for people by role, employer, seniority and location. */
export function findPeople(options: Pipe0ToolOptions = {}) {
  return toolDefinition({
    name: "find_people",
    description:
      "Search for people (prospects) by job title, current employer, seniority, job function, company size, and location. Returns names, job titles, companies, and LinkedIn profile URLs. Pass a profile URL to enrich_person to get their email or phone. All filters must match (AND), so start broad: identify a company by companyDomains alone, and prefer seniority over exact job titles for executives. Each returned person spends pipe0 credits.",
    inputSchema,
    needsApproval: options.needsApproval ?? false,
  }).server(async (args, context) => {
    const input = inputSchema.parse(args);
    const filters = buildPeopleFilters(input);
    if (Object.keys(filters).length === 0) {
      return { error: "Provide at least one filter, e.g. jobTitles or companyDomains." };
    }

    const response = await resolveClient(options).searches.search(
      {
        config: { environment: options.environment ?? "production" },
        search: {
          search_id: "people:profiles:crustdata@3",
          config: { limit: input.limit, filters },
        },
      } as Parameters<ReturnType<typeof resolveClient>["searches"]["search"]>[0],
      { signal: context?.abortSignal },
    );

    const people = response.results.map((row) => {
      const profile = summarizeProfile(row.person_profile_match?.value) ?? {};
      return {
        ...profile,
        name: row.name?.value ?? profile.name,
        profile_url: row.profile_url?.value ?? profile.profile_url,
      };
    });

    return {
      count: people.length,
      ...(people.length === 0
        ? {
            hint: "No one matched every filter. Filters combine with AND: drop the narrowest one (jobFunctions, keywords, exact jobTitles, or companyNames when companyDomains is set) and search again.",
          }
        : {}),
      people,
      ...(response.errors.length > 0 ? { errors: response.errors.map((e) => e.message) } : {}),
    };
  });
}
