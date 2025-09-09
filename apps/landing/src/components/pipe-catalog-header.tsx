import {
  pipesMiniSpec,
  snippetCatalog,
} from "@/app/resources/pipe-catalog/snippet-catalog";
import { videoCatalog } from "@/app/resources/pipe-catalog/video-catalog";
import AppLink from "@/components/app-link";
import { CodeTabs } from "@/components/code-tabs";
import { PayloadDocumenation } from "@/components/config-documentation";
import { ApiRequestCodeExample } from "@/components/features/docs/api-request-code-example";
import { CatalogHeader } from "@/components/features/docs/docs-layout";
import {
  FieldRow,
  OutputFieldEnabledBadge,
} from "@/components/features/pipe-catalog/field-row";
import { Info } from "@/components/info";
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
import { appLinks } from "@/lib/links";
import { formatCredits } from "@/lib/utils";
import {
  BillableOperationDef,
  FieldName,
  getDefaultOutputFields,
  getDefaultPipeProviders,
  getField,
  getPipeDefaultPayload,
  getPipeEntry,
  PipeId,
  providerCatalog,
} from "@pipe0/client-sdk";
import { Check, Download, Terminal, Upload } from "lucide-react";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
});

type PipeHeaderProps = {
  pipeId: PipeId;
};

export function PipeCatalogHeader({ pipeId }: PipeHeaderProps) {
  const pipeEntry = getPipeEntry(pipeId);
  const defaultPayload = getPipeDefaultPayload(pipeId);
  const defaultOutputFields = getDefaultOutputFields(pipeEntry);

  let video = videoCatalog[pipeId as keyof typeof videoCatalog] as
    | string
    | undefined;

  return (
    <div className="space-y-3">
      <CatalogHeader
        label={pipeEntry.label}
        description={pipeEntry.description}
        defaultProviders={getDefaultPipeProviders(pipeId)}
        id={pipeEntry.pipeId}
        video={video}
        deprecationAlert={
          pipeEntry.lifecycle?.replacedBy && (
            <Alert variant="destructive" className="mb-2">
              <AlertTitle>
                Deprecated by{" "}
                {dateFormatter.format(
                  new Date(pipeEntry.lifecycle.deprecatedOn)
                )}
              </AlertTitle>
              <AlertDescription>
                Use instead: {pipeEntry.lifecycle.replacedBy}
              </AlertDescription>
            </Alert>
          )
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Billable Operation</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>
                Billing Mode <InlineDocsBadge href={appLinks.billingMode()} />
              </TableHead>
              <TableHead>
                Connection <InlineDocsBadge href={appLinks.connections()} />
              </TableHead>
              <TableHead>
                Cost per operation <InlineDocsBadge href={appLinks.billing()} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(pipeEntry.billableOperations).map(
              ([billableOperation, billableOperationDef]) => {
                const def = billableOperationDef as BillableOperationDef;
                const provider = providerCatalog[def.provider];

                let connections = [];
                if (provider.hasManagedConnections) connections.push("Managed");
                if (provider.allowsUserConnections) connections.push("User");

                return (
                  <TableRow key={billableOperation}>
                    <TableCell className="">{billableOperation}</TableCell>
                    <TableCell className="">
                      <div className="flex gap-2">
                        <Avatar>
                          <AvatarImage
                            src={provider.logoUrl}
                            alt={`${provider.label} logo`}
                          />
                          <AvatarFallback>P</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">
                          {provider.label} <Info>{provider.description}</Info>
                        </div>
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
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
        <div className="space-y-4">
          {pipeEntry.inputFieldMode === "static" ? (
            <div>
              <h3 className="font-bold text-sm mb-3 pb-2 border-b">
                Input Fields
              </h3>
              <div className="space-y-2">
                {pipeEntry.defaultInputGroups.length === 0 && (
                  <Alert>
                    <Upload className="h-4 w-4" />
                    <AlertTitle>No input fields</AlertTitle>
                    <AlertDescription>
                      <p>This pipe's has no input fields.</p>
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
                                        href={`/resources/pipe-catalog?type=output-field&value=${encodeURI(
                                          fieldName
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
                                href={`/resources/pipe-catalog?type=output-field&value=${encodeURI(
                                  fieldName
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
                  This pipe's input fields{" "}
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
              <h3 className="font-bold text-sm mb-3 pb-2 border-b">
                Output Fields
              </h3>
              <div className="space-y-2">
                {defaultOutputFields.length === 0 && (
                  <Alert>
                    <Upload className="h-4 w-4" />
                    <AlertTitle>No output fields</AlertTitle>
                    <AlertDescription>
                      <p>This pipe's has no output fields.</p>
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

                  if (fieldName === "leadmagic_company_news_list") {
                    console.log({ payload: pipeEntry.defaultPayload });
                  }
                  const found = getField(fieldName as FieldName);
                  if (!found) return null;

                  return (
                    <FieldRow
                      key={fieldName}
                      fieldName={found.name}
                      fieldType={found.type}
                      description={found.description}
                      rightAction={
                        <div className="flex gap-2">
                          <OutputFieldEnabledBadge
                            isEnabledByDefault={isEnabledByDefault}
                          />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`/resources/pipe-catalog?type=input-field&value=${encodeURI(
                                  fieldName
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
                  This pipe's output fields{" "}
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

      <div className="px-4">
        <Accordion type="multiple" defaultValue={["code"]}>
          <AccordionItem value="code">
            <AccordionTrigger className="text-sm">
              Code example
            </AccordionTrigger>
            <AccordionContent>
              <ApiRequestCodeExample
                oas={pipesMiniSpec}
                operation={pipesMiniSpec.operation("/v1/pipes/run", "post")}
                harData={{ body: snippetCatalog[pipeId] }}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="config-reference">
            <AccordionTrigger className="">Config reference</AccordionTrigger>
            <AccordionContent>
              <PayloadDocumenation pipeId={pipeId} />
            </AccordionContent>
          </AccordionItem>
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
                <CodeTabs items={["Typescript"]}>
                  <div>
                    <SyntaxHighlighter
                      language="typescript"
                      style={vscDarkPlus}
                      customStyle={{ borderRadius: "0.375rem" }}
                    >
                      {`const result = await fetch("https://api.pipe0.com/v1/pipes/run", {
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
        "\n      "
      )} 
    }],
    input: [] // <- your inputs go here
  })
});`}
                    </SyntaxHighlighter>
                  </div>
                  <div>
                    <SyntaxHighlighter
                      language="bash"
                      style={vscDarkPlus}
                      customStyle={{ borderRadius: "0.375rem" }}
                    >
                      {`curl -X POST "https://api.pipe0.com/v1/pipes/run" \\
-H "Authorization: Bearer $API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
    "pipes": [{ "pipe_id": "${pipeId}" }],
    "input": []
}'`}
                    </SyntaxHighlighter>
                  </div>
                </CodeTabs>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
