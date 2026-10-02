import { Pipe0 } from "@pipe0/client";

export type Pipe0Environment = "production" | "sandbox";

export interface Pipe0ToolOptions {
  /** pipe0 API key. Defaults to the `PIPE0_API_KEY` environment variable. */
  apiKey?: string;
  /**
   * `production` (default) returns real data and spends credits.
   * `sandbox` returns realistic placeholder data for free. Use it while building.
   */
  environment?: Pipe0Environment;
  /** Bring your own configured client (custom base URL, timeouts, …). Overrides `apiKey`. */
  client?: Pipe0;
}

export function resolveClient(options: Pipe0ToolOptions): Pipe0 {
  if (options.client) return options.client;
  const apiKey = options.apiKey ?? process.env.PIPE0_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing pipe0 API key. Pass { apiKey } or set PIPE0_API_KEY. Create one at https://app.pipe0.com.",
    );
  }
  return new Pipe0({ apiKey });
}

type Cell = { value: unknown; status: string; reason?: { summary?: string } | null };

/** Values of completed cells, keyed by field name. */
export function completedValues(fields: Record<string, Cell>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [name, cell] of Object.entries(fields)) {
    if (cell.status === "completed" && cell.value !== null && cell.value !== "") {
      out[name] = cell.value;
    }
  }
  return out;
}

/** Requested fields that came back empty, with the provider's reason when there is one. */
export function missingFields(
  fields: Record<string, Cell>,
  requested: string[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const name of requested) {
    const cell = fields[name];
    if (!cell || (cell.status === "completed" && cell.value !== null && cell.value !== "")) {
      continue;
    }
    out[name] = cell.reason?.summary ?? cell.status;
  }
  return out;
}

/** The useful, compact slice of pipe0's standardized person profile. */
export function summarizeProfile(profile: unknown): Record<string, unknown> | undefined {
  if (!profile || typeof profile !== "object") return undefined;
  const p = profile as Record<string, unknown>;
  const history = Array.isArray(p.employment_history)
    ? (p.employment_history as Record<string, unknown>[])
    : [];
  return dropEmpty({
    name: p.name,
    headline: p.headline,
    job_title: p.primary_job_title,
    company_domain: p.primary_company_domain,
    seniority: p.highest_current_seniority_level,
    department: p.primary_department,
    location: [p.current_location_city, p.current_location_state, p.current_location_country]
      .filter(Boolean)
      .join(", "),
    profile_url: p.profile_url,
    current_roles: history
      .filter((job) => job.is_current_employer)
      .slice(0, 3)
      .map((job) =>
        dropEmpty({
          title: job.job_title,
          company: job.company_name,
          company_domain: job.company_domain,
          start_date: job.start_date,
        }),
      ),
  });
}

export function dropEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined || value === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value as object).length === 0
    ) {
      continue;
    }
    out[key] = value;
  }
  return out as Partial<T>;
}

export function firstRecordFields(response: {
  order: (number | string)[];
  records: Record<string, { fields: Record<string, Cell> }>;
}): Record<string, Cell> {
  const id = response.order[0];
  const record = id === undefined ? undefined : response.records[String(id)];
  return record?.fields ?? {};
}
