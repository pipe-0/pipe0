import { getLLMText } from "@/lib/get-llm-text.server";
import { isCatalogEntry, source } from "@/lib/source.server";

async function markdown(slugs: string[]) {
  const page = source.getPage(slugs);
  if (page) return getLLMText(page);
  if (!isCatalogEntry(slugs)) return undefined;
  const { catalogPage } = await import("@/lib/catalog.server");
  return catalogPage(slugs)?.markdown;
}

/** The markdown twin of a docs page, served at /docs/<slug>.mdx. */
export async function docsMarkdown(slugs: string[]) {
  const text = await markdown(slugs);
  if (text === undefined) return new Response(null, { status: 404 });
  return new Response(text, {
    headers: { "Content-Type": "text/markdown" },
  });
}
