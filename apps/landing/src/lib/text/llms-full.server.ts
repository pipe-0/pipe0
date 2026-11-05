import { catalogPages } from "@/lib/catalog.server";
import { getLLMText } from "@/lib/get-llm-text.server";
import { source } from "@/lib/source.server";

export async function llmsFullTxt() {
  const docs = await Promise.all(source.getPages().map(getLLMText));
  // Deprecated catalog pages go last, so a reader meets the current version of
  // a pipe or search before the deprecated ones that share its label.
  const current = catalogPages.filter((page) => !page.deprecation);
  const deprecated = catalogPages.filter((page) => page.deprecation);

  return new Response(
    [...docs, ...[...current, ...deprecated].map((page) => page.markdown)].join(
      "\n\n",
    ),
  );
}
