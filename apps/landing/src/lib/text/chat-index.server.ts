import { catalogPages } from "@/lib/catalog.server";
import { getLLMText } from "@/lib/get-llm-text.server";
import { source } from "@/lib/source.server";

/** Docs text for Ask AI, prerendered so the chat Worker reads a file. */
export async function chatIndex() {
  const docs = await Promise.all(
    source.getPages().map(async (page) => ({
      url: page.url,
      title: page.data.title,
      description: page.data.description ?? "",
      content: await getLLMText(page),
    })),
  );
  const catalog = catalogPages.map((page) => ({
    url: page.url,
    title: page.title,
    description: page.description,
    content: page.markdown,
  }));
  return Response.json([...docs, ...catalog]);
}
