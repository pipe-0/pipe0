import { sortedPosts } from "@/app/blog/blog-utils";
import { authorDisplayName } from "@/lib/authors";
import { getBaseUrl } from "@/lib/utils";

export const revalidate = false;

function escape(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** RSS 2.0 feed of published posts, newest first. */
export function GET() {
  const base = getBaseUrl();
  const posts = sortedPosts();

  const items = posts.map((post) => {
    const url = `${base}${post.url}`;
    const summary = post.data.excerpt ?? post.data.description ?? "";
    const authors = (post.data.authors ?? [])
      .map((a) => authorDisplayName(a.name))
      .join(", ");
    return [
      "    <item>",
      `      <title>${escape(post.data.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${new Date(post.data.date).toUTCString()}</pubDate>`,
      authors && `      <dc:creator>${escape(authors)}</dc:creator>`,
      post.data.category &&
        `      <category>${escape(post.data.category)}</category>`,
      summary && `      <description>${escape(summary)}</description>`,
      "    </item>",
    ]
      .filter(Boolean)
      .join("\n");
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Signal &amp; Noise · pipe0</title>
    <link>${base}/blog</link>
    <description>A journal from pipe0 on data, pipelines, and the craft of building software.</description>
    <language>en</language>
    <atom:link href="${base}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${posts[0] ? `    <lastBuildDate>${new Date(posts[0].data.date).toUTCString()}</lastBuildDate>\n` : ""}${items.join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
