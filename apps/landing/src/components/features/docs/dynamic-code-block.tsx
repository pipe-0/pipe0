"use client";

import { useShiki } from "fumadocs-core/highlight/client";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { Fragment, Suspense } from "react";

const shikiComponents = { pre: Pre };

function ShikiHighlight({ code, lang }: { code: string; lang: string }) {
  const rendered = useShiki(code, {
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
  return <>{rendered}</>;
}

/**
 * Mirrors shiki's output structure (`pre.shiki > code > span.line` separated
 * by newlines) so fumadocs' `.shiki .line` padding applies to the fallback
 * too — otherwise the code paints flush-left and shifts right once
 * highlighting resolves.
 */
function PlainFallback({ code }: { code: string }) {
  return (
    <Pre className="shiki">
      <code>
        {code.split("\n").map((line, i) => (
          <Fragment key={i}>
            {i > 0 && "\n"}
            <span className="line">{line}</span>
          </Fragment>
        ))}
      </code>
    </Pre>
  );
}

export function DynamicCodeBlock({
  code,
  lang,
  className,
}: {
  code: string;
  lang: string;
  className?: string;
}) {
  return (
    <CodeBlock className={className}>
      <Suspense fallback={<PlainFallback code={code} />}>
        <ShikiHighlight code={code} lang={lang} />
      </Suspense>
    </CodeBlock>
  );
}
