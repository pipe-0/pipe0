import { highlight } from "fumadocs-core/highlight";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { pipe0CodeTheme } from "@/lib/shiki-theme";

const shikiComponents = { pre: Pre };

/**
 * Server-side highlighted code block. Prefer this over `DynamicCodeBlock`
 * anywhere the code is known at render time (MDX pages, server components):
 * the highlighted HTML is part of the static payload, so there is no
 * unstyled flash or layout shift while shiki loads in the browser.
 */
export async function StaticCodeBlock({
  code,
  lang,
  className,
}: {
  code: string;
  lang: string;
  className?: string;
}) {
  const rendered = await highlight(code, {
    lang,
    // One theme, the brand palette — the site has no dark mode.
    theme: pipe0CodeTheme,
    components: shikiComponents,
  });

  return <CodeBlock className={className}>{rendered}</CodeBlock>;
}
