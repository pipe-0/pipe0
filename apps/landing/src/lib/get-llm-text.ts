import { source } from "@/lib/source";
import type { InferPageType } from "fumadocs-core/source";

export async function getLLMText(page: InferPageType<typeof source>) {
  if ("getText" in page.data) {
    const processed = await page.data.getText("processed");

    return `# ${page.data.title} (${page.url})

${processed}`;
  }

  if ("_markdown" in page.data && page.data._markdown) {
    return page.data._markdown as string;
  }

  return "";
}
