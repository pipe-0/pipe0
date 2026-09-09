import type { Source, VirtualFile } from "fumadocs-core/source";
import {
  getDefaultOutputFields,
  getField,
  getPipeDefaultPayload,
  getPipeEntry,
  getPipeVersion,
  pipeCatalog,
  PipeId,
  providerCatalog,
  requirementToInputFields,
} from "@pipe0/base";
import {
  effectiveCredits,
  isPlatformPaid,
} from "@/lib/pricing/effective-credits";
import {
  getPipeProvidersInWaterfallOrder,
  sortByWaterfallOrder,
} from "@/lib/pipes/provider-order";

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
  description?: string;
  icon?: string;
  pages?: string[];
  defaultOpen?: boolean;
  root?: boolean;
}

type PipeCatalogSource = Source<{
  pageData: PipeCatalogPageData;
  metaData: PipeCatalogMetaData;
}>;

/**
 * The deprecation facts an agent must see before anything else. The HTML page
 * renders an alert from the same `lifecycle`; the markdown (llms-full.txt, the
 * `.mdx` route, the llms.txt index line) is the only copy agents read.
 */
function getPipeDeprecation(entry: ReturnType<typeof getPipeEntry>) {
  const deprecatedOn = entry.lifecycle?.deprecatedOn;
  if (!deprecatedOn) return null;
  const replacedBy = entry.lifecycle?.replacedBy ?? null;
  const successor = replacedBy
    ? `Use ${replacedBy} instead: https://pipe0.com${getPipeEntry(replacedBy).docPath}`
    : "It has no direct replacement";
  return {
    deprecatedOn,
    replacedBy,
    summary: `Deprecated since ${deprecatedOn}. ${successor}.`,
    notice: `**Deprecated since ${deprecatedOn}. Do not use this pipe in new work.** ${successor}. It keeps running only for sheets and integrations that already use it and can be removed without notice.`,
  };
}

function generatePipeMarkdown(pipeId: PipeId): string {
  const entry = getPipeEntry(pipeId);
  const lines: string[] = [];

  lines.push(`# ${entry.label} (${pipeId})`);
  lines.push("");
  const deprecation = getPipeDeprecation(entry);
  if (deprecation) {
    lines.push(`> ${deprecation.notice}`);
    lines.push("");
  }
  lines.push(entry.description);
  lines.push("");

  const inputFields = entry.defaultInputRequirement
    ? requirementToInputFields(entry.defaultInputRequirement)
    : [];

  // Input Fields
  if (entry.inputFieldMode === "static" && inputFields.length > 0) {
    lines.push("## Input Fields");
    lines.push("");
    for (const inputField of inputFields) {
      const field = getField(inputField.resolvedName as any);
      if (field) {
        lines.push(
          `- **${inputField.resolvedName}** (${field.type}): ${field.description}`,
        );
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
  const providers = getPipeProvidersInWaterfallOrder(pipeId);
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

  // Billable Operations — deprecated providers keep their billing
  // definitions for stored payloads but are never offered or billed.
  const billableOps = sortByWaterfallOrder(
    pipeId,
    Object.entries(entry.billableOperations).filter(
      ([, opDef]) =>
        !(entry.deprecatedProviders as readonly string[]).includes(
          (opDef as { provider: string }).provider,
        ),
    ),
    ([, opDef]) => (opDef as { provider: string }).provider,
  );
  if (billableOps.length > 0) {
    lines.push("## Billing");
    lines.push("");
    for (const [opName, opDef] of billableOps) {
      const provider = (providerCatalog as any)[opDef.provider];
      // `credits` is a tier OBJECT (or null for BYO ops — platform-paid ones
      // carry their price in `userConnectionCredits` instead); read the
      // effective per-unit default, never interpolate the raw value.
      const perUnit = effectiveCredits(opDef)?.default;
      const platformPaidSuffix = isPlatformPaid(opDef)
        ? ", billed on your own connection"
        : "";
      lines.push(
        `- ${opName}: ${provider?.label || opDef.provider}, ${perUnit ?? 0} credits per operation (${opDef.mode})${platformPaidSuffix}`,
      );
    }
    lines.push("");
  }

  // A deprecated pipe gets no runnable example: an agent that skims to the
  // code block would copy the very id the notice tells it not to use.
  if (deprecation) {
    lines.push("## Code Example");
    lines.push("");
    lines.push(
      deprecation.replacedBy
        ? `Not provided for a deprecated pipe. See the ${deprecation.replacedBy} page for a current example.`
        : "Not provided for a deprecated pipe.",
    );
    return lines.join("\n");
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

  // Add description as searchable content; a deprecated pipe says so first,
  // which is what lets Ask AI confirm a pipe's lifecycle before naming it.
  const deprecation = getPipeDeprecation(entry);
  if (deprecation) {
    contents.push({ heading: "", content: `${entry.label} (${pipeId}). ${deprecation.summary}` });
  }
  contents.push({
    heading: "",
    content: `${entry.label}. ${entry.description}`,
  });

  // Input fields
  if (entry.inputFieldMode === "static" && entry.defaultInputRequirement) {
    for (const inputField of requirementToInputFields(
      entry.defaultInputRequirement,
    )) {
      const field = getField(inputField.resolvedName as any);
      if (field) {
        contents.push({
          heading: "input-fields",
          content: `${inputField.resolvedName}: ${field.description}`,
        });
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
  const providers = getPipeProvidersInWaterfallOrder(pipeId);
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

  // Root meta — makes Pipe Catalog its own dropdown panel in the sidebar.
  files.push({
    type: "meta",
    path: "pipe-catalog/meta.json",
    data: {
      title: "Pipe Catalog",
      root: true,
      description: "Browse enrichment pipes",
      icon: "Library",
    },
  });

  // Index page — rendered by PipeCatalogIndexPage via the _virtualType branch.
  files.push({
    type: "page",
    path: "pipe-catalog/index.mdx",
    data: {
      title: "Pipe Catalog",
      description: "Browse enrichment pipes",
      full: true,
      structuredData: { headings: [], contents: [] },
      _isVirtual: true,
      _virtualType: "pipe-catalog-index",
    },
  });

  // Individual pipe entry pages — hidden folder with explicit slugs so URLs
  // are /pipe-catalog/<basePipe>/<version> without exposing the folder.
  for (const pipeId of Object.keys(pipeCatalog) as PipeId[]) {
    const entry = getPipeEntry(pipeId);
    const basePipe = entry.basePipe;
    const version = getPipeVersion(pipeId);

    const markdown = generatePipeMarkdown(pipeId);
    const structuredData = generatePipeStructuredData(pipeId);
    const deprecation = getPipeDeprecation(entry);

    files.push({
      type: "page",
      path: `_pipe-entries/${basePipe}/${version}.mdx`,
      slugs: ["pipe-catalog", basePipe, String(version)],
      data: {
        title: `${entry.label} (${pipeId})`,
        description: deprecation
          ? `${deprecation.summary} ${entry.description}`
          : entry.description,
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
