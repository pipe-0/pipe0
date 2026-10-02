import type { Pipe0 } from "@pipe0/client";
import { describe, expect, it, vi } from "vitest";
import { enrichCompany, enrichPerson, findPeople, pipe0Tools } from "./index.js";

const cell = (value: unknown) => ({ value, status: "completed" });

function fakeClient() {
  const pipe = vi.fn(async () => ({
    order: ["1"],
    records: {
      "1": {
        fields: {
          work_email: cell("jane@acme.com"),
          mobile: { value: null, status: "failed", reason: { summary: "No provider found a number" } },
        },
      },
    },
    errors: [],
  }));
  const search = vi.fn(async () => ({
    results: [
      {
        name: cell("Jane Doe"),
        profile_url: cell("https://linkedin.com/in/jane"),
        person_profile_match: cell({ primary_job_title: "CTO", primary_company_domain: "acme.com" }),
      },
    ],
    errors: [],
  }));
  return { client: { pipes: { pipe }, searches: { search } } as unknown as Pipe0, pipe, search };
}

describe("pipe0Tools", () => {
  it("returns the three tools with snake_case names", () => {
    expect(pipe0Tools({ apiKey: "test" }).map((t) => t.name)).toEqual([
      "find_people",
      "enrich_person",
      "enrich_company",
    ]);
  });
});

describe("find_people", () => {
  it("maps filters to the people search and returns compact profiles", async () => {
    const { client, search } = fakeClient();
    const result = await findPeople({ client }).execute?.({
      companyDomains: ["acme.com"],
      seniority: ["CXO"],
      limit: 10,
    });

    expect(search).toHaveBeenCalledWith(
      expect.objectContaining({
        search: expect.objectContaining({
          search_id: "people:profiles:crustdata@3",
          config: {
            limit: 10,
            filters: {
              current_employer_domains: { include: ["acme.com"], exclude: [] },
              current_employment_seniority_levels: ["CXO"],
            },
          },
        }),
      }),
      expect.anything(),
    );
    expect(result).toEqual({
      count: 1,
      people: [
        {
          name: "Jane Doe",
          job_title: "CTO",
          company_domain: "acme.com",
          profile_url: "https://linkedin.com/in/jane",
        },
      ],
    });
  });

  it("asks for a filter instead of running an empty search", async () => {
    const { client, search } = fakeClient();
    const result = await findPeople({ client }).execute?.({ limit: 10 });
    expect(result).toEqual({ error: expect.stringMatching(/at least one filter/) });
    expect(search).not.toHaveBeenCalled();
  });
});

describe("enrich_person", () => {
  it("runs the planned waterfalls and reports what was not found", async () => {
    const { client, pipe } = fakeClient();
    const controller = new AbortController();
    const result = await enrichPerson({ client, environment: "sandbox" }).execute?.(
      { name: "Jane Doe", companyDomain: "acme.com", find: ["work_email", "mobile"] },
      { abortSignal: controller.signal, emitCustomEvent: () => {} },
    );

    expect(pipe).toHaveBeenCalledWith(
      {
        config: { environment: "sandbox" },
        pipes: [
          { pipe_id: "person:workemail:waterfall@1" },
          { pipe_id: "person:mobile:workemail:waterfall@1" },
        ],
        input: [{ id: "1", name: "Jane Doe", company_domain: "acme.com" }],
      },
      { signal: expect.any(AbortSignal) },
    );
    expect(result).toEqual({
      work_email: "jane@acme.com",
      not_found: { mobile: "No provider found a number" },
    });
  });
});

describe("schema defaults", () => {
  it("fills in defaults the model leaves out", async () => {
    const { client, pipe, search } = fakeClient();
    await enrichPerson({ client }).execute?.({ profileUrl: "https://linkedin.com/in/jane" });
    expect(pipe).toHaveBeenCalledWith(
      expect.objectContaining({
        pipes: [
          { pipe_id: "person:profile:waterfall@2" },
          { pipe_id: "person:workemail:profileurl:waterfall@1" },
        ],
      }),
      expect.anything(),
    );

    await findPeople({ client }).execute?.({ companyDomains: ["acme.com"] });
    expect(search).toHaveBeenCalledWith(
      expect.objectContaining({
        search: expect.objectContaining({ config: expect.objectContaining({ limit: 10 }) }),
      }),
      expect.anything(),
    );
  });
});

describe("needsApproval", () => {
  it("is off by default and can be enabled for every tool", () => {
    expect(pipe0Tools({ apiKey: "test" }).map((t) => t.needsApproval)).toEqual([false, false, false]);
    expect(pipe0Tools({ apiKey: "test", needsApproval: true }).map((t) => t.needsApproval)).toEqual([
      true,
      true,
      true,
    ]);
  });
});

describe("enrich_company", () => {
  it("runs the company overview pipe for the domain", async () => {
    const { client, pipe } = fakeClient();
    await enrichCompany({ client }).execute?.({ domain: "acme.com" });
    expect(pipe).toHaveBeenCalledWith(
      expect.objectContaining({
        pipes: [{ pipe_id: "company:overview@3" }],
        input: [{ id: "1", company_domain: "acme.com" }],
      }),
      expect.anything(),
    );
  });
});
