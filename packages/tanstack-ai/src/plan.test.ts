import { describe, expect, it } from "vitest";
import { planPersonEnrichment } from "./enrich-person.js";
import { buildPeopleFilters } from "./find-people.js";
import { completedValues, missingFields, summarizeProfile } from "./shared.js";

const ids = (plan: ReturnType<typeof planPersonEnrichment>) => plan?.pipes.map((p) => p.pipe_id);

describe("planPersonEnrichment", () => {
  it("uses the LinkedIn waterfalls for a profile URL", () => {
    const plan = planPersonEnrichment({
      profileUrl: "https://linkedin.com/in/jane",
      find: ["work_email", "mobile", "profile"],
    });
    expect(plan?.record).toEqual({ id: "1", profile_url: "https://linkedin.com/in/jane" });
    expect(ids(plan)).toEqual([
      "person:profile:waterfall@2",
      "person:workemail:profileurl:waterfall@1",
      "person:mobile:profileurl:waterfall@1",
    ]);
  });

  it("chains name + domain through the work email", () => {
    const plan = planPersonEnrichment({
      name: "Jane Doe",
      companyDomain: "acme.com",
      find: ["mobile", "profile"],
    });
    expect(ids(plan)).toEqual([
      "person:workemail:waterfall@1",
      "person:mobile:workemail:waterfall@1",
      "person:identity:email:waterfall@2",
    ]);
  });

  it("reverse-looks-up an email before finding a work email", () => {
    const plan = planPersonEnrichment({ email: "jane@gmail.com", find: ["work_email"] });
    expect(ids(plan)).toEqual([
      "person:identity:email:waterfall@2",
      "person:workemail:profileurl:waterfall@1",
    ]);
  });

  it("returns null without a usable identifier", () => {
    expect(planPersonEnrichment({ name: "Jane Doe", find: ["work_email"] })).toBeNull();
  });
});

describe("buildPeopleFilters", () => {
  it("maps inputs to include-lists and drops empty filters", () => {
    expect(
      buildPeopleFilters({ jobTitles: ["CTO"], seniority: ["CXO"], locations: [], limit: 5 }),
    ).toEqual({
      current_employment_job_titles: { include: ["CTO"], exclude: [] },
      current_employment_seniority_levels: ["CXO"],
    });
  });
});

describe("result helpers", () => {
  const fields = {
    work_email: { value: "jane@acme.com", status: "completed" },
    mobile: { value: null, status: "no_result", reason: { summary: "No provider had a number" } },
  };

  it("keeps completed values and explains misses", () => {
    expect(completedValues(fields)).toEqual({ work_email: "jane@acme.com" });
    expect(missingFields(fields, ["work_email", "mobile"])).toEqual({
      mobile: "No provider had a number",
    });
  });

  it("summarizes a profile to current roles", () => {
    expect(
      summarizeProfile({
        name: "Jane",
        primary_job_title: "CTO",
        current_location_city: "Berlin",
        current_location_country: "Germany",
        employment_history: [
          { job_title: "CTO", company_name: "Acme", is_current_employer: true },
          { job_title: "Engineer", company_name: "Old", is_current_employer: false },
        ],
      }),
    ).toEqual({
      name: "Jane",
      job_title: "CTO",
      location: "Berlin, Germany",
      current_roles: [{ title: "CTO", company: "Acme" }],
    });
  });
});
