import { Tabs, Tab } from "fumadocs-ui/components/tabs";
import { DynamicCodeBlock } from "@/components/features/docs/dynamic-code-block";
import type { CodeExample } from "@/lib/api-snippets.server";

export function ApiRequestCodeExample({
  examples,
}: {
  examples: CodeExample[];
}) {
  return (
    <div>
      <Tabs items={examples.map(({ language }) => language)}>
        {examples.map(({ language, code }) => (
          <Tab key={language} value={language}>
            <DynamicCodeBlock
              code={code}
              lang={language === "shell" ? "bash" : language}
            />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
