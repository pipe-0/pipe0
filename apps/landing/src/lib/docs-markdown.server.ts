import { getLLMText } from "@/lib/get-llm-text.server";
import { source } from "@/lib/source.server";
import { notFound } from "@tanstack/react-router";

/** The markdown twin of a docs page, served at /docs/<slug>.mdx. */
export async function docsMarkdown(slugs: string[]) {
  const page = source.getPage(slugs);
  if (!page) throw notFound();
  return new Response(await getLLMText(page), {
    headers: { "Content-Type": "text/markdown" },
  });
}
