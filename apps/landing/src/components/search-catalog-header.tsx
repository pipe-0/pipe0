"use client";

import { searchMiniSpec } from "@/lib/search/snippet-catalog";
import { videoCatalog } from "@/lib/search/video-catalog";
import { PayloadDocumenation } from "@/components/config-documentation";
import { ApiRequestCodeExample } from "@/components/features/docs/api-request-code-example";
import {
  EntryHeader,
  SectionTriggerLabel,
} from "@/components/features/pipe-catalog/entry-header";
import { HeaderVideoSection } from "@/components/features/docs/header-video-section";
import { formatCredits } from "@/lib/utils";
import { lowestManagedCredit } from "@/lib/pricing/high-volume";
import { CatalogDeprecationAlert } from "@/components/catalog-deprecation-alert";
import { resolveCurrentSearch } from "@/lib/catalog-lifecycle";
import { BandCard } from "@/components/features/pipe-catalog/band-card";
import { FieldRow } from "@/components/features/pipe-catalog/field-row";
import { Info } from "@/components/info";
import { HighVolumePriceCell } from "@/components/high-volume-price";
import { effectiveCredits } from "@/lib/pricing/effective-credits";
import {
  isUsageMeteredSearch,
  USAGE_METERED_LABEL,
} from "@/lib/pricing/usage-metered";
import { ProviderTable } from "@/components/features/pipe-catalog/provider-table";
import { InlineDocsBadge } from "@/components/inline-docs-badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { docsLinkPaths } from "@pipe0/doc-links";
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

  // Usage-metered searches bill their own operations as they run, so the flat
  // `cost.credits` is 0 and is display metadata only. Everything price-shaped
  // below branches on this rather than printing that 0 as a real price.
  const usageMetered = isUsageMeteredSearch(searchEntry);
  const billableEntries = Object.entries(searchEntry.billableOperations ?? {});

  let connections = [];
  if (searchEntry.hasManagedConnection) connections.push("Managed");
  if (searchEntry.allowsUserConnection) connections.push("User");

  const video = videoCatalog[searchId as keyof typeof videoCatalog] as
    | string
    | undefined;

  // The curated snippet payload is the code example body and the source of
  // example values in the config reference below.
  const snippetPayload = searchSnippetCatalog[searchId]?.[0];

  // Snippets ship without connections. When the search accepts user
  // connections, show a valid provider-prefixed vault string in the config
  // reference instead of an empty connector.
  const snippetConnections = snippetPayload
    ? (snippetPayload as { connector?: { connections?: unknown[] } | null })
        .connector?.connections
    : undefined;
  const configExamplePayload = !snippetPayload
    ? undefined
    : !searchEntry.allowsUserConnection ||
        (snippetConnections && snippetConnections.length > 0)
      ? snippetPayload
      : {
          ...snippetPayload,
          connector: {
            strategy: "first",
            connections: [
              { type: "vault", connection: `${searchEntry.provider}_abcd123` },
            ],
          },
        };

  const deprecatedOn = searchEntry.lifecycle?.deprecatedOn;
  const currentSuccessor = deprecatedOn ? resolveCurrentSearch(searchId) : null;

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

  const versions = searchVersions.map((v) => {
    const versionEntry = getSearchEntry(v.searchId);
    return {
      displayValue: `@${v.searchId.split("@")[1]}`,
      link: versionEntry.docPath,
      isDeprecated: !!versionEntry.lifecycle?.deprecatedOn,
    };
  });

  const costUnit = usageMetered
    ? "Usage"
    : searchEntry.cost.mode === "per_result"
      ? "result"
      : searchEntry.cost.mode === "per_search"
        ? "search"
        : "page";

  const outputSection = (() => {
    if (searchEntry.outputFieldMode === "config") {
      return (
        <Callout type="info" title="You define the output fields">
          This search&apos;s columns come from its own config, not from the
          catalog: every <code>{'{% output name, type: "string" %}'}</code> tag
          you declare in the prompt becomes one column on every row returned.
          See the config reference below for the tag syntax.
        </Callout>
      );
    }
    if (searchEntry.outputFieldMode === "dynamic") {
      return (
        <Callout type="info" title="Dynamic output fields">
          This search&apos;s output columns are determined at run time and
          depend on the data source. Enable{" "}
          <Link
            href="/docs/search/request-payload#configfield_definitionsenabled"
            className="text-primary underline"
          >
            <code>config.field_definitions.enabled</code>
          </Link>{" "}
          to receive the columns alongside your results in the response{" "}
          <Link
            href="/docs/search/response-object#field_definitions"
            className="text-primary underline"
          >
            <code>field_definitions</code>
          </Link>
          .
        </Callout>
      );
    }
    const enabled: { fieldName: string; found: NonNullable<ReturnType<typeof getField>> }[] = [];
    const optional: { fieldName: string; found: NonNullable<ReturnType<typeof getField>> }[] = [];
    for (const fieldName of getDefaultSearchOutputFields(searchEntry.searchId)) {
      const found = getField(fieldName as FieldName);
      if (!found) continue;
      const isEnabledByDefault = !!(
        defaultSearchPayload?.config?.output_fields as Record<string, any>
      )?.[fieldName]?.enabled;
      (isEnabledByDefault ? enabled : optional).push({ fieldName, found });
    }
    const renderRow = ({
      found,
    }: {
      fieldName: string;
      found: NonNullable<ReturnType<typeof getField>>;
    }) => (
      <FieldRow
        key={found.name}
        fieldName={found.name}
        fieldType={found.type}
        description={found.description}
      />
    );
    return (
      <div className="space-y-2">
        {enabled.length > 0 && (
          <BandCard
            label="Enabled by default"
            description="These fields are returned without extra config."
            count={enabled.length}
            tone="enabled"
          >
            {enabled.map(renderRow)}
          </BandCard>
        )}
        {optional.length > 0 && (
          <BandCard
            label="Enable on demand"
            description="Opt in to these fields via the search config."
            count={optional.length}
            tone="optional"
          >
            {optional.map(renderRow)}
          </BandCard>
        )}
      </div>
    );
  })();

  return (
    <div className="space-y-5">
      <EntryHeader
        id={searchId}
        idLabel="Copy search id"
        label={searchEntry.label}
        description={searchEntry.description}
        providers={[searchEntry.provider]}
        deprecated={!!deprecatedOn}
        versions={versions}
        price={
          usageMetered
            ? USAGE_METERED_LABEL
            : (() => {
                const credits = effectiveCredits(searchEntry.cost);
                return credits
                  ? `from ${formatCredits(lowestManagedCredit(credits))} cr / ${costUnit}`
                  : "Free";
              })()
        }
      />

      {deprecatedOn && (
        <CatalogDeprecationAlert
          kind="search"
          deprecatedOn={deprecatedOn}
          successor={
            currentSuccessor
              ? {
                  id: currentSuccessor,
                  docPath: getSearchEntry(currentSuccessor).docPath,
                }
              : null
          }
        />
      )}

      <Accordion
        type="multiple"
        defaultValue={["provider", "billing", "output-fields", "walkthrough", "code-example"]}
      >
        <AccordionItem value="provider">
          <AccordionTrigger>
            <SectionTriggerLabel label="Provider" />
          </AccordionTrigger>
          <AccordionContent className="pl-6">
            <div className="overflow-hidden rounded-[10px] border border-[var(--rule)]">
              <div className="grid grid-cols-[minmax(0,1fr)_140px_140px_140px] items-center gap-4 border-b border-[var(--rule)] bg-[var(--well)] px-3 py-2 text-[12px] font-medium text-muted-foreground">
                <span>Provider</span>
                <span>Billing</span>
                <span>Connection</span>
                <span className="flex items-center justify-end gap-1.5">
                  Cost
                  <InlineDocsBadge href={docsLinkPaths.searchBilling} />
                </span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_140px_140px_140px] items-center gap-4 px-3 py-2.5 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar className="size-7 rounded-md">
                    <AvatarImage
                      src={providerEntry.logoUrl}
                      alt={`${providerEntry.label} logo`}
                    />
                    <AvatarFallback className="rounded-md text-[10px]">
                      {providerEntry.label.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate font-medium">
                    {providerEntry.label}
                  </span>
                  <Info>{providerEntry.description}</Info>
                </div>
                <span className="text-muted-foreground">
                  {usageMetered
                    ? "Usage"
                    : searchEntry.cost.mode === "per_result"
                      ? "Per result"
                      : searchEntry.cost.mode === "per_search"
                        ? "Per search"
                        : "Per page"}
                </span>
                <span className="text-muted-foreground">
                  {connections.join(", ")}
                </span>
                <div className="text-right tabular-nums">
                  {usageMetered ? (
                    <span>{USAGE_METERED_LABEL}</span>
                  ) : (
                    <HighVolumePriceCell
                      credits={effectiveCredits(searchEntry.cost)}
                      unit="credits"
                    />
                  )}
                  {(usageMetered || searchEntry.cost.mode === "per_page") && (
                    <p className="text-[12px] text-muted-foreground">
                      {usageMetered
                        ? searchEntry.cost.info
                        : "1 page = 100 records"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {usageMetered && billableEntries.length > 0 && (
          <AccordionItem value="billing">
            <AccordionTrigger>
              <SectionTriggerLabel label="Billing" count={billableEntries.length} />
            </AccordionTrigger>
            <AccordionContent className="pl-6">
              <p className="mb-3 text-sm text-muted-foreground">
                Every operation this search can bill while it runs. Model token
                rates are charged per 100-token block; the rest are charged per
                call. Hover a price for its unit.
              </p>
              <ProviderTable entries={billableEntries} />
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="output-fields">
          <AccordionTrigger>
            <SectionTriggerLabel label="Output fields" />
          </AccordionTrigger>
          <AccordionContent className="pl-6">{outputSection}</AccordionContent>
        </AccordionItem>

        {video && (
          <AccordionItem value="walkthrough">
            <AccordionTrigger>
              <SectionTriggerLabel label="Walkthrough" hint="2 min" />
            </AccordionTrigger>
            <AccordionContent className="pl-6">
              <HeaderVideoSection videoUrl={video} />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* No runnable example for a deprecated search: a copyable snippet is
            what agents and people reuse, and it would carry the deprecated id. */}
        {!deprecatedOn && (
          <AccordionItem value="code-example">
            <AccordionTrigger>
              <SectionTriggerLabel label="Code example" hint="POST /v1/search/run" />
            </AccordionTrigger>
            <AccordionContent className="pl-6">
              <ApiRequestCodeExample
                oas={searchMiniSpec}
                operation={searchMiniSpec.operation("/v1/search/run", "post")}
                harData={{ body: { search: snippetPayload } }}
              />
            </AccordionContent>
          </AccordionItem>
        )}


        {formConfig && (
          <AccordionItem value="config-reference">
            <AccordionTrigger>
              <SectionTriggerLabel label="Config reference" />
            </AccordionTrigger>
            <AccordionContent className="pl-6">
              <PayloadDocumenation
                formConfig={formConfig}
                searchable
                examplePayload={configExamplePayload}
              />
            </AccordionContent>
          </AccordionItem>
        )}
        {!deprecatedOn && (
          <AccordionItem value="full-config">
            <AccordionTrigger className="">
              Full config example
            </AccordionTrigger>
            <AccordionContent className="pl-6">
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
        )}
        <AccordionItem value="form-ui">
          <AccordionTrigger>
            <SectionTriggerLabel label="Form UI" hint="Beta" />
          </AccordionTrigger>
          <AccordionContent className="pl-6">
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
  );
}
