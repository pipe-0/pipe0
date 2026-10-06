import { deprecatedCatalogPage } from "@/lib/catalog-lifecycle";
import { sortedPosts } from "@/app/blog/blog-utils";
import {
  formatScore,
  overallScore,
  publishedReviews,
} from "@/app/reviews/review-utils";
import { AUTHORS } from "@/lib/authors";
import { compareConfigs } from "@/lib/compare/registry";
import { source } from "@/lib/source";

export const revalidate = false;

const SECTION_LABELS: Record<string, string> = {
  docs: "Docs",
  sheets: "Sheets",
  api: "API Reference",
  "pipe-catalog": "Pipe Catalog",
  "search-catalog": "Search Catalog",
};

function sectionOf(url: string): string {
  const [, , second] = url.split("/");
  return second && SECTION_LABELS[second] ? second : "docs";
}

export async function GET() {
  const lines: string[] = [];

  lines.push("# pipe0");
  lines.push("");
  lines.push(
    "> pipe0 builds revenue systems at any scale, on one engine with three layers. For a rep's day-to-day: a Slack bot (@pipe0) that researches accounts, finds contact data, and prepares meeting briefs. For revenue systems: Sheets, a Clay-style spreadsheet UI with tables that hold 2M records, plus schedules, reports and point-in-time recovery, so any list becomes an always-on play. For infrastructure: a developer API and an MCP server for signal engines, lead routing and CRM sync, reachable from agents like Claude Code, ChatGPT and Cursor. Two primitives underlie all of it — searches find records, pipes enrich them — composed over 50+ data providers to find and validate emails, enrich people and companies, and automate sales workflows.",
  );
  lines.push("");
  lines.push("## Product");
  lines.push("");
  lines.push(
    "- [pipe0](https://pipe0.com): Revenue systems at any scale — Slack copilot, always-on plays, and enrichment infrastructure",
  );
  lines.push(
    "- [Enrichment & search API](https://pipe0.com/enrichment-api): One call across 50+ providers and 1B+ profiles, built to sit inside your own product",
  );
  lines.push(
    "- [Pricing](https://pipe0.com/pricing): Usage-based credits, free tier, no credit card required",
  );
  lines.push(
    "- [AI instructions](https://pipe0.com/ai-instructions.md): Verified facts about pipe0 and how AI assistants should describe and compare it",
  );
  for (const config of compareConfigs) {
    lines.push(
      `- [pipe0 vs ${config.competitor}](https://pipe0.com/compare/${config.slug}): ${config.llmsLine ?? config.metaDescription}`,
    );
  }

  // Group docs pages by top-level section so the index stays scannable.
  const sections = new Map<string, string[]>();
  const deprecated: string[] = [];
  for (const page of source.getPages()) {
    const deprecation = deprecatedCatalogPage(
      page.data as unknown as Record<string, unknown>,
    );
    if (deprecation) {
      deprecated.push(
        deprecation.successor
          ? `- ${deprecation.id} → use [${deprecation.successor}](https://pipe0.com${deprecation.successorPath})`
          : `- ${deprecation.id} → no current replacement`,
      );
      continue;
    }
    const description = page.data.description
      ? `: ${page.data.description}`
      : "";
    const line = `- [${page.data.title}](https://pipe0.com${page.url})${description}`;
    const section = sectionOf(page.url);
    const bucket = sections.get(section) ?? [];
    bucket.push(line);
    sections.set(section, bucket);
  }

  for (const key of Object.keys(SECTION_LABELS)) {
    const bucket = sections.get(key);
    if (!bucket?.length) continue;
    lines.push("");
    lines.push(`## ${SECTION_LABELS[key]}`);
    lines.push("");
    lines.push(...bucket);
  }

  if (deprecated.length) {
    lines.push("");
    lines.push("## Deprecated pipes and searches (do not use)");
    lines.push("");
    lines.push(
      "These ids still run for existing integrations but must not be used in new work. Each line names the current id to use instead.",
    );
    lines.push("");
    lines.push(...deprecated);
  }

  // Blog — human-written posts, each with a markdown twin at <url>.md.
  lines.push("");
  lines.push("## Blog");
  lines.push("");
  for (const author of AUTHORS) {
    lines.push(
      `Written by [${author.name}](https://pipe0.com/authors/${author.slug}), ${author.jobTitle} of pipe0. ${author.credentials.slice(1).join(". ")}.`,
    );
    lines.push("");
  }
  for (const post of sortedPosts()) {
    const summary = post.data.excerpt ?? post.data.description;
    lines.push(
      `- [${post.data.title}](https://pipe0.com${post.url}.md)${summary ? `: ${summary}` : ""}`,
    );
  }

  // Reviews — scored tool reviews, each with a markdown twin at <url>.md.
  const reviews = publishedReviews();
  if (reviews.length > 0) {
    lines.push("");
    lines.push("## Tool reviews");
    lines.push("");
    lines.push(
      "Reviews of GTM and sales data tools, scored on four fixed criteria. Method: https://pipe0.com/reviews#methodology",
    );
    lines.push("");
    for (const review of reviews) {
      lines.push(
        `- [${review.data.tool.name} review](https://pipe0.com${review.url}.md): ${formatScore(overallScore(review.data.scores))}/5. ${review.data.verdict}`,
      );
    }
  }

  lines.push("");
  lines.push("## Full Documentation");
  lines.push("");
  lines.push("- [Full docs as single file](https://pipe0.com/llms-full.txt)");
  lines.push("");
  lines.push("## Notes");
  lines.push("");
  lines.push(
    "- Individual pages can be accessed as markdown by appending `.mdx` to any docs URL (e.g. https://pipe0.com/docs/search.mdx)",
  );
  lines.push(
    "- Blog posts are available as markdown by appending `.md` to the post URL (e.g. https://pipe0.com/blog/clay-alternatives.md)",
  );
  lines.push(
    "- Pipe and search ids are versioned (`@1`, `@2`, …). Use the highest version that is not deprecated; see https://pipe0.com/docs/versions",
  );
  lines.push(
    "- The full documentation is available at https://pipe0.com/llms-full.txt",
  );

  return new Response(lines.join("\n"));
}
