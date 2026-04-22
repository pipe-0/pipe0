import AppLink from "@/components/app-link";
import { PayloadDocumenation } from "@/components/config-documentation";
import { ApiRequestCodeExample } from "@/components/features/docs/api-request-code-example";
import { CatalogHeader } from "@/components/features/docs/docs-layout";
import {
  FieldRow,
  OutputFieldEnabledBadge,
} from "@/components/features/pipe-catalog/field-row";
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
import { Button } from "@/components/ui/button";
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
  PipePayload,
  pipesSnippetCatalog,
  providerCatalog,
  sortPipeCatalogByBasePipe,
  validatePipesOrError,
} from "@pipe0/elements";
import { Tabs, Tab } from "fumadocs-ui/components/tabs";
import { Download, Terminal, Upload } from "lucide-react";
import Link from "next/link";
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
  const inputGroups = instance.getInputGroups();
  for (const inputGroup of inputGroups) {
    Object.entries(inputGroup.fields).forEach(([fieldName, def]) => {
      fieldAnnotations[fieldName] = {
        type: typeof def.type === "function" ? "unknown" : def.type,
        format: typeof def.format === "function" ? null : def.format,
        json_metadata: null,
        label: def.label,
      };
    });
  }
  return fieldAnnotations;
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
        store: { fieldOptions: {} },
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
              <div className="space-y-2">
                {(pipeEntry.defaultInputGroups || []).length === 0 && (
                  <Alert>
                    <Upload className="h-4 w-4" />
                    <AlertTitle>No input fields</AlertTitle>
                    <AlertDescription>
                      <p>This pipe&apos;s has no input fields.</p>
                    </AlertDescription>
                  </Alert>
                )}
                {pipeEntry.defaultInputGroups?.map((group, groupIndex) => {
                  const fieldEntries = Object.entries(group.fields);

                  // For groups with multiple fields, show relationship
                  if (fieldEntries.length > 1) {
                    return (
                      <div
                        key={groupIndex}
                        className="border-l-3 border-border pl-3"
                      >
                        <div className="pb-3">
                          <h4 className="text-sm">Field group</h4>
                          <small className="text-muted-foreground">
                            {group.condition === "all" && "All Required"}
                            {group.condition === "atLeastOne" &&
                              "At Least one of the following fields is required"}
                            {group.condition === "none" && "None Required"}
                          </small>
                        </div>

                        <div className="space-y-2">
                          {fieldEntries.map(([fieldName]) => {
                            const found = getField(fieldName as FieldName);
                            if (!found) return null;

                            return (
                              <FieldRow
                                key={fieldName}
                                fieldName={fieldName}
                                fieldType={found.type}
                                description={found.description}
                                rightAction={
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Link
                                        href={`/docs/pipes/pipes-catalog?type=output-field&value=${encodeURI(
                                          fieldName,
                                        )}`}
                                      >
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="size-5"
                                        >
                                          <Download className="size-3" />
                                        </Button>
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Find pipes that output this field
                                    </TooltipContent>
                                  </Tooltip>
                                }
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  } else if (fieldEntries.length === 1) {
                    // For single field groups, show them individually
                    const [fieldName] = fieldEntries[0];
                    const found = getField(fieldName as FieldName);
                    if (!found) return null;

                    return (
                      <FieldRow
                        key={fieldName}
                        description={found.description}
                        groupCondition={group.condition}
                        fieldName={fieldName}
                        fieldType={found.type}
                        rightAction={
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`/docs/pipes/pipes-catalog?type=output-field&value=${encodeURI(
                                  fieldName,
                                )}`}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="size-5"
                                >
                                  <Download className="size-3" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              Find pipes that output this field
                            </TooltipContent>
                          </Tooltip>
                        }
                      />
                    );
                  }

                  return null;
                })}
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
              <H2 className="mb-3 pb-2 border-b">Output Fields</H2>
              <div className="space-y-2">
                {defaultOutputFields.length === 0 && (
                  <Alert>
                    <Upload className="h-4 w-4" />
                    <AlertTitle>No output fields</AlertTitle>
                    <AlertDescription>
                      <p>This pipe&apos;s has no output fields.</p>
                    </AlertDescription>
                  </Alert>
                )}
                {defaultOutputFields.map((fieldName) => {
                  const isEnabledByDefault = !!(
                    pipeEntry?.defaultPayload.config?.output_fields as Record<
                      string,
                      any
                    >
                  )?.[fieldName]?.enabled;

                  const found = getField(fieldName as FieldName);
                  if (!found) return null;

                  return (
                    <FieldRow
                      key={fieldName}
                      fieldName={found.name}
                      fieldType={found.type}
                      description={found.description}
                      leftAction={
                        <div className="flex gap-2">
                          <OutputFieldEnabledBadge
                            isEnabledByDefault={isEnabledByDefault}
                          />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`/docs/pipes/pipes-catalog?type=input-field&value=${encodeURI(
                                  fieldName,
                                )}`}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="size-5"
                                >
                                  <Upload className="size-3" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              Find pipes that input this field
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      }
                    />
                  );
                })}
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
