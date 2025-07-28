import AppLink from "@/components/app-link";
import { CodeTabs } from "@/components/code-tabs";
import CopyToClipboard from "@/components/copy-to-clipboard";
import { FieldRow } from "@/components/features/pipe-catalog/field-row";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { appLinks } from "@/lib/links";
import { formatCredits } from "@/lib/utils";
import {
  FieldName,
  getField,
  PipeId,
  pipeCatalog,
  providerCatalog,
  pipeModuleCatalog,
  getPipeDefaultConfig,
} from "@pipe0/client-sdk";
import { Terminal } from "lucide-react";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

type PipeHeaderProps = {
  pipeId: PipeId;
};

export function PipeCatalogHeader({ pipeId }: PipeHeaderProps) {
  const pipeCatalogEntry = pipeCatalog[pipeId];

  const defaultPipeConfig = getPipeDefaultConfig(pipeId);

  return (
    <div className="pipe-header space-y-10">
      {/* Header Section */}
      <div className="space-y-3">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/resources/pipe-catalog">Pipe catalog</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{pipeId}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-4xl font-bold text-left pb-4">
            {pipeCatalogEntry.label}
          </h1>

          <p className="text-lg text-muted-foreground">
            {pipeCatalogEntry.description}
          </p>
        </div>
        {/* Metadata Section */}

        <div>
          <CopyToClipboard value={pipeId} />
        </div>
      </div>

      {/* Providers Section */}
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>
                Billing Mode <InlineDocsBadge href={appLinks.billingMode()} />
              </TableHead>
              <TableHead>Credentials</TableHead>
              <TableHead>
                Cost per record <InlineDocsBadge href={appLinks.billing()} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pipeCatalogEntry.providers.map((providerName) => {
              const provider = providerCatalog[providerName];
              const costPerProvider = pipeCatalogEntry.costPerProvider[
                providerName as keyof typeof pipeCatalogEntry.costPerProvider
              ] as {
                credits: number;
                billingMode: "always" | "onSuccess" | undefined;
              };

              if (!provider)
                throw new Error(`Provider ${provider} not defined`);
              if (!costPerProvider)
                throw new Error(
                  `CostPerProvider not defined for ${provider}, ${providerName}`
                );

              let connections = [];
              if (provider.hasManagedConnections) connections.push("Managed");
              // if (provider.allowsUserConnections) connections.push("User");

              return (
                <TableRow key={providerName}>
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
                      {costPerProvider.billingMode === "onSuccess" ? (
                        <>On Success </>
                      ) : costPerProvider.billingMode === "always" ? (
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
                      {typeof costPerProvider.credits === "number"
                        ? formatCredits(costPerProvider.credits)
                        : costPerProvider.credits}{" "}
                      credits
                    </p>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Input/Output Fields Section - Two Column Layout */}
      {pipeCatalogEntry.fieldMode === "static" ? (
        <div>
          <div className="space-y-8">
            {/* Input Groups */}
            <div>
              <h3 className="font-medium mb-3 pb-2 border-b">Input Fields</h3>
              <div className="space-y-2">
                {pipeCatalogEntry.defaultInputGroups?.map(
                  (group, groupIndex) => {
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

                          {group.message && (
                            <p className="text-xs text-muted-foreground italic mb-2">
                              {group.message}
                            </p>
                          )}

                          <div className="space-y-2">
                            {fieldEntries.map(([fieldName]) => {
                              const found = getField(fieldName as FieldName);
                              if (!found) return null;

                              return (
                                <FieldRow
                                  type="input"
                                  key={fieldName}
                                  fieldName={fieldName}
                                  fieldType={found.type}
                                  description={found.description}
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
                          type="input"
                          fieldName={fieldName}
                          fieldType={found.type}
                        />
                      );
                    }

                    return null;
                  }
                )}
              </div>
            </div>

            {/* Output Fields */}
            <div>
              <h3 className="font-medium mb-3 pb-2 border-b">Output Fields</h3>
              <div className="space-y-2">
                {pipeCatalogEntry.defaultOutputFields.map((fieldName) => {
                  const found = getField(fieldName as FieldName);
                  if (!found) return null;

                  return (
                    <FieldRow
                      type="output"
                      key={fieldName}
                      fieldName={found.name}
                      fieldType={found.type}
                      description={found.description}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Field mode: `prompt`</AlertTitle>
          <AlertDescription>
            <p>
              This pipe supports{" "}
              <AppLink linkType="fieldModePrompt">
                flexible input and output fields
              </AppLink>{" "}
              that can be fully defined by the user.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Code example */}
      <Accordion type="multiple" defaultValue={["code"]}>
        <AccordionItem value="code">
          <AccordionTrigger className="text-sm">Code example</AccordionTrigger>
          <AccordionContent>
            <div>
              <CodeTabs items={["Typescript", "cURL"]}>
                <div>
                  <SyntaxHighlighter
                    language="typescript"
                    style={vscDarkPlus}
                    customStyle={{ borderRadius: "0.375rem" }}
                  >
                    {`const result = await fetch("https://api.pipe0.com/v1/run/sync", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${API_KEY}\`,
  },
  body: JSON.stringify({
    pipes: [{ 
      pipe_id: "${pipeId}", 
    }],
    input: []
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
                    {`curl -X POST "https://api.pipe0.com/v1/run/sync" \\
-H "Authorization: Bearer $API_KEY" \\
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
        <AccordionItem value="config">
          <AccordionTrigger className="text-sm">Full config</AccordionTrigger>
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
                    {`const result = await fetch("https://api.pipe0.com/v1/run/sync", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${API_KEY}\`,
  },
  body: JSON.stringify({
    pipes: [{ 
      pipe_id: "${pipeId}", 
      // passing a config is optional
      config: ${JSON.stringify(defaultPipeConfig, null, 2).replace(
        /\n/g,
        "\n      "
      )} 
    }],
    input: []
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
                    {`curl -X POST "https://api.pipe0.com/v1/run/sync" \\
-H "Authorization: Bearer $API_KEY" \\
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
  );
}
