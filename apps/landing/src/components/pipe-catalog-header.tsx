import AppLink from "@/components/app-link";
import { CodeTabs } from "@/components/code-tabs";
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
  CostPerProvider,
  fieldCatalog,
  pipeConfigRegistry,
  PipeId,
  PipeMetaCatalog,
  pipeMetaCatalog,
  providerCatalog,
} from "@pipe0/client-sdk";
import { Key, Terminal } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

type PipeHeaderProps = {
  pipeId: PipeId;
};

export function PipeCatalogHeader({ pipeId }: PipeHeaderProps) {
  const pipeCatalogEntry = pipeMetaCatalog[pipeId];

  const tags = pipeCatalogEntry?.tags || [];

  const defaultPipeConfig = pipeConfigRegistry[pipeId];

  return (
    <div className="pipe-header space-y-10">
      {/* Header Section */}
      <div className="space-y-3">
        <div>
          <div className="pt-7 pb-4">
            <small className="text-sm text-muted-foreground mb-1">
              {pipeId}
            </small>
            <h2 className="text-4xl font-bold text-left">
              {pipeCatalogEntry.label}
            </h2>
          </div>
          <p className="text-lg text-muted-foreground">
            {pipeCatalogEntry.description}
          </p>
        </div>
        {/* Metadata Section */}
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Providers Section */}
      <div>
        <h3 className="font-medium mb-3 pb-2 border-b">Provider Options</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>
                Billing Mode <InlineDocsBadge href={appLinks.billingMode()} />
              </TableHead>
              <TableHead>
                Credentials{" "}
                <InlineDocsBadge href={appLinks.pipeCredentials()} />
              </TableHead>
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
              if (provider.allowsUserConnections) connections.push("User");

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
      {!pipeCatalogEntry.hasFlexInputs ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Groups */}
            <div>
              <h3 className="font-medium mb-3 pb-2 border-b">Input Fields</h3>
              <div className="space-y-5">
                {pipeCatalogEntry.inputGroups?.map((group, groupIndex) => {
                  const fieldEntries = Object.entries(group.fields);

                  // For groups with multiple fields, show relationship
                  if (fieldEntries.length > 1) {
                    return (
                      <div
                        key={groupIndex}
                        className="space-y-2 border rounded-md p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">Field Group</h4>
                          <Badge
                            variant="secondary"
                            className="capitalize text-xs"
                          >
                            {group.condition === "all" && "All Required"}
                            {group.condition === "atLeastOne" &&
                              "At Least One Required"}
                            {group.condition === "none" && "None Required"}
                          </Badge>
                        </div>

                        {group.message && (
                          <p className="text-xs text-muted-foreground italic mb-2">
                            {group.message}
                          </p>
                        )}

                        <div className="space-y-3">
                          {fieldEntries.map(([fieldName]) => {
                            const fieldEntry = Object.values(fieldCatalog).find(
                              (e) => e.name === fieldName
                            );
                            if (!fieldEntry) return null;

                            return (
                              <div key={fieldName} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">
                                    {fieldEntry.name}
                                  </h4>
                                  <Badge
                                    variant="outline"
                                    className="capitalize text-xs"
                                  >
                                    {fieldEntry.type}
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  } else if (fieldEntries.length === 1) {
                    // For single field groups, show them individually
                    const [fieldName] = fieldEntries[0];
                    const fieldEntry = Object.values(fieldCatalog).find(
                      (e) => e.name === fieldName
                    );
                    if (!fieldEntry) return null;

                    return (
                      <div key={fieldName} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            {fieldEntry.name}{" "}
                            <Info>{fieldEntry.description}</Info>
                          </h4>
                          <div className="inline-flex gap-2">
                            <Badge
                              variant="outline"
                              className="capitalize text-xs"
                            >
                              {fieldEntry.type}
                            </Badge>
                            <Badge
                              variant={
                                group.condition === "all"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="capitalize text-xs"
                            >
                              {group.condition === "all"
                                ? "Required"
                                : group.condition === "none"
                                ? "Optional"
                                : "Misconfigured"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>

            {/* Output Fields */}
            <div>
              <h3 className="font-medium mb-3 pb-2 border-b">Output Fields</h3>
              <div className="space-y-5">
                {pipeCatalogEntry.outputFields.map((fieldName) => {
                  const fieldEntry = Object.values(fieldCatalog).find(
                    (e) => e.name === fieldName
                  );
                  if (!fieldEntry) return null;

                  return (
                    <div key={fieldName} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                          {fieldEntry.name}{" "}
                          <Info>{fieldEntry.description}</Info>
                        </h4>
                        <div className="inline-flex gap-2">
                          <Badge
                            variant="outline"
                            className="capitalize text-xs"
                          >
                            {fieldEntry.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Flexible Input/Output Fields</AlertTitle>
          <AlertDescription>
            <p>
              This pipe supports{" "}
              <AppLink linkType="flexPipe">
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
          <AccordionTrigger className="text-lg">Code example</AccordionTrigger>
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
          <AccordionTrigger className="text-lg">
            Full Config Example
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
