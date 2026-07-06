import { highlight } from "fumadocs-core/highlight";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";

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
    themes: {
      light: "catppuccin-latte",
      dark: "catppuccin-mocha",
    },
    // Emit both themes as CSS variables; without this shiki inlines the light
    // theme's colors directly and dark mode renders a light code block.
    defaultColor: false,
    components: shikiComponents,
  });

  return <CodeBlock className={className}>{rendered}</CodeBlock>;
}
