import AppLink from "@/components/app-link";
import { CatalogDeprecationAlert } from "@/components/catalog-deprecation-alert";
import { CatalogNoticeAlert } from "@/components/catalog-notice-alert";
import { PayloadDocumenation } from "@/components/config-documentation";
import { ApiRequestCodeExample } from "@/components/features/docs/api-request-code-example";
import { DynamicCodeBlock } from "@/components/features/docs/dynamic-code-block";
import { HeaderVideoSection } from "@/components/features/docs/header-video-section";
import { PipeFormPreview } from "@/components/features/docs/pipe-form-preview";
import { BandCard } from "@/components/features/pipe-catalog/band-card";
import { CategoryBadge } from "@/components/features/pipe-catalog/category-badge";
import {
  EntryHeader,
  SectionTriggerLabel,
} from "@/components/features/pipe-catalog/entry-header";
import { FieldRow } from "@/components/features/pipe-catalog/field-row";
import { OutputBands } from "@/components/features/pipe-catalog/output-bands";
import { ProviderTable } from "@/components/features/pipe-catalog/provider-table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { CodeExample } from "@/lib/api-snippets.server";
import type { PipeEntryData } from "@/lib/catalog-entry.server";
import { docsLinkPaths } from "@pipe0/doc-links";
import { Callout } from "fumadocs-ui/components/callout";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Terminal, Upload } from "lucide-react";

const DEFAULT_OPEN_ITEMS = [
  "providers",
  "input-fields",
  "output-fields",
  "walkthrough",
];

const INPUT_BANDS = {
  all: {
    label: "All required",
    description: "Every field below must be set.",
    tone: "required",
  },
  atLeastOne: {
    label: "At least one",
    description: "Provide at least one of the fields below.",
    tone: "atLeastOne",
  },
  none: {
    label: "Optional",
    description: "These fields are optional.",
    tone: "muted",
  },
} as const;

function FieldModeCallout({ kind }: { kind: "Input" | "Output" }) {
  return (
    <Callout
      type="info"
      title={
        <>
          {kind} field mode: <code>config</code>
        </>
      }
    >
      This pipe&apos;s {kind.toLowerCase()} fields{" "}
      <AppLink linkType="fieldModeConfig">can be configured by you</AppLink>.
    </Callout>
  );
}

export function PipeCatalogHeader({
  entry,
  codeExamples,
}: {
  entry: PipeEntryData;
  codeExamples: CodeExample[];
}) {
  const { formConfig, inputs, outputs, video } = entry;

  return (
    <div className="space-y-5">
      <EntryHeader
        id={entry.id}
        idLabel="Copy pipe id"
        label={entry.label}
        description={entry.description}
        provider={entry.provider}
        providerCount={entry.providerCount}
        badge={entry.category && <CategoryBadge category={entry.category} />}
        deprecated={!!entry.deprecatedOn}
        versions={entry.versions}
        price={entry.price}
      />

      <CatalogNoticeAlert notice={entry.notice} />

      {entry.deprecatedOn && (
        <CatalogDeprecationAlert
          kind="pipe"
          deprecatedOn={entry.deprecatedOn}
          successor={entry.successor}
        />
      )}

      <Accordion type="multiple" defaultValue={DEFAULT_OPEN_ITEMS}>
        <AccordionItem value="providers">
          <AccordionTrigger>
            <SectionTriggerLabel
              label="Providers"
              count={entry.operations.length}
            />
          </AccordionTrigger>
          <AccordionContent className="pl-6">
            <ProviderTable rows={entry.operations} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="input-fields">
          <AccordionTrigger>
            <SectionTriggerLabel label="Input fields" count={inputs?.count} />
          </AccordionTrigger>
          <AccordionContent className="pl-6">
            {!inputs ? (
              <FieldModeCallout kind="Input" />
            ) : inputs.groups.length === 0 ? (
              <Alert>
                <Upload className="h-4 w-4" />
                <AlertTitle>No input fields</AlertTitle>
                <AlertDescription>
                  <p>This pipe&apos;s has no input fields.</p>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {inputs.groups.map((group, index) => (
                  <BandCard
                    key={index}
                    {...INPUT_BANDS[group.condition]}
                    count={group.fields.length}
                  >
                    {group.fields.map((field) => (
                      <FieldRow key={field.name} field={field} />
                    ))}
                  </BandCard>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="output-fields">
          <AccordionTrigger>
            <SectionTriggerLabel label="Output fields" count={outputs?.count} />
          </AccordionTrigger>
          <AccordionContent className="pl-6">
            {outputs ? (
              <OutputBands
                enabled={outputs.enabled}
                optional={outputs.optional}
                kind="pipe"
              />
            ) : (
              <FieldModeCallout kind="Output" />
            )}
          </AccordionContent>
        </AccordionItem>

        {video && (
          <AccordionItem value="walkthrough">
            <AccordionTrigger>
              <SectionTriggerLabel label="Walkthrough" hint="2 min" />
            </AccordionTrigger>
            <AccordionContent className="pl-6">
              <HeaderVideoSection videoUrl={video} />
            </AccordionContent>
          </AccordionItem>
        )}

        {codeExamples.length > 0 && (
          <AccordionItem value="code-examples">
            <AccordionTrigger>
              <SectionTriggerLabel
                label="Code examples"
                hint="POST /v1/pipes/run"
              />
            </AccordionTrigger>
            <AccordionContent className="pl-6">
              <ApiRequestCodeExample examples={codeExamples} />
            </AccordionContent>
          </AccordionItem>
        )}

        {formConfig && (
          <AccordionItem value="config-reference">
            <AccordionTrigger>
              <SectionTriggerLabel
                label="Config reference"
                count={entry.configFieldCount}
              />
            </AccordionTrigger>
            <AccordionContent className="pl-6">
              <PayloadDocumenation
                formConfig={formConfig}
                vocabulary={entry.vocabulary}
                examplePayload={entry.examplePayload}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="default-config">
          <AccordionTrigger>
            <SectionTriggerLabel label="Default config" />
          </AccordionTrigger>
          <AccordionContent className="pl-6">
            <div className="space-y-3">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Config is optional</AlertTitle>
                <AlertDescription>
                  This example spells out the default config. Send only the
                  values you want to change.
                </AlertDescription>
              </Alert>
              <Tabs items={["Typescript", "cURL"]}>
                <Tab value="Typescript">
                  <DynamicCodeBlock
                    lang="typescript"
                    code={`const result = await fetch("https://api.pipe0.com/v1/pipes/run", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    pipes: [${JSON.stringify(entry.defaultPayload, null, 2).replace(
      /\n/g,
      "\n    ",
    )}],
    input: [] // <- your inputs go here
  })
});`}
                  />
                </Tab>
                <Tab value="cURL">
                  <DynamicCodeBlock
                    lang="bash"
                    code={`curl -X POST "https://api.pipe0.com/v1/pipes/run" \\
-H "Authorization: Bearer $API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
    "pipes": [{ "pipe_id": "${entry.id}" }],
    "input": []
}'`}
                  />
                </Tab>
              </Tabs>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="form-ui">
          <AccordionTrigger>
            <SectionTriggerLabel label="Form UI" hint="Beta" />
          </AccordionTrigger>
          <AccordionContent className="pl-6">
            {formConfig && (
              <PipeFormPreview
                pipeId={entry.id}
                pipeLabel={entry.label}
                docsHref={docsLinkPaths.elementsReact}
              />
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
