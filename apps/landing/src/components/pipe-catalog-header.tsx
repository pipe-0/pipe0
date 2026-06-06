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
  ProviderStack,
  ProviderTile,
} from "@/components/features/pipe-catalog/catalog-list-row";
import { FieldRow } from "@/components/features/pipe-catalog/field-row";
import { TextLink } from "@/components/text-link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPipeStartingPrice } from "@/lib/pipes/get-pipe-starting-price";
import { pipesMiniSpec } from "@/lib/pipes/snippet-catalog";
import { videoCatalog } from "@/lib/pipes/video-catalog";
import { cn, copyToClipboard, formatCredits } from "@/lib/utils";
import { docsLinkPaths } from "@pipe0/doc-links";
import {
  BillableOperationDef,
  collectRequirementFields,
  FieldAnnotationsType,
  FieldName,
  getDefaultOutputFields,
  getDefaultPipeProviders,
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
import { PricingBadge } from "@pipe0/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Callout } from "fumadocs-ui/components/callout";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Copy, Terminal, Upload } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { toast } from "sonner";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
});

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

function SectionTriggerLabel({
  label,
  count,
  hint,
}: {
  label: string;
  count?: number | string;
  hint?: string;
}) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="text-base font-semibold tracking-tight text-foreground">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground tabular-nums font-normal">
          {count}
        </span>
      )}
      {hint && (
        <span className="text-xs text-muted-foreground font-normal">
          · {hint}
        </span>
      )}
    </span>
  );
}

export function PipeCatalogHeader({ pipeId }: PipeHeaderProps) {
  const pipeEntry = getPipeEntry(pipeId);
  const defaultPayload = getPipeDefaultPayload(pipeId);
  const defaultOutputFields = getDefaultOutputFields(pipeEntry);
  const pipeVersions = pipesByBasePipes[pipeEntry.basePipe];
  const defaultProviders = getDefaultPipeProviders(pipeId);
  const billableEntries = Object.entries(pipeEntry.billableOperations);
  const startingPrice = getPipeStartingPrice(pipeId);
  const category = (pipeEntry.categories?.[0] ?? null) as PipeCategory | null;

  const video = videoCatalog[pipeId as keyof typeof videoCatalog] as
    | string
    | undefined;

  const availableVersions =
    pipeVersions?.map((v) => {
      const versionEntry = getPipeEntry(v.pipeId);
      return {
        displayValue: `@${v.pipeId.split("@")[1]}`,
        link: versionEntry.docPath.replace(
          "/resources/pipe-catalog",
          "/docs/pipe-catalog",
        ),
        isDeprecated: !!versionEntry.lifecycle?.deprecatedOn,
      };
    }) ?? [];

  const formConfig = useMemo(() => {
    try {
      const payload = pipesSnippetCatalog[pipeId][0].pipes[0];
      const validationContext = validatePipesOrError({
        config: {
          environment: "production",
        },
        pipes: [payload],
        field_annotations: getFieldAnnotations(payload),
      });
      return getPipePayloadFormConfig({
        pipePayload: payload,
        validationContext,
        store: { field_options: {} },
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }, [pipeId]);

  const [openItems, setOpenItems] = useState<string[]>(DEFAULT_OPEN_ITEMS);

  const handleCopyId = () => {
    copyToClipboard(pipeId);
    toast("✅ Copied");
  };

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
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <ProviderTile providers={defaultProviders} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1
                className={cn(
                  "text-2xl font-semibold tracking-tight",
                  pipeEntry.lifecycle?.deprecatedOn && "line-through",
                )}
              >
                {pipeEntry.label}
              </h1>
              {category && <CategoryBadge category={category} />}
              {availableVersions.length > 1 && (
                <div className="ml-auto text-xs text-muted-foreground">
                  {availableVersions.map((e, index) => (
                    <Fragment key={e.link + index}>
                      <TextLink
                        className={cn(
                          "text-xs",
                          e.isDeprecated && "line-through",
                        )}
                        href={e.link}
                      >
                        {e.displayValue}
                      </TextLink>
                      {index < availableVersions.length - 1 && ", "}
                    </Fragment>
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {pipeEntry.description}
            </p>
          </div>
        </div>

        {/* Metadata row */}
        <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
          <div className="group/id flex items-center gap-1 min-w-0 rounded-md border border-input px-2 py-1">
            <span className="font-mono text-xs text-foreground truncate">
              {pipeId}
            </span>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Copy pipe id"
              className="size-4 opacity-60 hover:opacity-100 focus-visible:opacity-100 transition-opacity shrink-0"
              onClick={handleCopyId}
            >
              <Copy className="size-3" />
            </Button>
          </div>

          {startingPrice ? (
            <span className="inline-flex items-center gap-1.5">
              <span>from</span>
              <PricingBadge credits={startingPrice} />
              <span>/ result</span>
            </span>
          ) : (
            <span>Free</span>
          )}

          {defaultProviders.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <ProviderStack providers={defaultProviders} />
              <span>
                {defaultProviders.length} provider
                {defaultProviders.length === 1 ? "" : "s"}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Deprecation alert */}
      {pipeEntry.lifecycle?.replacedBy && (
        <Alert variant="destructive">
          <AlertTitle>
            Deprecated by{" "}
            {dateFormatter.format(
              new Date(pipeEntry.lifecycle.deprecatedOn || ""),
            )}
          </AlertTitle>
          <AlertDescription>
            Use instead: {pipeEntry.lifecycle.replacedBy}
          </AlertDescription>
        </Alert>
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

        {/* Code examples */}
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
              harData={{ body: pipesSnippetCatalog[pipeId][0] }}
            />
          </AccordionContent>
        </AccordionItem>

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
                exampleFilename={`${pipeId.replace(/[@:]/g, "-")}-config-example`}
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
              <Alert variant="warning">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  Passing config values is optional. The following example
                  contains the default pipe config.
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

function ProviderTable({ entries }: { entries: [string, unknown][] }) {
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <div className="grid grid-cols-[minmax(0,1fr)_140px_140px_120px] items-center gap-4 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground bg-muted/40 border-b border-border">
        <span>Provider</span>
        <span>Billing Mode</span>
        <span>Connection</span>
        <span className="text-right">Cost</span>
      </div>
      <div className="divide-y divide-border">
        {entries.map(([billableOperation, billableOperationDef]) => {
          const def = billableOperationDef as BillableOperationDef;
          const provider = providerCatalog[def.provider];

          const connections: string[] = [];
          if (provider.hasManagedConnections) connections.push("Managed");
          if (provider.allowsUserConnections) connections.push("User");

          return (
            <div
              key={billableOperation}
              className="grid grid-cols-[minmax(0,1fr)_140px_140px_120px] items-center gap-4 px-3 py-2 text-sm hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Avatar className="size-7 rounded-md">
                  <AvatarImage
                    src={provider.logoUrl}
                    alt={`${provider.label} logo`}
                  />
                  <AvatarFallback className="rounded-md text-[10px]">
                    {provider.label.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="font-medium leading-tight cursor-default truncate">
                        {provider.label}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{provider.description}</TooltipContent>
                  </Tooltip>
                  <div
                    className="font-mono text-[11px] text-muted-foreground truncate"
                    title={billableOperation}
                  >
                    {billableOperation}
                  </div>
                </div>
              </div>
              <div className="text-muted-foreground">
                {def.mode === "onSuccess"
                  ? "On Success"
                  : def.mode === "always"
                    ? "Always"
                    : "n/a"}
              </div>
              <div className="text-muted-foreground">
                {connections.join(", ")}
              </div>
              <div className="text-right tabular-nums">
                {def.credits === null ? (
                  <span className="text-muted-foreground">n/a</span>
                ) : (
                  <>
                    <span>{formatCredits(def.credits.default) || "Free"}</span>
                    {def.credits !== null && (
                      <span className="text-muted-foreground ml-1">
                        credits
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
