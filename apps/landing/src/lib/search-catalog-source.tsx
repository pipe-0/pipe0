import type { Source, VirtualFile } from "fumadocs-core/source";
import {
  getDefaultSearchOutputFields,
  getField,
  getSearchDefaultPayload,
  getSearchEntry,
  getSearchVersion,
  providerCatalog,
  searchCatalog,
  SearchId,
} from "@pipe0/base";
import {
  effectiveCredits,
  isPlatformPaid,
} from "@/lib/pricing/effective-credits";
import { isUsageMeteredSearch } from "@/lib/pricing/usage-metered";

interface SearchCatalogPageData {
  title: string;
  description: string;
  icon?: string;
  full?: boolean;
  structuredData?: {
    headings: { id: string; content: string }[];
    contents: { heading: string; content: string }[];
  };
  body?: undefined;
  toc?: undefined;
  _isVirtual: true;
  _virtualType: "search-catalog-index" | "search-entry";
  _searchId?: string;
  _markdown?: string;
}

interface SearchCatalogMetaData {
  title: string;
  description?: string;
  icon?: string;
  pages?: string[];
  defaultOpen?: boolean;
  root?: boolean;
}

type SearchCatalogSource = Source<{
  pageData: SearchCatalogPageData;
  metaData: SearchCatalogMetaData;
}>;

/** Same contract as the pipe catalog: the markdown is the copy agents read. */
function getSearchDeprecation(entry: ReturnType<typeof getSearchEntry>) {
  const deprecatedOn = entry.lifecycle?.deprecatedOn;
  if (!deprecatedOn) return null;
  const replacedBy = entry.lifecycle?.replacedBy ?? null;
  const successor = replacedBy
    ? `Use ${replacedBy} instead: https://pipe0.com${getSearchEntry(replacedBy).docPath}`
    : "It has no direct replacement";
  return {
    deprecatedOn,
    replacedBy,
    summary: `Deprecated since ${deprecatedOn}. ${successor}.`,
    notice: `**Deprecated since ${deprecatedOn}. Do not use this search in new work.** ${successor}. It keeps running only for sheets and integrations that already use it and can be removed without notice.`,
  };
}

function generateSearchMarkdown(searchId: SearchId): string {
  const entry = getSearchEntry(searchId);
  const lines: string[] = [];

  lines.push(`# ${entry.label} (${searchId})`);
  lines.push("");
  const deprecation = getSearchDeprecation(entry);
  if (deprecation) {
    lines.push(`> ${deprecation.notice}`);
    lines.push("");
  }
  lines.push(entry.description);
  lines.push("");

  // Provider
  const provider = providerCatalog[entry.provider];
  if (provider) {
    lines.push("## Provider");
    lines.push("");
    lines.push(`- **${provider.label}**: ${provider.description}`);
    lines.push("");
  }

  // Cost. Platform-paid entries (e.g. X) have `credits: null` but a real
  // per-unit price in `userConnectionCredits` — never read `credits.default`
  // directly here.
  lines.push("## Pricing");
  lines.push("");
  const perUnit = effectiveCredits(entry.cost)?.default;
  const platformPaidSuffix = isPlatformPaid(entry.cost)
    ? " (billed on your own connection)"
    : "";
  // Usage-metered: `cost.credits.default` is 0 display metadata, so the
  // per-unit branches below would publish "0 credits per search" for a search
  // that bills real credits. The operations ARE the price.
  if (isUsageMeteredSearch(entry)) {
    lines.push(`- Billing mode: Usage`);
    if (entry.cost.info) lines.push(`- Cost: ${entry.cost.info}`);
    for (const [operation, def] of Object.entries(
      entry.billableOperations ?? {},
    )) {
      const credits = effectiveCredits(def)?.default;
      if (credits == null) continue;
      const note = (def as { note?: string }).note;
      lines.push(`  - \`${operation}\`: ${credits} credits${note ? ` — ${note}` : ""}`);
    }
  } else if (entry.cost.mode === "per_result") {
    lines.push(`- Billing mode: Per Result`);
    lines.push(`- Cost: ${perUnit ?? 0} credits per result${platformPaidSuffix}`);
  } else if (entry.cost.mode === "per_search") {
    lines.push(`- Billing mode: Per Search`);
    lines.push(`- Cost: ${perUnit ?? 0} credits per search${platformPaidSuffix}`);
  } else if (entry.cost.mode === "per_page") {
    lines.push(`- Billing mode: Per Page`);
    lines.push(`- Cost: ${perUnit ?? 0} credits per page${platformPaidSuffix}`);
  }
  lines.push("");

  // Output Fields
  const outputFields = getDefaultSearchOutputFields(searchId);
  if (outputFields.length > 0) {
    lines.push("## Output Fields");
    lines.push("");
    for (const fieldName of outputFields) {
      const field = getField(fieldName as any);
      if (field) {
        lines.push(`- **${fieldName}** (${field.type}): ${field.description}`);
      }
    }
    lines.push("");
  }

  // No runnable example for a deprecated search — the code block is what an
  // agent copies, so it must not carry the id the notice warns against.
  if (deprecation) {
    lines.push("## Code Example");
    lines.push("");
    lines.push(
      deprecation.replacedBy
        ? `Not provided for a deprecated search. See the ${deprecation.replacedBy} page for a current example.`
        : "Not provided for a deprecated search.",
    );
    return lines.join("\n");
  }

  // Code Example
  lines.push("## Code Example");
  lines.push("");
  lines.push("```bash");
  lines.push(`curl -X POST "https://api.pipe0.com/v1/search/run" \\`);
  lines.push(`  -H "Authorization: Bearer $API_KEY" \\`);
  lines.push(`  -H "Content-Type: application/json" \\`);
  lines.push(`  -d '{"search": {"search_id": "${searchId}"}}'`);
  lines.push("```");
  lines.push("");

  // Default Config
  const defaultPayload = getSearchDefaultPayload(searchId);
  lines.push("## Default Config");
  lines.push("");
  lines.push("```json");
  lines.push(
    JSON.stringify(
      {
        search: {
          search_id: searchId,
          config: defaultPayload,
        },
      },
      null,
      2,
    ),
  );
  lines.push("```");

  return lines.join("\n");
}

function generateSearchStructuredData(searchId: SearchId) {
  const entry = getSearchEntry(searchId);
  const headings: { id: string; content: string }[] = [];
  const contents: { heading: string; content: string }[] = [];

  headings.push({ id: "provider", content: "Provider" });
  headings.push({ id: "pricing", content: "Pricing" });
  headings.push({ id: "output-fields", content: "Output Fields" });

  // Add description as searchable content
  const deprecation = getSearchDeprecation(entry);
  if (deprecation) {
    contents.push({
      heading: "",
      content: `${entry.label} (${searchId}). ${deprecation.summary}`,
    });
  }
  contents.push({
    heading: "",
    content: `${entry.label}. ${entry.description}`,
  });

  // Provider
  const provider = providerCatalog[entry.provider];
  if (provider) {
    contents.push({
      heading: "provider",
      content: `${provider.label}: ${provider.description}`,
    });
  }

  // Output fields
  const outputFields = getDefaultSearchOutputFields(searchId);
  for (const fieldName of outputFields) {
    const field = getField(fieldName as any);
    if (field) {
      contents.push({
        heading: "output-fields",
        content: `${fieldName}: ${field.description}`,
      });
    }
  }

  return { headings, contents };
}

export function createSearchCatalogSource(): SearchCatalogSource {
  const files: VirtualFile<{
    pageData: SearchCatalogPageData;
    metaData: SearchCatalogMetaData;
  }>[] = [];

  // Root meta — makes Search Catalog its own dropdown panel in the sidebar.
  files.push({
    type: "meta",
    path: "search-catalog/meta.json",
    data: {
      title: "Search Catalog",
      root: true,
      description: "Browse search datasets",
      icon: "Library",
    },
  });

  // Index page — rendered by SearchCatalogIndexPage via the _virtualType branch.
  files.push({
    type: "page",
    path: "search-catalog/index.mdx",
    data: {
      title: "Search Catalog",
      description: "Browse search datasets",
      full: true,
      structuredData: { headings: [], contents: [] },
      _isVirtual: true,
      _virtualType: "search-catalog-index",
    },
  });

  // Individual search entry pages — hidden folder with explicit slugs so URLs
  // are /search-catalog/<baseSearch>/<version> without exposing the folder.
  for (const searchId of Object.keys(searchCatalog) as SearchId[]) {
    const entry = getSearchEntry(searchId);
    const baseSearch = entry.baseSearch;
    const version = getSearchVersion(searchId);

    const markdown = generateSearchMarkdown(searchId);
    const structuredData = generateSearchStructuredData(searchId);
    const deprecation = getSearchDeprecation(entry);

    files.push({
      type: "page",
      path: `_search-entries/${baseSearch}/${version}.mdx`,
      slugs: ["search-catalog", baseSearch, String(version)],
      data: {
        title: `${entry.label} (${searchId})`,
        description: deprecation
          ? `${deprecation.summary} ${entry.description}`
          : entry.description,
        structuredData,
        _isVirtual: true,
        _virtualType: "search-entry",
        _searchId: searchId,
        _markdown: markdown,
      },
    });
  }

  return { files };
}
