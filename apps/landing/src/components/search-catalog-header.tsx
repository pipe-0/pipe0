import { searchMiniSpec } from "@/lib/search/snippet-catalog";
import { videoCatalog } from "@/lib/search/video-catalog";
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
import { docsLinkPaths } from "@pipe0/docs-links";
import { formatCredits } from "@/lib/utils";
import {
  FieldName,
  getDefaultSearchOutputFields,
  getField,
  getSearchDefaultPayload,
  getSearchEntry,
  getSearchPayloadFormConfig,
  getSearchVersion,
  providerCatalog,
  searchCatalog,
  SearchId,
  searchSnippetCatalog,
} from "@pipe0/ops";
import { Tabs, Tab } from "fumadocs-ui/components/tabs";
import { useMemo } from "react";
import { DynamicCodeBlock } from "@/components/features/docs/dynamic-code-block";

function findAllSearchVersions(searchId: SearchId) {
  const searchEntry = getSearchEntry(searchId);
  return Object.values(searchCatalog)
    .filter((e) => e.baseSearch === searchEntry.baseSearch)
    .sort(
      (a, b) => getSearchVersion(b.searchId) - getSearchVersion(a.searchId),
    );
}

type PipeHeaderProps = {
  searchId: SearchId;
};

export function SearchCatalogHeader({ searchId }: PipeHeaderProps) {
  const searchEntry = getSearchEntry(searchId);
  const searchVersions = findAllSearchVersions(searchId);

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
      return undefined;
    }
  }, [defaultSearchPayload]);

  return (
    <div className="pipe-header space-y-5">
      <CatalogHeader
        label={searchEntry.label}
        description={searchEntry.description}
        defaultProviders={[searchEntry.provider]}
        id={searchId}
        video={video}
        availableVersions={searchVersions.map((v) => {
          const versionEntry = getSearchEntry(v.searchId);
          return {
            displayValue: `@${v.searchId.split("@")[1]}`,
            link: versionEntry.docPath.replace(
              "/resources/search-catalog",
              "/docs/search/search-catalog",
            ),
            isDeprecated: !!(versionEntry.lifecycle as any)?.deprecatedOn,
          };
        })}
        tags={searchEntry.tags}
      >
        <div className="bg-accent/20 border rounded-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Billing Mode</TableHead>
                <TableHead>Credentials</TableHead>
                <TableHead>
                  <div className="flex gap-2 items-center">
                    {searchEntry.cost.mode === "per_result"
                      ? "Cost per result"
                      : searchEntry.cost.mode === "per_search"
                        ? "Cost per search"
                        : "Cost per page"}
                    <InlineDocsBadge href={docsLinkPaths.searchBilling} />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="">
                  <div className="flex gap-2 items-center">
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
                        : searchEntry.cost.mode === "per_search"
                          ? searchEntry.cost.creditsPerSearch
                          : searchEntry.cost.creditsPerPage,
                    ) || "Free"}{" "}
                    credits
                  </p>
                  <p className="max-w-37.5">
                    <small className="text-muted-foreground">
                      {searchEntry.cost.mode === "per_page" &&
                        "1 page = 100 records; 200 results = 2 pages"}
                    </small>
                  </p>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div>
          <h3 className="text-2xl mb-3 pb-2 border-b">Output Fields</h3>
          <div className="space-y-2">
            {getDefaultSearchOutputFields(searchEntry.searchId).map(
              (fieldName) => {
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
                    leftAction={
                      <OutputFieldEnabledBadge
                        isEnabledByDefault={isEnabledByDefault}
                      />
                    }
                  />
                );
              },
            )}
          </div>
        </div>
      </CatalogHeader>

      <div>
        <h2 className="text-2xl">Code Example</h2>
        <ApiRequestCodeExample
          oas={searchMiniSpec}
          operation={searchMiniSpec.operation("/v1/search/run", "post")}
          harData={{ body: searchSnippetCatalog[searchId][0] }}
        />
      </div>

      <div className="">
        <Accordion type="multiple" defaultValue={["code"]}>
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
                <Tabs items={["Typescript", "cURL"]}>
                  <Tab value="Typescript">
                    <DynamicCodeBlock
                      lang="typescript"
                      code={`const result = await fetch("https://api.pipe0.com/v1/search/run", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    search: {
      search_id: "${searchId}",
      config: ${JSON.stringify(defaultSearchPayload, null, 2).replace(
        /\n/g,
        "\n      ",
      )}
    },
  })
});`}
                    />
                  </Tab>
                  <Tab value="cURL">
                    <DynamicCodeBlock
                      lang="bash"
                      code={`curl -X POST "https://api.pipe0.com/v1/search/run" \\
-H "Authorization: Bearer $API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
    "search": {
      "search_id": "${searchId}",
      "config": ${JSON.stringify(defaultSearchPayload, null, 2).replace(
        /\n/g,
        "\n      ",
      )}
    }
}'`}
                    />
                  </Tab>
                </Tabs>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
