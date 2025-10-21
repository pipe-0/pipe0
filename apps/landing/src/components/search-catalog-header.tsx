import {
  searchesMiniSpec,
  snippetCatalog,
} from "@/app/resources/search-catalog/snippet-catalot";
import { videoCatalog } from "@/app/resources/search-catalog/video-catalog";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  getSearchDefaultPayload,
  getSearchEntry,
  getSearchPayloadFormConfig,
  providerCatalog,
  SearchId,
} from "@pipe0/client-sdk";
import { useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

type PipeHeaderProps = {
  searchId: SearchId;
};

export function SearchCatalogHeader({ searchId }: PipeHeaderProps) {
  const searchEntry = getSearchEntry(searchId);

  const defaultSearchPayload = getSearchDefaultPayload(searchId);
  const providerEntry = providerCatalog[searchEntry.provider];

  let connections = [];
  if (searchEntry.hasManagedConnection) connections.push("Managed");
  if (searchEntry.allowsUserConnection) connections.push("User");

  const video = videoCatalog[searchId as keyof typeof videoCatalog] as
    | string
    | undefined;

  const formConfig = useMemo(() => {
    try {
      const config = getSearchPayloadFormConfig({
        searchPayload: defaultSearchPayload,
      });
      return config;
    } catch {
      null;
    }
  }, []);

  return (
    <div className="pipe-header space-y-10">
      <CatalogHeader
        label={searchEntry.label}
        description={searchEntry.description}
        defaultProviders={[searchEntry.provider]}
        id={searchId}
        video={video}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Billing Mode</TableHead>
              <TableHead>Credentials</TableHead>
              <TableHead>
                Cost per result{" "}
                <InlineDocsBadge href={appLinks.searchBilling()} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="">
                <div className="flex gap-2">
                  <Avatar>
                    <AvatarImage
                      src={providerEntry.logoUrl}
                      alt={`${providerEntry.label} logo`}
                    />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">
                    {providerEntry.label}{" "}
                    <Info>{providerEntry.description}</Info>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {searchEntry.cost.mode === "per_result"
                  ? "Per Result"
                  : "Per Search"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {connections.join(", ")}
                </div>
              </TableCell>
              <TableCell>
                <p>
                  {formatCredits(
                    searchEntry.cost.mode === "per_result"
                      ? searchEntry.cost.creditsPerResult
                      : searchEntry.cost.creditsPerSearch
                  ) || "Free"}{" "}
                  credits
                </p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div>
          <h3 className="font-medium mb-3 pb-2 border-b">Output Fields</h3>
          <div className="space-y-2">
            {searchEntry.defaultOutputFields.map((fieldName) => {
              const found = getField(fieldName as FieldName);
              const isEnabledByDefault = !!(
                defaultSearchPayload?.config?.output_fields as Record<
                  string,
                  any
                >
              )?.[fieldName]?.enabled;
              if (!found) return null;

              return (
                <FieldRow
                  key={fieldName}
                  fieldName={found.name}
                  fieldType={found.type}
                  description={found.description}
                  rightAction={
                    <OutputFieldEnabledBadge
                      isEnabledByDefault={isEnabledByDefault}
                    />
                  }
                />
              );
            })}
          </div>
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
                oas={searchesMiniSpec}
                operation={searchesMiniSpec.operation(
                  "/v1/searches/run",
                  "post"
                )}
                harData={{ body: snippetCatalog[searchId] }}
              />
            </AccordionContent>
          </AccordionItem>
          {formConfig && (
            <AccordionItem value="config-reference">
              <AccordionTrigger className="">Config reference</AccordionTrigger>
              <AccordionContent>
                <PayloadDocumenation formConfig={formConfig} />
              </AccordionContent>
            </AccordionItem>
          )}
          <AccordionItem value="full-config">
            <AccordionTrigger className="">
              Full config example
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
      config: ${JSON.stringify(defaultSearchPayload, null, 2).replace(
        /\n/g,
        "\n      "
      )} 
    }],
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
    "config": ${JSON.stringify(defaultSearchPayload, null, 2).replace(
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
    </div>
  );
}
