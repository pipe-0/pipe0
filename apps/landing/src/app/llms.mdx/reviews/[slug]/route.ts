import { formatDate, lastRevised } from "@/app/blog/blog-utils";
import {
  benchmarkCaveats,
  CRITERIA,
  disclosureFor,
  formatScore,
  formatStartingPrice,
  isVisible,
  overallScore,
} from "@/app/reviews/review-utils";
import { authorDisplayName, authorUrl, getAuthor } from "@/lib/authors";
import { reviews } from "@/lib/source";
import { getBaseUrl } from "@/lib/utils";
import { notFound } from "next/navigation";

export const revalidate = false;

export const dynamicParams = false;

/** Escapes a value for a markdown table cell. */
function cell(value: string) {
  return value.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

/**
 * A review as plain markdown — /reviews/<slug>.md. Carries the structured
 * parts the HTML page renders around the prose (score table, verdict,
 * facts, pros and cons, pricing, alternatives, FAQ), in the same order.
 */
export async function GET(
  _req: Request,
  { params }: RouteContext<"/llms.mdx/reviews/[slug]">,
) {
  const { slug } = await params;
  const page = reviews.getPage([slug]);
  if (!page || !isVisible(page)) notFound();

  const d = page.data;
  const tool = d.tool.name;
  const base = getBaseUrl();
  const byline = d.authors
    .map((a) => {
      const managed = getAuthor(a.name);
      const name = authorDisplayName(a.name);
      return managed ? `[${name}](${base}${authorUrl(managed)})` : name;
    })
    .join(", ");

  const lines: string[] = [
    `# ${d.title}`,
    "",
    [
      byline && `By ${byline}`,
      `Published ${formatDate(d.date)}`,
      d.updated && `Updated ${formatDate(lastRevised(page))}`,
    ]
      .filter(Boolean)
      .join(" · "),
    "",
    `Source: ${base}${page.url}`,
    `Scoring method: ${base}/reviews#methodology`,
    `Disclosure: ${disclosureFor(page)}`,
  ];
  if (d.description) lines.push("", `> ${d.description}`);

  lines.push(
    "",
    `**Verdict: ${formatScore(overallScore(d.scores))}/5.** ${d.verdict}`,
    "",
    "| Criterion | Score | Why |",
    "| --- | --- | --- |",
    ...CRITERIA.map(
      (c) =>
        `| ${c.label} | ${formatScore(d.scores[c.key].score)}/5 | ${cell(d.scores[c.key].why)} |`,
    ),
    `| **Overall** (mean) | **${formatScore(overallScore(d.scores))}/5** | |`,
    "",
    "**Best for:**",
    "",
    ...d.bestFor.map((item) => `- ${item}`),
    "",
    "**Skip it if:**",
    "",
    ...d.skipIf.map((item) => `- ${item}`),
    "",
    `**Price:** from ${formatStartingPrice(page)} ${d.pricing.startingAtNote}. ${d.pricing.freePlan ? "Free plan available." : "No free plan."}`,
    "",
    `## ${tool} at a glance`,
    "",
    ...d.facts.map(
      (f) => `- **${f.label}:** ${f.value}${f.source ? ` ([source](${f.source}))` : ""}`,
    ),
    ...(d.benchmark
      ? [
          "",
          `## ${tool} in our benchmark`,
          "",
          d.benchmark.verification
            ? `pipe0 ran the same labelled addresses through every verifier it tests and scored each verdict against the known answer (${d.benchmark.period}).`
            : `pipe0 ran the same records through every provider it tests (${d.benchmark.period}).`,
          "",
          ...(d.benchmark.rows.length > 0
            ? [
                "| Test | Records | Coverage | Agreement | Median time | Run |",
                "| --- | --- | --- | --- | --- | --- |",
              ]
            : []),
          ...d.benchmark.rows.map(
            (r) =>
              `| ${cell(r.test)} (${r.dataset === "signups" ? "signup emails" : "LinkedIn profiles"}) | ${r.n} | ${r.coverage}% | ${r.agreement !== undefined ? `${r.agreement}%` : "–"} | ${r.latency ?? "–"} | ${r.run} |`,
          ),
          ...(d.benchmark.verification
            ? [
                "",
                `### Verifier scorecard (run ${d.benchmark.verification.run})`,
                "",
                `${d.benchmark.verification.n} labelled addresses, ${d.benchmark.verification.valid} known valid and ${d.benchmark.verification.n - d.benchmark.verification.valid} known invalid. Catch-all and unknown count as undetermined, never as wrong.`,
                "",
                "| Verifier | Accuracy | Real confirmed | Fakes caught | Fakes passed as valid | Real called invalid | Undetermined | Median time |",
                "| --- | --- | --- | --- | --- | --- | --- | --- |",
                ...d.benchmark.verification.rows.map(
                  (r) =>
                    `| ${r.provider} | ${Math.round(r.accuracy)}% | ${r.validConfirmed}/${d.benchmark!.verification!.valid} | ${r.invalidCaught}/${d.benchmark!.verification!.n - d.benchmark!.verification!.valid} | ${r.falsePositives} | ${r.falseNegatives} | ${r.undetermined} | ${r.latency ?? "–"} |`,
                ),
              ]
            : []),
          ...(d.benchmark.latency
            ? [
                "",
                `### How fast ${tool} answers`,
                "",
                `${d.benchmark.latency.test}, median response time per lookup (run ${d.benchmark.latency.run}).`,
                "",
                `- ${tool}: ${d.benchmark.latency.seconds.toFixed(1)} s`,
                ...d.benchmark.latency.others.map(
                  (o) =>
                    `- ${o.provider}${o.tier ? ` (${o.tier.toLowerCase()})` : ""}: ${o.seconds.toFixed(1)} s`,
                ),
              ]
            : []),
          ...(d.benchmark.agreement
            ? [
                "",
                `### How often ${tool} agrees with other providers`,
                "",
                `${d.benchmark.agreement.test} (run ${d.benchmark.agreement.run}).`,
                "",
                ...d.benchmark.agreement.pairs.map(
                  (p) =>
                    `- ${p.provider}${p.tier ? ` (${p.tier.toLowerCase()})` : ""}: ${tool} and ${p.provider} returned the same ${d.benchmark!.agreement!.unit} for ${p.agreed} of ${p.compared} ${d.benchmark!.agreement!.subject} (${Math.round((p.agreed / p.compared) * 100)}%).`,
                ),
              ]
            : []),
          "",
          ...benchmarkCaveats(d.benchmark).map(
            (n) => `- ${n}`,
          ),
        ]
      : []),
    "",
    // MDX comments hold the editorial fact base; they stay in the repo.
    (await page.data.getText("processed"))
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
      .trim(),
    "",
    `## ${tool} pros and cons`,
    "",
    "### Pros",
    "",
    ...d.pros.flatMap((p) => [`- **${p.title}.** ${p.body}`]),
    "",
    "### Cons",
    "",
    ...d.cons.flatMap((c) => [`- **${c.title}.** ${c.body}`]),
    "",
    `## ${tool} pricing`,
    "",
    "| Plan | Price | What you get |",
    "| --- | --- | --- |",
    ...d.pricing.plans.map(
      (p) => `| ${cell(p.name)} | ${cell(p.price)} | ${cell(p.includes)} |`,
    ),
    "",
    ...(d.pricing.notes ?? []).map((n) => `- ${n}`),
    "",
    `Prices as of ${formatDate(d.pricing.asOf)}, from ${d.pricing.source}.`,
    "",
    `## ${tool} alternatives`,
    "",
    ...d.alternatives.map(
      (a) =>
        `- [${a.name}](${a.href.startsWith("/") ? base + a.href : a.href}): ${a.why}`,
    ),
  );
  if (d.compare) {
    lines.push("", `Full comparison: [pipe0 vs ${tool}](${base}${d.compare})`);
  }
  if (d.faq.length) {
    lines.push("", "## FAQ");
    for (const { q, a } of d.faq) lines.push("", `### ${q}`, "", a);
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}

export function generateStaticParams() {
  return reviews
    .getPages()
    .filter(isVisible)
    .map((page) => ({ slug: page.slugs[0] }));
}
