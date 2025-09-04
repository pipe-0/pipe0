"use-client";

import { CodeTabs } from "@/components/code-tabs";
import oasToSnippet from "@readme/oas-to-snippet";
import { SupportedTargets } from "@readme/oas-to-snippet/languages";
import Oas from "oas";
import { Operation } from "oas/operation";
import { DataForHAR } from "oas/types";
import { useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

const languageOptions: SupportedTargets[] = [
  "javascript",
  "python",
  "shell",
  "go",
  "php",
  "http",
];

export function ApiRequestCodeExample({
  operation,
  oas,
  harData,
}: {
  oas: Oas;
  operation: Operation;
  harData: DataForHAR;
}) {
  const snippets = useMemo(() => {
    return languageOptions.map((o) => {
      const { code } = oasToSnippet(
        oas,
        operation,
        harData,
        {
          bearerAuth: "<TOKEN>",
        },
        o
      );
      return code;
    });
  }, []);

  return (
    <div>
      <CodeTabs items={languageOptions}>
        {languageOptions.map((option, i) => (
          <SyntaxHighlighter
            key={option}
            language="typescript"
            style={vscDarkPlus}
            customStyle={{ borderRadius: "0.375rem" }}
          >
            {String(snippets[i])}
          </SyntaxHighlighter>
        ))}
      </CodeTabs>
    </div>
  );
}
