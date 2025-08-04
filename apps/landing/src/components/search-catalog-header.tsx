import { CodeTabs } from "@/components/code-tabs";
import { FilterDocumentation } from "@/components/config-documentation";
import CopyToClipboard from "@/components/copy-to-clipboard";
import { Info } from "@/components/info";
import { InlineDocsBadge } from "@/components/inline-docs-badge";
import { SearchFieldRow } from "@/components/search-field-row";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  getSearchDefaultConfig,
  getSearchEntry,
  providerCatalog,
  SearchId,
} from "@pipe0/client-sdk";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

type PipeHeaderProps = {
  searchId: SearchId;
};

export function SearchCatalogHeader({ searchId }: PipeHeaderProps) {
  const searchCatalogEntry = getSearchEntry(searchId);

  const defaultSearchConfig = getSearchDefaultConfig(searchId);

  return (
    <div className="pipe-header space-y-10">
      {/* Header Section */}
      <div className="space-y-3">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/resources/pipe-catalog">Search catalog</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{searchId}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-4xl font-bold text-left pb-4">
            {searchCatalogEntry.label}
          </h1>

          <p className="text-lg text-muted-foreground">
            {searchCatalogEntry.description}
          </p>
        </div>

        <div>
          <CopyToClipboard value={searchId} />
        </div>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Credentials</TableHead>
              <TableHead>
                Cost per result{" "}
                <InlineDocsBadge href={appLinks.searchBilling()} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchCatalogEntry.providers.map((providerName) => {
              const provider = providerCatalog[providerName];
              const costPerProvider = (
                searchCatalogEntry.costPerResult as Record<
                  string,
                  { credits: number }
                >
              )[providerName];

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

      <div>
        <div className="space-y-8">
          <div>
            <h3 className="font-medium mb-3 pb-2 border-b">Output Fields</h3>
            <div className="space-y-2">
              {searchCatalogEntry.defaultOutputFields.map((fieldName) => {
                const found = getField(fieldName as FieldName);
                if (!found) return null;

                return (
                  <SearchFieldRow
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

      <Accordion type="multiple" defaultValue={["code"]}>
        <AccordionItem value="config-reference">
          <AccordionTrigger className="">Config Reference</AccordionTrigger>
          <AccordionContent>
            <FilterDocumentation searchId={searchId} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="code">
          <AccordionTrigger className="">
            Request example with full config
          </AccordionTrigger>
          <AccordionContent>
            <div>
              <CodeTabs items={["Typescript", "cURL"]}>
                <div>
                  <SyntaxHighlighter
                    language="typescript"
                    style={vscDarkPlus}
                    customStyle={{ borderRadius: "0.375rem" }}
                  >
                    {`const result = await fetch("https://api.pipe0.com/v1/searches/run", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    searches: [{ 
      search_id: "${searchId}", 
    }],
    config: ${JSON.stringify(defaultSearchConfig, null, 2).replace(
      /\n/g,
      "\n      "
    )} 
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
                    {`curl -X POST "https://api.pipe0.com/v1/searches/run" \\
-H "Authorization: Bearer $API_KEY" \\
-d '{
    "pipes": [{ "search_id": "${searchId}" }],
    "config": ${JSON.stringify(defaultSearchConfig, null, 2).replace(
      /\n/g,
      "\n      "
    )} 
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
