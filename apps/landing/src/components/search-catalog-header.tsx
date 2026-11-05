import { Link } from "@tanstack/react-router";
import { PayloadDocumenation } from "@/components/config-documentation";
import { ApiRequestCodeExample } from "@/components/features/docs/api-request-code-example";
import {
  EntryHeader,
  SectionTriggerLabel,
} from "@/components/features/pipe-catalog/entry-header";
import { HeaderVideoSection } from "@/components/features/docs/header-video-section";
import { CatalogDeprecationAlert } from "@/components/catalog-deprecation-alert";
import { CatalogNoticeAlert } from "@/components/catalog-notice-alert";
import { OutputBands } from "@/components/features/pipe-catalog/output-bands";
import { Info } from "@/components/info";
import { HighVolumePriceCell } from "@/components/high-volume-price";
import { ProviderTable } from "@/components/features/pipe-catalog/provider-table";
import { InlineDocsBadge } from "@/components/inline-docs-badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { CodeExample } from "@/lib/api-snippets.server";
import type { SearchEntryData } from "@/lib/catalog-entry.server";
import { docsLinkPaths } from "@pipe0/doc-links";
import { Callout } from "fumadocs-ui/components/callout";
import { Tabs, Tab } from "fumadocs-ui/components/tabs";
import { DynamicCodeBlock } from "@/components/features/docs/dynamic-code-block";
import { SearchFormPreview } from "@/components/features/docs/search-form-preview";

function OutputSection({ entry }: { entry: SearchEntryData }) {
  if (entry.outputFieldMode === "config") {
    return (
      <Callout type="info" title="You define the output fields">
        This search&apos;s columns come from its own config, not from the
        catalog: every <code>{'{% output name, type: "string" %}'}</code> tag
        you declare in the prompt becomes one column on every row returned.
        See the config reference below for the tag syntax.
      </Callout>
    );
  }
  if (entry.outputFieldMode === "dynamic") {
    return (
      <Callout type="info" title="Dynamic output fields">
        This search&apos;s output columns are determined at run time and
        depend on the data source. Enable{" "}
        <Link
          to="/docs/$" params={{ _splat: "search/request-payload" }} hash="configfield_definitionsenabled"
          className="text-primary underline"
        >
          <code>config.field_definitions.enabled</code>
        </Link>{" "}
        to receive the columns alongside your results in the response{" "}
        <Link
          to="/docs/$" params={{ _splat: "search/response-object" }} hash="field_definitions"
          className="text-primary underline"
        >
          <code>field_definitions</code>
        </Link>
        .
      </Callout>
    );
  }
  return <OutputBands {...entry.outputs} kind="search" />;
}

export function SearchCatalogHeader({
  entry,
  codeExamples,
}: {
  entry: SearchEntryData;
  codeExamples: CodeExample[];
}) {
  const { provider, formConfig, video, deprecatedOn, defaultPayload } = entry;

  return (
    <div className="space-y-5">
      <EntryHeader
        id={entry.id}
        idLabel="Copy search id"
        label={entry.label}
        description={entry.description}
        provider={provider}
        providerCount={1}
        deprecated={!!deprecatedOn}
        versions={entry.versions}
        price={entry.price}
      />

      <CatalogNoticeAlert notice={entry.notice} />

      {deprecatedOn && (
        <CatalogDeprecationAlert
          kind="search"
          deprecatedOn={deprecatedOn}
          successor={entry.successor}
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
              {/* Phones get provider and cost only; billing and connection
                  move to a line under the provider. */}
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-[var(--rule)] bg-[var(--well)] px-3 py-2 text-[12px] font-medium text-muted-foreground sm:grid-cols-[minmax(0,1fr)_140px_140px_140px]">
                <span>Provider</span>
                <span className="max-sm:hidden">Billing</span>
                <span className="max-sm:hidden">Connection</span>
                <span className="flex items-center justify-end gap-1.5">
                  Cost
                  <InlineDocsBadge href={docsLinkPaths.searchBilling} />
                </span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-3 py-2.5 text-sm sm:grid-cols-[minmax(0,1fr)_140px_140px_140px]">
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar
                    className="size-7 rounded-md"
                    style={{ backgroundColor: provider.tileColor }}
                  >
                    <AvatarImage
                      src={provider.logoUrl}
                      alt={`${provider.label} logo`}
                    />
                    <AvatarFallback className="rounded-md text-[10px]">
                      {provider.label.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate font-medium">
                        {provider.label}
                      </span>
                      <Info>{provider.description}</Info>
                    </div>
                    <div className="text-[12px] text-muted-foreground sm:hidden">
                      {entry.billing} · {entry.connections.join(", ")}
                    </div>
                  </div>
                </div>
                <span className="text-muted-foreground max-sm:hidden">
                  {entry.billing}
                </span>
                <span className="text-muted-foreground max-sm:hidden">
                  {entry.connections.join(", ")}
                </span>
                <div className="text-right tabular-nums">
                  {entry.costLabel ? (
                    <span>{entry.costLabel}</span>
                  ) : (
                    <HighVolumePriceCell price={entry.cost} unit="credits" />
                  )}
                  {entry.costNote && (
                    <p className="text-[12px] text-muted-foreground">
                      {entry.costNote}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {entry.operations.length > 0 && (
          <AccordionItem value="billing">
            <AccordionTrigger>
              <SectionTriggerLabel label="Billing" count={entry.operations.length} />
            </AccordionTrigger>
            <AccordionContent className="pl-6">
              <p className="mb-3 text-sm text-muted-foreground">
                Every operation this search can bill while it runs. Model token
                rates are charged per 100-token block; the rest are charged per
                call. Hover a price for its unit.
              </p>
              <ProviderTable rows={entry.operations} />
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="output-fields">
          <AccordionTrigger>
            <SectionTriggerLabel label="Output fields" />
          </AccordionTrigger>
          <AccordionContent className="pl-6">
            <OutputSection entry={entry} />
          </AccordionContent>
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

        {codeExamples.length > 0 && (
          <AccordionItem value="code-example">
            <AccordionTrigger>
              <SectionTriggerLabel label="Code example" hint="POST /v1/search/run" />
            </AccordionTrigger>
            <AccordionContent className="pl-6">
              <ApiRequestCodeExample examples={codeExamples} />
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
                vocabulary={entry.vocabulary}
                examplePayload={entry.examplePayload}
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
    search: ${JSON.stringify(defaultPayload, null, 2).replace(
                      /\n/g,
                      "\n    ",
                    )},
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
    "search": ${JSON.stringify(defaultPayload, null, 2).replace(
                      /\n/g,
                      "\n    ",
                    )}
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
              searchId={entry.id}
              searchLabel={entry.label}
              defaultValues={defaultPayload}
              docsHref={docsLinkPaths.elementsReact}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
