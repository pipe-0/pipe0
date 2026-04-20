import type { Source, VirtualFile } from "fumadocs-core/source";
import {
  getDefaultOutputFields,
  getDefaultPipeProviders,
  getField,
  getPipeDefaultPayload,
  getPipeEntry,
  getPipeVersion,
  pipeCatalog,
  PipeId,
  providerCatalog,
} from "@pipe0/elements";

interface PipeCatalogPageData {
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
  _virtualType: "pipe-catalog-index" | "pipe-entry";
  _pipeId?: string;
  _markdown?: string;
}

interface PipeCatalogMetaData {
  title: string;
  icon?: string;
  pages?: string[];
  defaultOpen?: boolean;
}

type PipeCatalogSource = Source<{
  pageData: PipeCatalogPageData;
  metaData: PipeCatalogMetaData;
}>;

function generatePipeMarkdown(pipeId: PipeId): string {
  const entry = getPipeEntry(pipeId);
  const lines: string[] = [];

  lines.push(`# ${entry.label} (${pipeId})`);
  lines.push("");
  lines.push(entry.description);
  lines.push("");

  // Input Fields
  if (
    entry.inputFieldMode === "static" &&
    entry.defaultInputGroups.length > 0
  ) {
    lines.push("## Input Fields");
    lines.push("");
    for (const group of entry.defaultInputGroups) {
      for (const fieldName of Object.keys(group.fields)) {
        const field = getField(fieldName as any);
        if (field) {
          lines.push(
            `- **${fieldName}** (${field.type}): ${field.description}`,
          );
        }
      }
    }
    lines.push("");
  }

  // Output Fields
  const outputFields = getDefaultOutputFields(entry);
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

  // Providers
  const providers = getDefaultPipeProviders(pipeId);
  if (providers.length > 0) {
    lines.push("## Providers");
    lines.push("");
    for (const providerName of providers) {
      const provider = providerCatalog[providerName];
      if (provider) {
        lines.push(`- **${provider.label}**: ${provider.description}`);
      }
    }
    lines.push("");
  }

  // Billable Operations
  const billableOps = Object.entries(entry.billableOperations);
  if (billableOps.length > 0) {
    lines.push("## Billing");
    lines.push("");
    for (const [opName, opDef] of billableOps) {
      const provider = (providerCatalog as any)[opDef.provider];
      lines.push(
        `- ${opName}: ${provider?.label || opDef.provider}, ${opDef.credits ?? 0} credits per operation (${opDef.mode})`,
      );
    }
    lines.push("");
  }

  // Code Example
  lines.push("## Code Example");
  lines.push("");
  lines.push("```bash");
  lines.push(`curl -X POST "https://api.pipe0.com/v1/pipes/run" \\`);
  lines.push(`  -H "Authorization: Bearer $API_KEY" \\`);
  lines.push(`  -H "Content-Type: application/json" \\`);
  lines.push(`  -d '{"pipes": [{"pipe_id": "${pipeId}"}], "input": []}'`);
  lines.push("```");
  lines.push("");

  // Default Config
  const defaultPayload = getPipeDefaultPayload(pipeId);
  lines.push("## Default Config");
  lines.push("");
  lines.push("```json");
  lines.push(
    JSON.stringify(
      {
        pipes: [
          {
            pipe_id: pipeId,
            config: defaultPayload,
          },
        ],
        input: [],
      },
      null,
      2,
    ),
  );
  lines.push("```");

  return lines.join("\n");
}

function generatePipeStructuredData(pipeId: PipeId) {
  const entry = getPipeEntry(pipeId);
  const headings: { id: string; content: string }[] = [];
  const contents: { heading: string; content: string }[] = [];

  headings.push({ id: "input-fields", content: "Input Fields" });
  headings.push({ id: "output-fields", content: "Output Fields" });
  headings.push({ id: "providers", content: "Providers" });
  headings.push({ id: "billing", content: "Billing" });

  // Add description as searchable content
  contents.push({
    heading: "",
    content: `${entry.label}. ${entry.description}`,
  });

  // Input fields
  if (entry.inputFieldMode === "static") {
    for (const group of entry.defaultInputGroups) {
      for (const fieldName of Object.keys(group.fields)) {
        const field = getField(fieldName as any);
        if (field) {
          contents.push({
            heading: "input-fields",
            content: `${fieldName}: ${field.description}`,
          });
        }
      }
    }
  }

  // Output fields
  const outputFields = getDefaultOutputFields(entry);
  for (const fieldName of outputFields) {
    const field = getField(fieldName as any);
    if (field) {
      contents.push({
        heading: "output-fields",
        content: `${fieldName}: ${field.description}`,
      });
    }
  }

  // Providers
  const providers = getDefaultPipeProviders(pipeId);
  for (const providerName of providers) {
    const provider = providerCatalog[providerName];
    if (provider) {
      contents.push({
        heading: "providers",
        content: `${provider.label}: ${provider.description}`,
      });
    }
  }

  return { headings, contents };
}

export function createPipeCatalogSource(): PipeCatalogSource {
  const files: VirtualFile<{
    pageData: PipeCatalogPageData;
    metaData: PipeCatalogMetaData;
  }>[] = [];

  // Index page as a flat page (not inside a folder) — renders as a simple sidebar link
  files.push({
    type: "page",
    path: "pipes/pipes-catalog.mdx",
    data: {
      title: "Pipe Catalog",
      description: "Browse enrichment pipes",
      full: true,
      structuredData: { headings: [], contents: [] },
      _isVirtual: true,
      _virtualType: "pipe-catalog-index",
    },
  });

  // Individual pipe entry pages — placed in a hidden folder with explicit slugs
  // so their URLs remain /pipe-catalog/<basePipe>/<version> but they don't
  // create a visible folder in the sidebar.
  for (const pipeId of Object.keys(pipeCatalog) as PipeId[]) {
    const entry = getPipeEntry(pipeId);
    const basePipe = entry.basePipe;
    const version = getPipeVersion(pipeId);

    const markdown = generatePipeMarkdown(pipeId);
    const structuredData = generatePipeStructuredData(pipeId);

    files.push({
      type: "page",
      path: `_pipe-entries/${basePipe}/${version}.mdx`,
      slugs: ["pipes", "pipes-catalog", basePipe, String(version)],
      data: {
        title: `${entry.label} (${pipeId})`,
        description: entry.description,
        full: true,
        structuredData,
        _isVirtual: true,
        _virtualType: "pipe-entry",
        _pipeId: pipeId,
        _markdown: markdown,
      },
    });
  }

  return { files };
}
