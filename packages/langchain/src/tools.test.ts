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
  it("returns the three tools with LangChain-style names", () => {
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
    const result = JSON.parse(
      await findPeople({ client }).invoke({ companyDomains: ["acme.com"], seniority: ["CXO"] }),
    );

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
    const result = JSON.parse(await findPeople({ client }).invoke({}));
    expect(result.error).toMatch(/at least one filter/);
    expect(search).not.toHaveBeenCalled();
  });
});

describe("enrich_person", () => {
  it("runs the planned waterfalls and reports what was not found", async () => {
    const { client, pipe } = fakeClient();
    const controller = new AbortController();
    const result = JSON.parse(
      await enrichPerson({ client, environment: "sandbox" }).invoke(
        { name: "Jane Doe", companyDomain: "acme.com", find: ["work_email", "mobile"] },
        { signal: controller.signal },
      ),
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

describe("enrich_company", () => {
  it("runs the company overview pipe for the domain", async () => {
    const { client, pipe } = fakeClient();
    await enrichCompany({ client }).invoke({ domain: "acme.com" });
    expect(pipe).toHaveBeenCalledWith(
      expect.objectContaining({
        pipes: [{ pipe_id: "company:overview@3" }],
        input: [{ id: "1", company_domain: "acme.com" }],
      }),
      expect.anything(),
    );
  });
});
