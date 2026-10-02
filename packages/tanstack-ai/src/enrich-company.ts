import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";
import {
  completedValues,
  dropEmpty,
  firstRecordFields,
  missingFields,
  type Pipe0ToolOptions,
  resolveClient,
} from "./shared.js";

const OUTPUTS = [
  "company_name",
  "company_description",
  "company_industry",
  "company_region",
  "headcount",
  "estimated_revenue",
  "founded_year",
];

/** Firmographics for one company: description, industry, headcount, revenue, founding year. */
export function enrichCompany(options: Pipe0ToolOptions = {}) {
  return toolDefinition({
    name: "enrich_company",
    description:
      "Get firmographics for one company from its website domain: name, description, industry, region, headcount, estimated revenue, and founding year. Each call spends pipe0 credits.",
    inputSchema: z.object({
      domain: z
        .string()
        .describe("The company's bare website domain, e.g. 'stripe.com' (no https://, no path)."),
    }),
    needsApproval: options.needsApproval ?? false,
  }).server(async ({ domain }, context) => {
    const response = await resolveClient(options).pipes.pipe(
      {
        config: { environment: options.environment ?? "production" },
        pipes: [{ pipe_id: "company:overview@3" }],
        input: [{ id: "1", company_domain: domain }],
      },
      { signal: context?.abortSignal },
    );

    const fields = firstRecordFields(response);
    const values = completedValues(fields);

    return dropEmpty({
      domain,
      ...Object.fromEntries(OUTPUTS.map((name) => [name, values[name]])),
      not_found: missingFields(fields, OUTPUTS),
      errors: response.errors.length > 0 ? response.errors.map((e) => e.message) : undefined,
    });
  });
}
