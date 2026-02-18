import { source } from "@/lib/source";

export const revalidate = false;

export async function GET() {
  const lines: string[] = [];

  lines.push("# pipe0 Documentation");
  lines.push("");
  lines.push("> The data enrichment framework. Combine 50+ data providers into custom pipelines for lead and company enrichment.");
  lines.push("");
  lines.push("## Docs");
  lines.push("");

  for (const page of source.getPages()) {
    const description = page.data.description
      ? `: ${page.data.description}`
      : "";
    lines.push(`- [${page.data.title}](https://pipe0.com${page.url})${description}`);
  }

  lines.push("");
  lines.push("## Full Documentation");
  lines.push("");
  lines.push("- [Full docs as single file](https://pipe0.com/llms-full.txt)");
  lines.push("");
  lines.push("## Notes");
  lines.push("");
  lines.push("- Individual pages can be accessed as markdown by appending `.mdx` to any docs URL (e.g. https://pipe0.com/docs/getting-started.mdx)");
  lines.push("- The full documentation is available at https://pipe0.com/llms-full.txt");

  return new Response(lines.join("\n"));
}
