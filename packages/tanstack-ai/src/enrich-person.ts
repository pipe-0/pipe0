import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";
import {
  completedValues,
  dropEmpty,
  firstRecordFields,
  missingFields,
  type Pipe0ToolOptions,
  resolveClient,
  summarizeProfile,
} from "./shared.js";

const FINDABLE = ["work_email", "mobile", "profile"] as const;
type Findable = (typeof FINDABLE)[number];

const inputSchema = z.object({
  profileUrl: z
    .string()
    .optional()
    .describe("The person's LinkedIn profile URL. The most reliable identifier when you have it."),
  email: z
    .string()
    .optional()
    .describe("Any email address of the person, for a reverse lookup of who they are."),
  name: z.string().optional().describe("Full name. Use together with companyDomain."),
  companyDomain: z
    .string()
    .optional()
    .describe("Bare domain of the person's current employer, e.g. 'stripe.com'. Use with name."),
  find: z
    .array(z.enum(FINDABLE))
    .min(1)
    .default(["work_email", "profile"])
    .describe(
      "What to find: 'work_email', 'mobile' (phone number; costs more), and 'profile' (job title, company, seniority, location, LinkedIn URL).",
    ),
});

type Input = z.infer<typeof inputSchema>;
type PipeConfig = { pipe_id: string; config?: Record<string, unknown> };

/**
 * Picks the waterfall pipes for the identifier the model has. pipe0 resolves
 * the chain (e.g. name → work email → mobile) and tries providers in order
 * until one finds the value.
 */
export function planPersonEnrichment(input: Input): {
  record: Record<string, string>;
  pipes: PipeConfig[];
} | null {
  const want = new Set<Findable>(input.find);
  const pipes: PipeConfig[] = [];

  if (input.profileUrl) {
    if (want.has("profile")) pipes.push({ pipe_id: "person:profile:waterfall@2" });
    if (want.has("work_email")) pipes.push({ pipe_id: "person:workemail:profileurl:waterfall@1" });
    if (want.has("mobile")) pipes.push({ pipe_id: "person:mobile:profileurl:waterfall@1" });
    return { record: { id: "1", profile_url: input.profileUrl }, pipes };
  }

  if (input.email) {
    // The reverse lookup yields the profile URL the other waterfalls need.
    if (want.has("profile") || want.has("work_email")) {
      pipes.push({ pipe_id: "person:identity:email:waterfall@2" });
    }
    if (want.has("work_email")) pipes.push({ pipe_id: "person:workemail:profileurl:waterfall@1" });
    if (want.has("mobile")) {
      pipes.push({
        pipe_id: "person:mobile:workemail:waterfall@1",
        config: { input_fields: { work_email: { alias: "email" } } },
      });
    }
    return { record: { id: "1", email: input.email }, pipes };
  }

  if (input.name && input.companyDomain) {
    // Every other value is reached through the work email.
    pipes.push({ pipe_id: "person:workemail:waterfall@1" });
    if (want.has("mobile")) pipes.push({ pipe_id: "person:mobile:workemail:waterfall@1" });
    if (want.has("profile")) {
      pipes.push({
        pipe_id: "person:identity:email:waterfall@2",
        config: { input_fields: { email: { alias: "work_email" } } },
      });
    }
    return {
      record: { id: "1", name: input.name, company_domain: input.companyDomain },
      pipes,
    };
  }

  return null;
}

/**
 * Enrich one person with a verified work email, mobile number and/or a
 * standardized profile, using pipe0's multi-provider waterfalls.
 */
export function enrichPerson(options: Pipe0ToolOptions = {}) {
  return toolDefinition({
    name: "enrich_person",
    description:
      "Find contact data for one person: verified work email, mobile phone number, and profile (job title, company, seniority, location, LinkedIn URL). Identify the person by LinkedIn profile URL, by an email address, or by full name plus company domain. Searches dozens of data providers in a waterfall. Each call spends pipe0 credits, so only request what you need.",
    inputSchema,
    needsApproval: options.needsApproval ?? false,
  }).server(async (args, context) => {
    const input = inputSchema.parse(args);
    const plan = planPersonEnrichment(input);
    if (!plan) {
      return {
        error: "Provide a LinkedIn profileUrl, an email, or a name together with companyDomain.",
      };
    }

    const response = await resolveClient(options).pipes.pipe(
      {
        config: { environment: options.environment ?? "production" },
        pipes: plan.pipes,
        input: [plan.record],
      } as Parameters<ReturnType<typeof resolveClient>["pipes"]["pipe"]>[0],
      { signal: context?.abortSignal },
    );

    const fields = firstRecordFields(response);
    const values = completedValues(fields);
    const requested = input.find.map((f) => (f === "profile" ? "person_profile_match" : f));

    return dropEmpty({
      work_email: values.work_email,
      email_validation_status: values.email_validation_status,
      mobile: values.mobile,
      profile_url: values.profile_url ?? input.profileUrl,
      profile: input.find.includes("profile")
        ? summarizeProfile(values.person_profile_match)
        : undefined,
      not_found: missingFields(fields, requested),
      errors: response.errors.length > 0 ? response.errors.map((e) => e.message) : undefined,
    });
  });
}
