import type { Page } from "@/lib/source.server";

export async function getLLMText(page: Page) {
  return `# ${page.data.title} (${page.url})

${await page.data.getText("processed")}`;
}
