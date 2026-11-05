import type { TOCItemType } from "fumadocs-core/toc";

/**
 * "In this post" — jump links to the H2s, folded by default so the header
 * stays short. Plain anchors, no client JS; only rendered on posts long
 * enough to need one.
 */
export function PostToc({ items }: { items: TOCItemType[] }) {
  const sections = items.filter((item) => item.depth === 2);
  if (sections.length < 3) return null;

  return (
    <details className="group mx-auto mt-10 max-w-[680px] border-y border-fd-border py-3 sm:mt-12">
      <summary className="cursor-pointer list-none text-[13px] font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground [&::-webkit-details-marker]:hidden">
        <span className="mr-1.5 inline-block transition-transform group-open:rotate-90">
          ›
        </span>
        In this post · {sections.length} sections
      </summary>
      <ol className="mt-3 space-y-1.5 pb-1 pl-5 text-[14px] leading-snug">
        {sections.map((item) => (
          <li key={item.url} className="list-decimal text-fd-muted-foreground">
            <a
              href={item.url}
              className="text-fd-foreground transition-colors hover:text-fd-primary"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
