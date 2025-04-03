import { CodeTabs } from "@/components/code-tabs";
import { Info } from "@/components/info";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import {
  fieldCatalog,
  pipeMetaCatalog,
  type PipeName,
  providerCatalog,
} from "@pipe0/client-sdk";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Key, Terminal } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

type PipeHeaderProps = {
  pipe: PipeName;
};

export function PipeCatalogHeader({ pipe }: PipeHeaderProps) {
  const pipeCatalogEntry = pipeMetaCatalog[pipe];

  const tags = pipeCatalogEntry.tags || [];

  return (
    <div className="pipe-header space-y-10">
      {/* Header Section */}
      <div className="space-y-3">
        <div>
          <div className="pt-7 pb-4">
            <small className="text-sm text-muted-foreground mb-1">{pipe}</small>
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
              <TableHead>Credentials</TableHead>
              <TableHead>Cost per record</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pipeCatalogEntry.providers.map((providerName) => {
              const provider = providerCatalog[providerName];

              const cost =
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (pipeCatalogEntry.costPerProvider as any)?.[providerName]
                  ?.amount ?? "Unknown";

              if (!provider) return null;

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
                    <div className="flex items-center gap-2">
                      {provider.hasManagedConnections && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="secondary"
                              className="inline-flex gap-1"
                            >
                              <Key className="size-3" />
                              Managed
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            A managed connection is available for this provider.
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {provider.allowsUserConnections && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="default"
                              className="inline-flex gap-1"
                            >
                              <Key className="size-3" /> User
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            You can provide your own connection for this
                            provider.
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${Number(cost).toFixed(2)} per request</TableCell>
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
              <h3 className="font-medium mb-3 pb-2 border-b">Input Groups</h3>
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
                            const fieldEntry =
                              fieldCatalog[
                                fieldName as keyof typeof fieldCatalog
                              ];
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
                    const fieldEntry =
                      fieldCatalog[fieldName as keyof typeof fieldCatalog];
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
                  const fieldEntry =
                    fieldCatalog[fieldName as keyof typeof fieldCatalog];
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
            This pipe supports flexible input and output fields that can be
            fully defined by the user.
          </AlertDescription>
        </Alert>
      )}

      {/* Code example */}
      <div>
        <h3 className="font-medium mb-3 pb-2 border-b">Code Example</h3>
        <div>
          <CodeTabs items={["Typescript", "cURL"]}>
            <div>
              <SyntaxHighlighter
                language="typescript"
                style={vscDarkPlus}
                customStyle={{ borderRadius: "0.375rem" }}
              >
                {`const result = await fetch("https://pipe0.com/api/v1/run", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${YOUR_API_TOKEN}\`,
  },
  body: JSON.stringify({
    pipes: [{ name: "${pipe}" }],
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
                {`curl -X POST "https://pipe0.com/api/v1/run" \\
-H "Authorization: Bearer YOUR_API_TOKEN" \\
-H "X-Test-Mode: true" \\
-d '{
    "pipes": [{ "name": "${pipe}" }],
    "input": []
}'`}
              </SyntaxHighlighter>
            </div>
          </CodeTabs>
        </div>
      </div>
    </div>
  );
}
