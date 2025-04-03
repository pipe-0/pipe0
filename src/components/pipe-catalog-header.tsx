import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  pipeMetaCatalog,
  type PipeName,
  providerCatalog,
  fieldCatalog,
} from "@pipe0/client-sdk";
import { Key, Terminal } from "lucide-react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CodeTabs } from "@/components/code-tabs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type PipeHeaderProps = {
  pipe: PipeName;
};

export function PipeCatalogHeader({ pipe }: PipeHeaderProps) {
  const pipeCatalogEntry = pipeMetaCatalog[pipe];

  const tags = pipeCatalogEntry.providers;

  return (
    <div className="pipe-header space-y-8">
      {/* Header Section */}
      <div className="space-y-3">
        <div>
          <div className="pt-7 pb-4">
            <small className="text-sm text-muted-foreground mb-1">{pipe}</small>
            <h1 className="text-4xl font-bold">{pipeCatalogEntry.label}</h1>
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
        <h2 className="text-lg font-semibold mb-3">Providers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipeCatalogEntry.providers.map((providerName) => {
            const provider = providerCatalog[providerName];
            const cost =
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (pipeCatalogEntry.costPerProvider as any)?.[providerName]
                ?.amount || "Unknown";

            if (!provider) return null;

            return (
              <Card key={providerName} className="rounded-md p-3">
                <div className="flex items-start gap-2">
                  <div>
                    <CardHeader className="px-1 py-0 grid grid-cols-[min-content_1fr] gap-2">
                      {provider.logoUrl && (
                        <div className="flex-shrink-0 h-8 w-8 rounded-md relative mt-0.5 overflow-hidden">
                          <Image
                            src={provider.logoUrl || "/placeholder.svg"}
                            alt={`${provider.label} logo`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <CardTitle className="font-medium">
                          {provider.label}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {provider.description}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardFooter className="px-0 text-sm block pt-2 pb-0">
                      <div className="font-medium">
                        ${cost.toFixed(2)} per request
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        {provider.hasManagedConnections && (
                          <Badge
                            variant="default"
                            className="inline-flex gap-1"
                          >
                            <Key className="size-3" />
                            Managed
                          </Badge>
                        )}
                        {provider.allowsUserConnections && (
                          <Badge
                            variant="default"
                            className="inline-flex gap-1"
                          >
                            <Key className="size-3" /> User
                          </Badge>
                        )}
                      </div>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Input/Output Fields Section - Two Column Layout */}
      {!pipeCatalogEntry.hasFlexInputs ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Fields */}
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
                            const fieldEntry =
                              fieldCatalog[
                                fieldName as keyof typeof fieldCatalog
                              ];
                            if (!fieldEntry) return null;

                            return (
                              <div key={fieldName} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">
                                    {fieldEntry.label}
                                  </h4>
                                  <Badge
                                    variant="outline"
                                    className="capitalize text-xs"
                                  >
                                    {fieldEntry.type}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {fieldEntry.description}
                                </p>
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
                          <h4 className="font-medium">{fieldEntry.label}</h4>
                          <Badge
                            variant="outline"
                            className="capitalize text-xs"
                          >
                            {fieldEntry.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {fieldEntry.description}
                        </p>
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
                        <h4 className="font-medium">{fieldEntry.label}</h4>
                        <Badge variant="outline" className="capitalize text-xs">
                          {fieldEntry.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {fieldEntry.description}
                      </p>
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
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Code Example</AccordionTrigger>
            <AccordionContent>
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
