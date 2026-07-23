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
    "> pipe0 is a data enrichment platform with two surfaces on one engine: a developer API and Sheets, a Clay-style spreadsheet UI with tables that hold 2M records, scheduled workflows and reports, and point-in-time recovery. Combine 50+ data providers to find and validate emails, enrich people and companies, and automate sales workflows — from code, from a sheet, or through MCP from agents like Claude Code, ChatGPT, and Cursor.",
  );
  lines.push("");
  lines.push("## Product");
  lines.push("");
  lines.push(
    "- [pipe0](https://pipe0.com): Data enrichment API and Clay-alternative spreadsheet for sales automation",
  );
  lines.push(
    "- [Pricing](https://pipe0.com/pricing): Usage-based credits, free tier, no credit card required",
  );
  for (const config of compareConfigs) {
    lines.push(
      `- [pipe0 vs ${config.competitor}](https://pipe0.com/compare/${config.slug}): ${config.llmsLine ?? config.metaDescription}`,
    );
  }

  // Group docs pages by top-level section so the index stays scannable.
  const sections = new Map<string, string[]>();
  for (const page of source.getPages()) {
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

  lines.push("");
  lines.push("## Full Documentation");
  lines.push("");
  lines.push("- [Full docs as single file](https://pipe0.com/llms-full.txt)");
  lines.push("");
  lines.push("## Notes");
  lines.push("");
  lines.push(
    "- Individual pages can be accessed as markdown by appending `.mdx` to any docs URL (e.g. https://pipe0.com/docs/getting-started.mdx)",
  );
  lines.push(
    "- The full documentation is available at https://pipe0.com/llms-full.txt",
  );

  return new Response(lines.join("\n"));
}
