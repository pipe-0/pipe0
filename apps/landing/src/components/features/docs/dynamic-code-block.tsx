"use client";

import { useShiki } from "fumadocs-core/highlight/client";
import {
  CodeBlock,
  Pre,
} from "fumadocs-ui/components/codeblock";
import { Suspense } from "react";

const shikiComponents = { pre: Pre };

function ShikiHighlight({ code, lang }: { code: string; lang: string }) {
  const rendered = useShiki(code, {
    lang,
    themes: {
      light: "catppuccin-latte",
      dark: "catppuccin-mocha",
    },
    components: shikiComponents,
  });
  return <>{rendered}</>;
}

export function DynamicCodeBlock({
  code,
  lang,
}: {
  code: string;
  lang: string;
}) {
  return (
    <CodeBlock>
      <Suspense
        fallback={
          <Pre>
            <code>{code}</code>
          </Pre>
        }
      >
        <ShikiHighlight code={code} lang={lang} />
      </Suspense>
    </CodeBlock>
  );
}
