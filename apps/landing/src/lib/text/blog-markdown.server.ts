import { formatDate, lastRevised } from "@/components/blog/blog-utils";
import { authorDisplayName, authorUrl, getAuthor } from "@/lib/authors";
import { blog } from "@/lib/collections.server";
import { getBaseUrl } from "@/lib/utils";
import { notFound } from "@tanstack/react-router";

/**
 * A post as plain markdown — /blog/<slug>.md and `Accept: text/markdown`
 * both land here. The header carries what the HTML page shows around the
 * body (author, dates, canonical URL) so a quote keeps its attribution.
 */
export async function GET({ params: { slug } }: { params: { slug: string } }) {
  const page = blog.getPage([slug]);
  if (!page || page.data.draft === true) throw notFound();

  const url = `${getBaseUrl()}${page.url}`;
  const byline = (page.data.authors ?? [])
    .map((a) => {
      const managed = getAuthor(a.name);
      const name = authorDisplayName(a.name);
      return managed ? `[${name}](${getBaseUrl()}${authorUrl(managed)})` : name;
    })
    .join(", ");
  const published = formatDate(page.data.date);
  const revised = page.data.updated ? formatDate(lastRevised(page)) : null;

  const lines = [
    `# ${page.data.title}`,
    "",
    [
      byline && `By ${byline}`,
      `Published ${published}`,
      revised && `Updated ${revised}`,
    ]
      .filter(Boolean)
      .join(" · "),
    "",
    `Source: ${url}`,
  ];
  const lede = page.data.description ?? page.data.excerpt;
  if (lede) lines.push("", `> ${lede}`);
  if (page.data.tldr) lines.push("", `**TL;DR:** ${page.data.tldr}`);
  lines.push("", await page.data.getText("processed"));
  if (page.data.faq?.length) {
    lines.push("", "## FAQ");
    for (const { q, a } of page.data.faq) lines.push("", `### ${q}`, "", a);
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
