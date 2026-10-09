"use client";

import AppLink from "@/components/app-link";
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
import { ProviderTable } from "@/components/features/pipe-catalog/provider-table";
import { FieldRow } from "@/components/features/pipe-catalog/field-row";
import { HighVolumePriceCell } from "@/components/high-volume-price";
import { effectiveCredits } from "@/lib/pricing/effective-credits";
import { CatalogDeprecationAlert } from "@/components/catalog-deprecation-alert";
import { resolveCurrentPipe } from "@/lib/catalog-lifecycle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getPipeLowestPrice,
  getPipeStartingPrice,
} from "@/lib/pipes/get-pipe-starting-price";
import {
  getPipeProvidersInWaterfallOrder,
  sortByWaterfallOrder,
} from "@/lib/pipes/provider-order";
import { pipesMiniSpec } from "@/lib/pipes/snippet-catalog";
import { videoCatalog } from "@/lib/pipes/video-catalog";
import { formatCredits } from "@/lib/utils";
import { docsLinkPaths } from "@pipe0/doc-links";
import {
  BillableOperationDef,
  collectRequirementFields,
  FieldAnnotationsType,
  FieldName,
  getDefaultOutputFields,
  getField,
  getPipeDefaultPayload,
  getPipeEntry,
  getPipeInstances,
  getPipePayloadFormConfig,
  PipeCategory,
  PipeId,
  PipeInputField,
  PipePayload,
  pipesSnippetCatalog,
  providerCatalog,
  Requirement,
  sortPipeCatalogByBasePipe,
  validatePipesOrError,
} from "@pipe0/base";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Callout } from "fumadocs-ui/components/callout";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Terminal, Upload } from "lucide-react";
import { useMemo, useState } from "react";

const pipesByBasePipes = sortPipeCatalogByBasePipe();

type PipeHeaderProps = {
  pipeId: PipeId;
};

function getFieldAnnotations(payload: PipePayload) {
  const [instance] = getPipeInstances([payload]);
  if (!instance) {
    throw new Error("Can't create pipe instance");
  }
  const fieldAnnotations: FieldAnnotationsType = {};
  for (const { field } of collectRequirementFields(
    instance.getInputRequirement(),
  )) {
    fieldAnnotations[field.resolvedName] = {
      type: typeof field.type === "function" ? "unknown" : field.type,
      format: typeof field.format === "function" ? null : field.format,
      json_metadata: null,
      label: field.label,
    };
  }
  return fieldAnnotations;
}

type DisplayGroup = {
  condition: "all" | "atLeastOne" | "none";
  fields: PipeInputField[];
};

function requirementToDisplayGroups(r: Requirement | null): DisplayGroup[] {
  if (!r) return [];

  const requiredFields: PipeInputField[] = [];
  const optionalFields: PipeInputField[] = [];
  const atLeastOneGroups: PipeInputField[][] = [];

  function visit(node: Requirement) {
    switch (node.kind) {
      case "field":
        requiredFields.push(node.field);
        break;
      case "optional":
        optionalFields.push(node.field);
        break;
      case "all":
        node.of.forEach(visit);
        break;
      case "any":
        atLeastOneGroups.push(
          collectRequirementFields(node).map(({ field }) => field),
        );
        break;
    }
  }

  visit(r);

  const groups: DisplayGroup[] = [];
  if (requiredFields.length > 0) {
    groups.push({ condition: "all", fields: requiredFields });
  }
  for (const fields of atLeastOneGroups) {
    groups.push({ condition: "atLeastOne", fields });
  }
  if (optionalFields.length > 0) {
    groups.push({ condition: "none", fields: optionalFields });
  }
  return groups;
}

function countInputFields(r: Requirement | null): number {
  if (!r) return 0;
  return collectRequirementFields(r).length;
}

const DEFAULT_OPEN_ITEMS = [
  "providers",
  "input-fields",
  "output-fields",
  "walkthrough",
];

// Curated snippets pin config.environment, but production is already the
// API default; strip it so the rendered code examples stay minimal.
function toCodeExampleBody({
  config,
  ...rest
}: {
  config?: object;
  [key: string]: unknown;
}) {
  const cleanConfig: Record<string, unknown> = { ...config };
  delete cleanConfig.environment;
  return Object.keys(cleanConfig).length > 0
    ? { ...rest, config: cleanConfig }
    : rest;
}

export function PipeCatalogHeader({ pipeId }: PipeHeaderProps) {
  const pipeEntry = getPipeEntry(pipeId);
  const defaultPayload = getPipeDefaultPayload(pipeId);
  const defaultOutputFields = getDefaultOutputFields(pipeEntry);
  const pipeVersions = pipesByBasePipes[pipeEntry.basePipe];
  const defaultProviders = getPipeProvidersInWaterfallOrder(pipeId);
  // Deprecated providers keep their billing definitions (stored payloads
  // still reference them) but are never offered or billed — hide them.
  const billableEntries = sortByWaterfallOrder(
    pipeId,
    Object.entries(pipeEntry.billableOperations).filter(
      ([, def]) =>
        !(pipeEntry.deprecatedProviders as readonly string[]).includes(
          (def as BillableOperationDef).provider,
        ),
    ),
    ([, def]) => (def as BillableOperationDef).provider,
  );
  const startingPrice = getPipeStartingPrice(pipeId);
  const { lowest: lowestPrice } = getPipeLowestPrice(pipeId);
  const category = (pipeEntry.categories?.[0] ?? null) as PipeCategory | null;

  const video = videoCatalog[pipeId as keyof typeof videoCatalog] as
    | string
    | undefined;

  const availableVersions =
    pipeVersions?.map((v) => {
      const versionEntry = getPipeEntry(v.pipeId);
      return {
        displayValue: `@${v.pipeId.split("@")[1]}`,
        link: versionEntry.docPath,
        isDeprecated: !!versionEntry.lifecycle?.deprecatedOn,
      };
    }) ?? [];

  // The curated snippet payload doubles as the source of example values in
  // the config reference below.
  const deprecatedOn = pipeEntry.lifecycle?.deprecatedOn;
  const currentSuccessor = deprecatedOn ? resolveCurrentPipe(pipeId) : null;
  const snippetRequest = pipesSnippetCatalog[pipeId]?.[0];
  const snippetPayload = snippetRequest?.pipes?.[0];

  // Snippets ship without connections. When the pipe accepts user
  // connections, show a valid provider-prefixed vault string in the config
  // reference instead of an empty connector.
  const exampleProvider = pipeEntry.allowedUserConnectionProviders?.[0];
  const snippetConnections = snippetPayload
    ? (snippetPayload as { connector?: { connections?: unknown[] } | null })
        .connector?.connections
    : undefined;
  const configExamplePayload = !snippetPayload
    ? undefined
    : !exampleProvider || (snippetConnections && snippetConnections.length > 0)
      ? snippetPayload
      : {
          ...snippetPayload,
          connector: {
            strategy: "first",
            connections: [
              { type: "vault", connection: `${exampleProvider}_abcd123` },
            ],
          },
        };

  const formConfig = useMemo(() => {
    if (!snippetPayload) return null;
    try {
      const validationContext = validatePipesOrError({
        config: {
          environment: "production",
        },
        pipes: [snippetPayload],
        field_annotations: getFieldAnnotations(snippetPayload),
      });
      return getPipePayloadFormConfig({
        pipePayload: snippetPayload,
        validationContext,
        store: { field_options: {} },
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }, [snippetPayload]);

  const [openItems, setOpenItems] = useState<string[]>(DEFAULT_OPEN_ITEMS);


  const inputFieldCount =
    pipeEntry.inputFieldMode === "static"
      ? countInputFields(pipeEntry.defaultInputRequirement)
      : undefined;
  const outputFieldCount =
    pipeEntry.outputFieldMode === "static"
      ? defaultOutputFields.length
      : undefined;
  const configFieldCount = formConfig
    ? formConfig.flatMap((section) =>
        section.groups.flatMap((group) => group.fields),
      ).length
    : undefined;

  return (
    <div className="space-y-5">
      <EntryHeader
        id={pipeId}
        idLabel="Copy pipe id"
        label={pipeEntry.label}
        description={pipeEntry.description}
        providers={defaultProviders}
        badge={category && <CategoryBadge category={category} />}
        deprecated={!!deprecatedOn}
        versions={availableVersions}
        price={
          startingPrice ? `from ${formatCredits(lowestPrice)} cr / result` : "Free"
        }
      />

      {/* Deprecation alert */}
      {deprecatedOn && (
        <CatalogDeprecationAlert
          kind="pipe"
          deprecatedOn={deprecatedOn}
          successor={
            currentSuccessor
              ? {
                  id: currentSuccessor,
                  docPath: getPipeEntry(currentSuccessor).docPath,
                }
              : null
          }
        />
      )}

      <Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>
        {/* Providers */}
        <AccordionItem value="providers">
          <AccordionTrigger>
            <SectionTriggerLabel
              label="Providers"
              count={billableEntries.length}
            />
          </AccordionTrigger>
          <AccordionContent className="pl-6">
            <ProviderTable entries={billableEntries} />
          </AccordionContent>
        </AccordionItem>

        {/* Input fields */}
        <AccordionItem value="input-fields">
          <AccordionTrigger>
            <SectionTriggerLabel label="Input fields" count={inputFieldCount} />
          </AccordionTrigger>
          <AccordionContent className="pl-6">
            {pipeEntry.inputFieldMode === "static" ? (
              <div className="space-y-2">
                {(() => {
                  const inputGroups = requirementToDisplayGroups(
                    pipeEntry.defaultInputRequirement,
                  );
                  if (inputGroups.length === 0) {
                    return (
                      <Alert>
                        <Upload className="h-4 w-4" />
                        <AlertTitle>No input fields</AlertTitle>
                        <AlertDescription>
                          <p>This pipe&apos;s has no input fields.</p>
                        </AlertDescription>
                      </Alert>
                    );
                  }
                  return inputGroups.map((group, groupIndex) => {
                    const bandLabel =
                      group.condition === "all"
                        ? "All required"
                        : group.condition === "atLeastOne"
                          ? "At least one"
                          : "Optional";
                    const bandDescription =
                      group.condition === "all"
                        ? "Every field below must be set."
                        : group.condition === "atLeastOne"
                          ? "Provide at least one of the fields below."
                          : "These fields are optional.";
                    const bandTone =
                      group.condition === "all"
                        ? "required"
                        : group.condition === "atLeastOne"
                          ? "atLeastOne"
                          : "muted";
                    return (
                      <BandCard
                        key={groupIndex}
                        label={bandLabel}
                        description={bandDescription}
                        count={group.fields.length}
                        tone={bandTone}
                      >
                        {group.fields.map((inputField) => {
                          const fieldName = inputField.resolvedName;
                          const found = getField(fieldName as FieldName);
                          if (!found) return null;

                          return (
                            <FieldRow
                              key={fieldName}
                              fieldName={fieldName}
                              fieldType={found.type}
                              description={found.description}
                            />
                          );
                        })}
                      </BandCard>
                    );
                  });
                })()}
              </div>
            ) : (
              <Callout
                type="info"
                title={
                  <>
                    Input field mode: <code>config</code>
                  </>
                }
              >
                This pipe&apos;s input fields{" "}
                <AppLink linkType="fieldModeConfig">
                  can be configured by you
                </AppLink>
                .
              </Callout>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Output fields */}
        <AccordionItem value="output-fields">
          <AccordionTrigger>
            <SectionTriggerLabel
              label="Output fields"
              count={outputFieldCount}
            />
          </AccordionTrigger>
          <AccordionContent className="pl-6">
            {pipeEntry.outputFieldMode === "static" ? (
              <div className="space-y-2">
                {(() => {
                  const enabled: {
                    fieldName: string;
                    found: NonNullable<ReturnType<typeof getField>>;
                  }[] = [];
                  const optional: {
                    fieldName: string;
                    found: NonNullable<ReturnType<typeof getField>>;
                  }[] = [];
                  for (const fieldName of defaultOutputFields) {
                    const found = getField(fieldName as FieldName);
                    if (!found) continue;
                    const isEnabledByDefault = !!(
                      pipeEntry?.defaultPayload.config?.output_fields as Record<
                        string,
                        any
                      >
                    )?.[fieldName]?.enabled;
                    (isEnabledByDefault ? enabled : optional).push({
                      fieldName,
                      found,
                    });
                  }
                  const renderRow = ({
                    fieldName,
                    found,
                  }: {
                    fieldName: string;
                    found: NonNullable<ReturnType<typeof getField>>;
                  }) => (
                    <FieldRow
                      key={fieldName}
                      fieldName={found.name}
                      fieldType={found.type}
                      description={found.description}
                    />
                  );
                  return (
                    <>
                      {enabled.length > 0 && (
                        <BandCard
                          label="Enabled by default"
                          description="These fields are returned without extra config."
                          count={enabled.length}
                          tone="enabled"
                        >
                          {enabled.map(renderRow)}
                        </BandCard>
                      )}
                      {optional.length > 0 && (
                        <BandCard
                          label="Enable on demand"
                          description="Opt in to these fields via the pipe config."
                          count={optional.length}
                          tone="optional"
                        >
                          {optional.map(renderRow)}
                        </BandCard>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <Callout
                type="info"
                title={
                  <>
                    Output field mode: <code>config</code>
                  </>
                }
              >
                This pipe&apos;s output fields{" "}
                <AppLink linkType="fieldModeConfig">
                  can be configured by you
                </AppLink>
                .
              </Callout>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Walkthrough */}
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

        {/* Code examples. None for a deprecated pipe: a copyable snippet is
            what agents and people reuse, and it would carry the deprecated id. */}
        {snippetRequest && !deprecatedOn && (
          <AccordionItem value="code-examples">
            <AccordionTrigger>
              <SectionTriggerLabel
                label="Code examples"
                hint="POST /v1/pipes/run"
              />
            </AccordionTrigger>
            <AccordionContent className="pl-6">
              <ApiRequestCodeExample
                oas={pipesMiniSpec}
                operation={pipesMiniSpec.operation("/v1/pipes/run", "post")}
                harData={{ body: toCodeExampleBody(snippetRequest) }}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Config reference */}
        {formConfig && (
          <AccordionItem value="config-reference">
            <AccordionTrigger>
              <SectionTriggerLabel
                label="Config reference"
                count={configFieldCount}
              />
            </AccordionTrigger>
            <AccordionContent className="pl-6">
              <PayloadDocumenation
                formConfig={formConfig}
                searchable
                examplePayload={configExamplePayload}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Default config */}
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
    pipes: [{
      pipe_id: "${pipeId}",
      config: ${JSON.stringify(defaultPayload, null, 2).replace(
        /\n/g,
        "\n      ",
      )}
    }],
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
    "pipes": [{ "pipe_id": "${pipeId}" }],
    "input": []
}'`}
                  />
                </Tab>
              </Tabs>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Form UI */}
        <AccordionItem value="form-ui">
          <AccordionTrigger>
            <SectionTriggerLabel label="Form UI" hint="Beta" />
          </AccordionTrigger>
          <AccordionContent className="pl-6">
            <PipeFormPreview
              pipeId={pipeId}
              pipeLabel={pipeEntry.label}
              docsHref={docsLinkPaths.elementsReact}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
