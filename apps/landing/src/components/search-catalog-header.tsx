"use client";

import { searchMiniSpec } from "@/lib/search/snippet-catalog";
import { videoCatalog } from "@/lib/search/video-catalog";
import { PayloadDocumenation } from "@/components/config-documentation";
import { ApiRequestCodeExample } from "@/components/features/docs/api-request-code-example";
import { CatalogHeader } from "@/components/features/docs/docs-layout";
import { BandCard } from "@/components/features/pipe-catalog/band-card";
import { FieldRow } from "@/components/features/pipe-catalog/field-row";
import { Info } from "@/components/info";
import { InlineDocsBadge } from "@/components/inline-docs-badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { docsLinkPaths } from "@pipe0/doc-links";
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
} from "@pipe0/base";
import { Callout } from "fumadocs-ui/components/callout";
import { Tabs, Tab } from "fumadocs-ui/components/tabs";
import Link from "next/link";
import { useMemo } from "react";
import { DynamicCodeBlock } from "@/components/features/docs/dynamic-code-block";
import { SearchFormPreview } from "@/components/features/docs/search-form-preview";

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
        formContext: { field_options: {} },
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
                    {formatCredits(searchEntry.cost.credits.default) || "Free"}{" "}
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
          <div className="space-y-3">
            {searchEntry.outputFieldMode === "dynamic" ? (
              <Callout type="info" title="Dynamic output fields">
                This search&apos;s output columns are determined at run time and
                depend on the data source, so they aren&apos;t known ahead of
                time. Enable{" "}
                <Link
                  href="/docs/search/advanced/search-request-payload#configfield_definitionsenabled"
                  className="underline text-primary"
                >
                  <code>config.field_definitions.enabled</code>
                </Link>{" "}
                to receive the columns alongside your results in the response{" "}
                <Link
                  href="/docs/search/advanced/search-response-object#field_definitions"
                  className="underline text-primary"
                >
                  <code>field_definitions</code>
                </Link>
                .
              </Callout>
            ) : (
            (() => {
              const enabled: {
                fieldName: string;
                found: NonNullable<ReturnType<typeof getField>>;
              }[] = [];
              const optional: {
                fieldName: string;
                found: NonNullable<ReturnType<typeof getField>>;
              }[] = [];
              for (const fieldName of getDefaultSearchOutputFields(
                searchEntry.searchId,
              )) {
                const found = getField(fieldName as FieldName);
                if (!found) continue;
                const isEnabledByDefault = !!(
                  defaultSearchPayload?.config?.output_fields as Record<
                    string,
                    any
                  >
                )?.[fieldName]?.enabled;
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
                      {enabled.map(renderRow)}
                    </BandCard>
                  )}
                  {optional.length > 0 && (
                    <BandCard
                      label="Enable optionally"
                      description="Opt in to these fields via the search config."
                      count={optional.length}
                    >
                      {optional.map(renderRow)}
                    </BandCard>
                  )}
                </>
              );
            })()
            )}
          </div>
        </div>
      </CatalogHeader>

      <div>
        <h2 className="text-2xl">Code Example</h2>
        <ApiRequestCodeExample
          oas={searchMiniSpec}
          operation={searchMiniSpec.operation("/v1/search/run", "post")}
          harData={{ body: { search: searchSnippetCatalog[searchId][0] } }}
        />
      </div>

      <div className="">
        <Accordion type="multiple" defaultValue={["code"]}>
          {formConfig && (
            <AccordionItem value="config-reference">
              <AccordionTrigger className="">Config reference</AccordionTrigger>
              <AccordionContent>
                <PayloadDocumenation
                  formConfig={formConfig}
                  searchable
                  exampleFilename={`${searchId.replace(/[@:]/g, "-")}-config-example`}
                />
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
          <AccordionItem value="form-ui">
            <AccordionTrigger className="">
              <span className="flex items-center gap-2">
                Form UI
                <Badge className="text-[10px] px-1.5 py-0 font-medium leading-none">
                  Beta
                </Badge>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <SearchFormPreview
                searchId={searchId}
                searchLabel={searchEntry.label}
                defaultValues={defaultSearchPayload}
                docsHref={docsLinkPaths.elementsReact}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
