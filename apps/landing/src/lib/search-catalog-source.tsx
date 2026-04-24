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
} from "@pipe0/elements";

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
  icon?: string;
  pages?: string[];
  defaultOpen?: boolean;
}

type SearchCatalogSource = Source<{
  pageData: SearchCatalogPageData;
  metaData: SearchCatalogMetaData;
}>;

function generateSearchMarkdown(searchId: SearchId): string {
  const entry = getSearchEntry(searchId);
  const lines: string[] = [];

  lines.push(`# ${entry.label} (${searchId})`);
  lines.push("");
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

  // Cost
  lines.push("## Pricing");
  lines.push("");
  if (entry.cost.mode === "per_result") {
    lines.push(`- Billing mode: Per Result`);
    lines.push(`- Cost: ${entry.cost.creditsPerResult} credits per result`);
  } else if (entry.cost.mode === "per_search") {
    lines.push(`- Billing mode: Per Search`);
    lines.push(`- Cost: ${entry.cost.creditsPerSearch} credits per search`);
  } else if (entry.cost.mode === "per_page") {
    lines.push(`- Billing mode: Per Page`);
    lines.push(`- Cost: ${entry.cost.creditsPerPage} credits per page`);
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

  // Index page as a flat page (not inside a folder) — renders as a simple sidebar link
  files.push({
    type: "page",
    path: "search/search-catalog.mdx",
    data: {
      title: "Search Catalog",
      description: "Browse search functions",
      full: true,
      structuredData: { headings: [], contents: [] },
      _isVirtual: true,
      _virtualType: "search-catalog-index",
    },
  });

  // Individual search entry pages — placed in a hidden folder with explicit slugs
  // so their URLs remain /search-catalog/<baseSearch>/<version> but they don't
  // create a visible folder in the sidebar.
  for (const searchId of Object.keys(searchCatalog) as SearchId[]) {
    const entry = getSearchEntry(searchId);
    const baseSearch = entry.baseSearch;
    const version = getSearchVersion(searchId);

    const markdown = generateSearchMarkdown(searchId);
    const structuredData = generateSearchStructuredData(searchId);

    files.push({
      type: "page",
      path: `_search-entries/${baseSearch}/${version}.mdx`,
      slugs: ["search", "search-catalog", baseSearch, String(version)],
      data: {
        title: `${entry.label} (${searchId})`,
        description: entry.description,
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
