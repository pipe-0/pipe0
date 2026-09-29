import { source } from "@/lib/source";
import { getLLMText } from "@/lib/get-llm-text";
import { deprecatedCatalogPage } from "@/lib/catalog-lifecycle";

// cached forever
export const revalidate = false;

export async function GET() {
  // Deprecated catalog pages go last, so a reader meets the current version of
  // a pipe or search before the deprecated ones that share its label.
  const pages = source.getPages();
  const isDeprecated = (page: (typeof pages)[number]) =>
    deprecatedCatalogPage(page.data as unknown as Record<string, unknown>) !==
    null;
  const ordered = [
    ...pages.filter((page) => !isDeprecated(page)),
    ...pages.filter(isDeprecated),
  ];
  const scan = ordered.map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join("\n\n"));
}
