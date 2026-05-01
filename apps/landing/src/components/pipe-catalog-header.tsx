import AppLink from "@/components/app-link";
import { PayloadDocumenation } from "@/components/config-documentation";
import { ApiRequestCodeExample } from "@/components/features/docs/api-request-code-example";
import { CatalogHeader } from "@/components/features/docs/docs-layout";
import { FieldRow } from "@/components/features/pipe-catalog/field-row";
import { H2, H3 } from "@/components/headings";
import { InlineDocsBadge } from "@/components/inline-docs-badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { docsLinkPaths } from "@pipe0/docs-links";
import { pipesMiniSpec } from "@/lib/pipes/snippet-catalog";
import { videoCatalog } from "@/lib/pipes/video-catalog";
import { formatCredits } from "@/lib/utils";
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
  PipeId,
  PipeInputField,
  PipePayload,
  pipesSnippetCatalog,
  providerCatalog,
  Requirement,
  sortPipeCatalogByBasePipe,
  validatePipesOrError,
} from "@pipe0/elements";
import { Tabs, Tab } from "fumadocs-ui/components/tabs";
import { Download, Terminal, Upload } from "lucide-react";
import * as React from "react";
import { useMemo } from "react";
import { DynamicCodeBlock } from "@/components/features/docs/dynamic-code-block";
import { PipeFormPreview } from "@/components/features/docs/pipe-form-preview";

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

function BandCard({
  label,
  description,
  count,
  children,
}: {
  label: string;
  description: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <div className="flex items-center gap-3 bg-muted/50 px-3 py-1.5 border-b border-border">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground flex-1 truncate">
          {description}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {count}
        </span>
      </div>
      <div className="px-3 py-2 space-y-1">{children}</div>
    </div>
  );
}

export function PipeCatalogHeader({ pipeId }: PipeHeaderProps) {
  const pipeEntry = getPipeEntry(pipeId);
  const defaultPayload = getPipeDefaultPayload(pipeId);
  const defaultOutputFields = getDefaultOutputFields(pipeEntry);
  const pipeVersions = pipesByBasePipes[pipeEntry.basePipe];

  let video = videoCatalog[pipeId as keyof typeof videoCatalog] as
    | string
    | undefined;

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

  return (
    <div className="space-y-8">
      <CatalogHeader
        label={pipeEntry.label}
        description={pipeEntry.description}
        defaultProviders={getDefaultPipeProviders(pipeId)}
        id={pipeEntry.pipeId}
        video={video}
        availableVersions={pipeVersions?.map((v) => {
          const versionEntry = getPipeEntry(v.pipeId);
          return {
            displayValue: `@${v.pipeId.split("@")[1]}`,
            link: versionEntry.docPath.replace(
              "/resources/pipe-catalog",
              "/docs/pipes/pipes-catalog",
            ),
            isDeprecated: !!versionEntry.lifecycle?.deprecatedOn,
          };
        })}
        tags={pipeEntry.tags}
        deprecationAlert={
          pipeEntry.lifecycle?.replacedBy && (
            <Alert variant="destructive" className="mb-2">
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
          )
        }
      >
        <div className="bg-accent/20 border rounded-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>
                  Billing Mode{" "}
                  <InlineDocsBadge href={docsLinkPaths.billingMode} />
                </TableHead>
                <TableHead>
                  Connection{" "}
                  <InlineDocsBadge href={docsLinkPaths.connections} />
                </TableHead>
                <TableHead>
                  Cost per operation{" "}
                  <InlineDocsBadge href={docsLinkPaths.billing} />
                </TableHead>
                <TableHead>Event</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(pipeEntry.billableOperations).map(
                ([billableOperation, billableOperationDef]) => {
                  const def = billableOperationDef as BillableOperationDef;
                  const provider = providerCatalog[def.provider];

                  let connections = [];
                  if (provider.hasManagedConnections)
                    connections.push("Managed");
                  if (provider.allowsUserConnections) connections.push("User");

                  return (
                    <TableRow key={billableOperation}>
                      <TableCell className="">
                        <div className="flex gap-2 items-center">
                          <Avatar>
                            <AvatarImage
                              src={provider.logoUrl}
                              alt={`${provider.label} logo`}
                            />
                            <AvatarFallback>P</AvatarFallback>
                          </Avatar>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="font-medium cursor-default">
                                {provider.label}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {provider.description}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          {def.mode === "onSuccess" ? (
                            <>On Success </>
                          ) : def.mode === "always" ? (
                            <>Always</>
                          ) : (
                            "n/a"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {connections.join(", ")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p>
                          {def.credits === null
                            ? "n/a"
                            : formatCredits(def.credits) || "Free"}
                          {def.credits !== null && " credits"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span
                          className="inline-block whitespace-nowrap overflow-hidden text-ellipsis w-25"
                          title={billableOperation}
                        >
                          {billableOperation}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                },
              )}
            </TableBody>
          </Table>
        </div>
        <div className="space-y-8">
          {pipeEntry.inputFieldMode === "static" ? (
            <div>
              <H2 className="mb-3 pb-2 border-b">Input Fields</H2>
              <div className="space-y-3">
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
                    return (
                      <BandCard
                        key={groupIndex}
                        label={bandLabel}
                        description={bandDescription}
                        count={group.fields.length}
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
            </div>
          ) : (
            <Alert>
              <Download className="h-4 w-4" />
              <AlertTitle>Input field mode: `config`</AlertTitle>
              <AlertDescription>
                <p>
                  This pipe&apos;s input fields{" "}
                  <AppLink linkType="fieldModeConfig">
                    can be configured by you
                  </AppLink>
                  .
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Output Fields */}
          {pipeEntry.outputFieldMode === "static" ? (
            <div>
              <H2 className="mb-3 pb-2">Output Fields</H2>
              <div className="space-y-3">
                {(() => {
                  const enabled: {
                    fieldName: string;
                    found: ReturnType<typeof getField>;
                  }[] = [];
                  const optional: {
                    fieldName: string;
                    found: ReturnType<typeof getField>;
                  }[] = [];
                  for (const fieldName of defaultOutputFields) {
                    const isEnabledByDefault = !!(
                      pipeEntry?.defaultPayload.config?.output_fields as Record<
                        string,
                        any
                      >
                    )?.[fieldName]?.enabled;
                    const found = getField(fieldName as FieldName);
                    if (!found) continue;
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
                        >
                          {enabled.map((item) =>
                            renderRow(
                              item as {
                                fieldName: string;
                                found: NonNullable<ReturnType<typeof getField>>;
                              },
                            ),
                          )}
                        </BandCard>
                      )}
                      {optional.length > 0 && (
                        <BandCard
                          label="Enable on demand"
                          description="Opt in to these fields via the pipe config."
                          count={optional.length}
                        >
                          {optional.map((item) =>
                            renderRow(
                              item as {
                                fieldName: string;
                                found: NonNullable<ReturnType<typeof getField>>;
                              },
                            ),
                          )}
                        </BandCard>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          ) : (
            <Alert>
              <Upload className="h-4 w-4" />
              <AlertTitle>Output field mode: `config`</AlertTitle>
              <AlertDescription>
                <p>
                  This pipe&apos;s output fields{" "}
                  <AppLink linkType="fieldModeConfig">
                    can be configured by you
                  </AppLink>
                  .
                </p>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CatalogHeader>

      <div>
        <H2>Code Examples</H2>

        <ApiRequestCodeExample
          oas={pipesMiniSpec}
          operation={pipesMiniSpec.operation("/v1/pipes/run", "post")}
          harData={{ body: pipesSnippetCatalog[pipeId][0] }}
        />
      </div>

      <div className="px-4">
        <Accordion type="multiple">
          {formConfig && (
            <AccordionItem value="config-reference">
              <AccordionTrigger className="">Config reference</AccordionTrigger>
              <AccordionContent>
                <PayloadDocumenation formConfig={formConfig} />
              </AccordionContent>
            </AccordionItem>
          )}
          <AccordionItem value="config">
            <AccordionTrigger className="text-sm">
              Default config
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <Alert>
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
          <AccordionItem value="form-ui">
            <AccordionTrigger className="text-sm">
              <span className="flex items-center gap-2">
                Form UI
                <Badge className="text-[10px] px-1.5 py-0 font-medium leading-none">
                  Beta
                </Badge>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <PipeFormPreview
                pipeId={pipeId}
                pipeLabel={pipeEntry.label}
                docsHref={docsLinkPaths.elementsReact}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
