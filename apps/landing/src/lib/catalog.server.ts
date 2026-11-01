import { breadcrumbJsonLd, techArticleJsonLd } from "@/components/seo/json-ld";
import {
  pipeCodeExamples,
  searchCodeExamples,
} from "@/lib/api-snippets.server";
import { pipeEntryData, searchEntryData } from "@/lib/catalog-entry.server";
import {
  resolveCurrentPipe,
  resolveCurrentSearch,
} from "@/lib/catalog-lifecycle";
import type { DocsPageData } from "@/lib/docs.server";
import {
  getPipeProvidersInWaterfallOrder,
  sortByWaterfallOrder,
} from "@/lib/pipes/provider-order";
import {
  effectiveCredits,
  isPlatformPaid,
} from "@/lib/pricing/effective-credits";
import { isUsageMeteredSearch } from "@/lib/pricing/usage-metered";
import { docsImage } from "@/lib/source.server";
import {
  getDefaultOutputFields,
  getDefaultSearchOutputFields,
  getField,
  getPipeDefaultPayload,
  getPipeEntry,
  getSearchDefaultPayload,
  getSearchEntry,
  pipeCatalog,
  providerCatalog,
  requirementToInputFields,
  searchCatalog,
  type PipeId,
  type SearchId,
} from "@pipe0/base";

/**
 * One page per pipe and search. The catalog is data with its own routes, not
 * authored content, so it stays out of the Fumadocs source. Importing this
 * module loads @pipe0/base, which takes a Worker two seconds and costs the
 * isolate, so only prerendering and `import()` reach it.
 */
export type CatalogPage = {
  kind: "pipe" | "search";
  id: string;
  url: string;
  title: string;
  description: string;
  /** Search-result title and description, which differ from the on-page heading. */
  snippet: { title: string; description: string };
  /** The page as text, the only copy agents read. */
  markdown: string;
  deprecation: Deprecation | null;
};

type Deprecation = ReturnType<typeof describeDeprecation>;

/**
 * The facts an agent must see before anything else. The HTML page renders an
 * alert from the same `lifecycle`. `replacedBy` names the final current
 * successor, not the next hop, which may itself be deprecated.
 */
function describeDeprecation(
  kind: CatalogPage["kind"],
  deprecatedOn: string,
  replacedBy: string | null,
  replacedByPath: string | null,
) {
  const successor = replacedBy
    ? `Use ${replacedBy} instead: https://pipe0.com${replacedByPath}`
    : "It has no current replacement";
  return {
    replacedBy,
    replacedByPath,
    summary: `Deprecated since ${deprecatedOn}. ${successor}.`,
    notice: `**Deprecated since ${deprecatedOn}. Do not use this ${kind} in new work.** ${successor}. It keeps running only for sheets and integrations that already use it and can be removed without notice.`,
  };
}

function getPipeDeprecation(entry: ReturnType<typeof getPipeEntry>) {
  const deprecatedOn = entry.lifecycle?.deprecatedOn;
  if (!deprecatedOn) return null;
  const replacedBy = resolveCurrentPipe(entry.pipeId);
  return describeDeprecation(
    "pipe",
    deprecatedOn,
    replacedBy,
    replacedBy && getPipeEntry(replacedBy).docPath,
  );
}

function getSearchDeprecation(entry: ReturnType<typeof getSearchEntry>) {
  const deprecatedOn = entry.lifecycle?.deprecatedOn;
  if (!deprecatedOn) return null;
  const replacedBy = resolveCurrentSearch(entry.searchId);
  return describeDeprecation(
    "search",
    deprecatedOn,
    replacedBy,
    replacedBy && getSearchEntry(replacedBy).docPath,
  );
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
  if (entry.notice) {
    lines.push(`> ${entry.notice.text}`);
    lines.push("");
  }

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
        pipes: [defaultPayload],
        input: [],
      },
      null,
      2,
    ),
  );
  lines.push("```");

  return lines.join("\n");
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
  if (entry.notice) {
    lines.push(`> ${entry.notice.text}`);
    lines.push("");
  }

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
      lines.push(
        `  - \`${operation}\`: ${credits} credits${note ? ` — ${note}` : ""}`,
      );
    }
  } else if (entry.cost.mode === "per_result") {
    lines.push(`- Billing mode: Per Result`);
    lines.push(
      `- Cost: ${perUnit ?? 0} credits per result${platformPaidSuffix}`,
    );
  } else if (entry.cost.mode === "per_search") {
    lines.push(`- Billing mode: Per Search`);
    lines.push(
      `- Cost: ${perUnit ?? 0} credits per search${platformPaidSuffix}`,
    );
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
        search: defaultPayload,
      },
      null,
      2,
    ),
  );
  lines.push("```");

  return lines.join("\n");
}

/** Keep the entry description, move the id (and the product keywords) into the snippet tail. */
function withCatalogSuffix(description: string, suffix: string) {
  if (!description) return suffix;
  const trimmed =
    description.length > 110
      ? `${description.slice(0, 110).trimEnd()}...`
      : description;
  const sep = /[.!?]$/.test(trimmed) || trimmed.endsWith("...") ? " " : ". ";
  return `${trimmed}${sep}${suffix}`;
}

function deprecatedDescription(id: string, successor: string | null) {
  return successor
    ? `${id} is deprecated. Do not use it in new work; use ${successor} instead.`
    : `${id} is deprecated and has no current replacement. Do not use it in new work.`;
}

function pipePage(pipeId: PipeId): CatalogPage {
  const entry = getPipeEntry(pipeId);
  const deprecation = getPipeDeprecation(entry);
  const title = `${entry.label} (${pipeId})`;
  return {
    kind: "pipe",
    id: pipeId,
    url: entry.docPath,
    title,
    description: deprecation
      ? `${deprecation.summary} ${entry.description}`
      : entry.description,
    // Every version shares a label, so a deprecated page needs its id and
    // status in the title, and a description that names the replacement.
    snippet: deprecation
      ? {
          title: `${title} (deprecated)`,
          description: deprecatedDescription(pipeId, deprecation.replacedBy),
        }
      : {
          title: `${entry.label} pipe`,
          description: withCatalogSuffix(
            entry.description,
            `Run ${pipeId} via the pipe0 data enrichment API or in Sheets.`,
          ),
        },
    markdown: generatePipeMarkdown(pipeId),
    deprecation,
  };
}

function searchPage(searchId: SearchId): CatalogPage {
  const entry = getSearchEntry(searchId);
  const deprecation = getSearchDeprecation(entry);
  const title = `${entry.label} (${searchId})`;
  return {
    kind: "search",
    id: searchId,
    url: entry.docPath,
    title,
    description: deprecation
      ? `${deprecation.summary} ${entry.description}`
      : entry.description,
    snippet: deprecation
      ? {
          title: `${title} (deprecated)`,
          description: deprecatedDescription(searchId, deprecation.replacedBy),
        }
      : {
          title: entry.label,
          description: withCatalogSuffix(
            entry.description,
            `Run ${searchId} via the pipe0 data enrichment API or in Sheets.`,
          ),
        },
    markdown: generateSearchMarkdown(searchId),
    deprecation,
  };
}

export const catalogPages: CatalogPage[] = [
  ...(Object.keys(pipeCatalog) as PipeId[]).map(pipePage),
  ...(Object.keys(searchCatalog) as SearchId[]).map(searchPage),
];

export function catalogPage(slugs: string[]) {
  const url = `/docs/${slugs.join("/")}`;
  return catalogPages.find((page) => page.url === url);
}

/** A catalog entry's loader data. */
export function catalogDocsPage(slugs: string[]): DocsPageData | null {
  const page = catalogPage(slugs);
  if (!page) return null;
  return {
    url: page.url,
    path: page.url,
    title: page.title,
    snippet: page.snippet,
    image: docsImage(page.url),
    jsonLd: [
      breadcrumbJsonLd([
        { name: "Docs", url: "/docs" },
        { name: page.title, url: page.url },
      ]),
      techArticleJsonLd({
        title: page.title,
        description: page.description,
        url: page.url,
      }),
    ],
    ...(page.kind === "pipe"
      ? {
          pipe: pipeEntryData(page.id as PipeId),
          codeExamples: pipeCodeExamples(page.id as PipeId),
        }
      : {
          search: searchEntryData(page.id as SearchId),
          codeExamples: searchCodeExamples(page.id as SearchId),
        }),
  };
}
