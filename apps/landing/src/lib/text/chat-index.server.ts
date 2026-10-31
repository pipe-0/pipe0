import { getLLMText } from "@/lib/get-llm-text.server";
import { source } from "@/lib/source.server";

/** Docs text for Ask AI, prerendered so the chat Worker reads a file. */
export async function GET() {
  const pages = source.getPages();
  const texts = await Promise.all(pages.map(getLLMText));
  return Response.json(
    pages.map((page, i) => ({
      url: page.url,
      title: page.data.title ?? "",
      description: page.data.description ?? "",
      content: texts[i] ?? "",
    })),
  );
}
