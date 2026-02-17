import oasToSnippet from "@readme/oas-to-snippet";
import { SupportedTargets } from "@readme/oas-to-snippet/languages";
import Oas from "oas";
import { Operation } from "oas/operation";
import { DataForHAR } from "oas/types";
import { Tabs, Tab } from "fumadocs-ui/components/tabs";
import { useMemo } from "react";
import { DynamicCodeBlock } from "@/components/features/docs/dynamic-code-block";

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
        o,
      );
      return code;
    });
  }, []);

  return (
    <div>
      <Tabs items={languageOptions}>
        {languageOptions.map((option, i) => (
          <Tab key={option} value={option}>
            <DynamicCodeBlock code={String(snippets[i])} lang={option === "shell" ? "bash" : option} />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
