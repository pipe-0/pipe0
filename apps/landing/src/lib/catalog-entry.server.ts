import {
  resolveCurrentPipe,
  resolveCurrentSearch,
} from "@/lib/catalog-lifecycle";
import {
  getPipeLowestPrice,
  getPipeStartingPrice,
} from "@/lib/pipes/get-pipe-starting-price";
import {
  getPipeProvidersInWaterfallOrder,
  sortByWaterfallOrder,
} from "@/lib/pipes/provider-order";
import { validateSnippet } from "@/lib/pipes/validate-snippet";
import { videoCatalog as pipeVideos } from "@/lib/pipes/video-catalog";
import { effectiveCredits } from "@/lib/pricing/effective-credits";
import {
  hasHighVolume,
  lowestManagedCredit,
} from "@/lib/pricing/high-volume";
import {
  isUsageMeteredSearch,
  USAGE_METERED_LABEL,
} from "@/lib/pricing/usage-metered";
import { providerTileColor } from "@/lib/provider-tile";
import { videoCatalog as searchVideos } from "@/lib/search/video-catalog";
import { formatCredits } from "@/lib/utils";
import {
  type BillableOperationDef,
  collectRequirementFields,
  type FieldName,
  getDefaultOutputFields,
  getDefaultSearchOutputFields,
  getField,
  getPipeDefaultPayload,
  getPipeEntry,
  getPipePayloadFormConfig,
  getSearchDefaultPayload,
  getSearchEntry,
  getSearchPayloadFormConfig,
  getSearchVersion,
  listTiers,
  type ManagedCredits,
  type PipeCategory,
  type PipeId,
  type PipeInputField,
  pipesSnippetCatalog,
  providerCatalog,
  type ProviderName,
  RECORD_FIELD_FORMATS,
  RECORD_FIELD_TYPES,
  type Requirement,
  RUN_IF_OPERATOR_LABELS,
  RUN_IF_VALUE_OPERATORS,
  searchCatalog,
  type SearchId,
  searchSnippetCatalog,
  sortPipeCatalogByBasePipe,
} from "@pipe0/base";

/*
 * What a catalog entry page renders. @pipe0/base runs here, at prerender, and
 * the page gets plain values: everything on these pages is static except the
 * Form UI preview, which loads the catalog itself when it is opened.
 */

function providerView(name: ProviderName | undefined) {
  const provider = name && providerCatalog[name];
  if (!provider) return undefined;
  return {
    label: provider.label,
    description: provider.description,
    logoUrl: provider.logoUrl,
    tileColor: providerTileColor(provider),
  };
}

function priceView(credits: ManagedCredits | null) {
  return (
    credits && {
      standard: credits.default,
      lowest: lowestManagedCredit(credits),
      highVolume: hasHighVolume(credits),
      tiers: listTiers(credits),
    }
  );
}

export type PriceView = ReturnType<typeof priceView>;

function operationRow([operation, def]: [string, BillableOperationDef]) {
  const provider = providerCatalog[def.provider];
  return {
    operation,
    provider: providerView(def.provider)!,
    billing:
      def.mode === "onSuccess"
        ? "On success"
        : def.mode === "always"
          ? "Always"
          : "n/a",
    connections: [
      ...(provider.hasManagedConnections ? ["Managed"] : []),
      ...(provider.allowsUserConnections ? ["User"] : []),
    ],
    note: def.note,
    price: priceView(effectiveCredits(def)),
  };
}

export type OperationRow = ReturnType<typeof operationRow>;

/** A catalog field as a row. Unknown names drop out. */
function fieldRow(name: string): FieldRowData[] {
  const field = getField(name as FieldName);
  if (!field) return [];
  return [
    {
      name: field.name,
      type: field.type,
      description: field.description,
      jsonExample: field.jsonMeta?.exampleValue,
    },
  ];
}

export type FieldRowData = {
  name: string;
  type: string;
  description: string;
  jsonExample?: unknown;
};

function outputGroups(names: string[], payload: { config?: object | null }) {
  const outputFields = (payload.config as { output_fields?: object })
    ?.output_fields as Record<string, { enabled?: boolean }> | undefined;
  const [enabled, optional] = [true, false].map((wanted) =>
    names
      .filter((name) => !!outputFields?.[name]?.enabled === wanted)
      .flatMap(fieldRow),
  );
  return { enabled: enabled!, optional: optional! };
}

/** Versions of an entry for the header's links. */
function versionLink(
  id: string,
  entry: { docPath: string; lifecycle?: { deprecatedOn?: string | null } | null },
) {
  return {
    displayValue: `@${id.split("@")[1]}`,
    link: entry.docPath,
    isDeprecated: !!entry.lifecycle?.deprecatedOn,
  };
}

/**
 * Snippets ship without connections. When an entry accepts user connections,
 * show a valid provider-prefixed vault string in the config reference instead
 * of an empty connector.
 */
function withExampleConnection<T extends object>(payload: T, provider: string) {
  const { connector } = payload as {
    connector?: { connections?: unknown[] } | null;
  };
  if (connector?.connections?.length) return payload;
  return {
    ...payload,
    connector: {
      strategy: "first",
      connections: [{ type: "vault", connection: `${provider}_abcd123` }],
    },
  };
}

/** Fixed vocabularies the config reference prints for some field types. */
const configVocabulary = () => ({
  formats: [...RECORD_FIELD_FORMATS] as string[],
  types: [...RECORD_FIELD_TYPES] as string[],
  conditionOperators: RUN_IF_VALUE_OPERATORS.map((symbol) => ({
    symbol: symbol as string,
    description: (RUN_IF_OPERATOR_LABELS[symbol] ?? symbol) as string,
  })),
});

export type ConfigVocabulary = ReturnType<typeof configVocabulary>;

function pipeFormConfig(
  payload: Parameters<typeof validateSnippet>[0] | undefined,
) {
  if (!payload) return null;
  try {
    return getPipePayloadFormConfig({
      pipePayload: payload,
      validationContext: validateSnippet(payload),
      store: { field_options: {} },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}

/** Input fields as the page groups them: required, one-of, optional. */
function inputGroups(requirement: Requirement | null) {
  if (!requirement) return [];
  const required: PipeInputField[] = [];
  const optional: PipeInputField[] = [];
  const atLeastOne: PipeInputField[][] = [];

  function visit(node: Requirement) {
    switch (node.kind) {
      case "field":
        required.push(node.field);
        break;
      case "optional":
        optional.push(node.field);
        break;
      case "all":
        node.of.forEach(visit);
        break;
      case "any":
        atLeastOne.push(
          collectRequirementFields(node).map(({ field }) => field),
        );
        break;
    }
  }
  visit(requirement);

  const rows = (fields: PipeInputField[]) =>
    fields.flatMap((field) => fieldRow(field.resolvedName));
  return [
    ...(required.length > 0
      ? [{ condition: "all" as const, fields: rows(required) }]
      : []),
    ...atLeastOne.map((fields) => ({
      condition: "atLeastOne" as const,
      fields: rows(fields),
    })),
    ...(optional.length > 0
      ? [{ condition: "none" as const, fields: rows(optional) }]
      : []),
  ];
}

export function pipeEntryData(pipeId: PipeId) {
  const entry = getPipeEntry(pipeId);
  const deprecatedOn = entry.lifecycle?.deprecatedOn;
  const successor = deprecatedOn ? resolveCurrentPipe(pipeId) : null;
  const snippet = pipesSnippetCatalog[pipeId]?.[0]?.pipes?.[0];
  const providers = getPipeProvidersInWaterfallOrder(pipeId);
  const exampleProvider = entry.allowedUserConnectionProviders?.[0];
  const formConfig = pipeFormConfig(snippet);
  const outputFields = getDefaultOutputFields(entry);
  const { lowest } = getPipeLowestPrice(pipeId);

  return {
    id: pipeId,
    label: entry.label,
    description: entry.description,
    provider: providerView(providers[0]),
    providerCount: providers.length,
    category: (entry.categories?.[0] ?? null) as PipeCategory | null,
    versions: (sortPipeCatalogByBasePipe()[entry.basePipe] ?? []).map((v) =>
      versionLink(v.pipeId, getPipeEntry(v.pipeId)),
    ),
    price: getPipeStartingPrice(pipeId)
      ? `from ${formatCredits(lowest)} cr / result`
      : "Free",
    notice: entry.notice,
    deprecatedOn,
    successor: successor && {
      id: successor,
      docPath: getPipeEntry(successor).docPath,
    },
    // Deprecated providers keep their billing definitions (stored payloads
    // still reference them) but are never offered or billed — hide them.
    operations: sortByWaterfallOrder(
      pipeId,
      Object.entries(entry.billableOperations).filter(
        ([, def]) =>
          !(entry.deprecatedProviders as readonly string[]).includes(
            (def as BillableOperationDef).provider,
          ),
      ),
      ([, def]) => (def as BillableOperationDef).provider,
    ).map((row) => operationRow(row as [string, BillableOperationDef])),
    inputs:
      entry.inputFieldMode === "static"
        ? {
            count: entry.defaultInputRequirement
              ? collectRequirementFields(entry.defaultInputRequirement).length
              : 0,
            groups: inputGroups(entry.defaultInputRequirement),
          }
        : null,
    outputs:
      entry.outputFieldMode === "static"
        ? {
            count: outputFields.length,
            ...outputGroups(outputFields, entry.defaultPayload),
          }
        : null,
    video: pipeVideos[pipeId as keyof typeof pipeVideos] as string | undefined,
    formConfig,
    configFieldCount: formConfig?.flatMap((section) =>
      section.groups.flatMap((group) => group.fields),
    ).length,
    // The curated snippet payload doubles as the source of example values in
    // the config reference.
    examplePayload:
      snippet && exampleProvider
        ? withExampleConnection(snippet, exampleProvider)
        : snippet,
    defaultPayload: getPipeDefaultPayload(pipeId),
    vocabulary: configVocabulary(),
  };
}

export type PipeEntryData = ReturnType<typeof pipeEntryData>;

export function searchEntryData(searchId: SearchId) {
  const entry = getSearchEntry(searchId);
  const deprecatedOn = entry.lifecycle?.deprecatedOn;
  const successor = deprecatedOn ? resolveCurrentSearch(searchId) : null;
  const defaultPayload = getSearchDefaultPayload(searchId);
  const snippet = searchSnippetCatalog[searchId]?.[0];

  // Usage-metered searches bill their own operations as they run, so the flat
  // `cost.credits` is 0 and is display metadata only. Everything price-shaped
  // branches on this rather than printing that 0 as a real price.
  const usageMetered = isUsageMeteredSearch(entry);
  const credits = effectiveCredits(entry.cost);
  const unit =
    entry.cost.mode === "per_result"
      ? "result"
      : entry.cost.mode === "per_search"
        ? "search"
        : "page";
  const billing = {
    result: "Per result",
    search: "Per search",
    page: "Per page",
  };

  const versions = Object.values(searchCatalog)
    .filter((other) => other.baseSearch === entry.baseSearch)
    .sort(
      (a, b) => getSearchVersion(b.searchId) - getSearchVersion(a.searchId),
    );

  let formConfig;
  try {
    formConfig = getSearchPayloadFormConfig({
      searchPayload: defaultPayload,
      formContext: { field_options: {} },
    });
  } catch {
    formConfig = undefined;
  }

  return {
    id: searchId,
    label: entry.label,
    description: entry.description,
    provider: providerView(entry.provider)!,
    versions: versions.map((v) =>
      versionLink(v.searchId, getSearchEntry(v.searchId)),
    ),
    price: usageMetered
      ? USAGE_METERED_LABEL
      : credits
        ? `from ${formatCredits(lowestManagedCredit(credits))} cr / ${unit}`
        : "Free",
    notice: entry.notice,
    deprecatedOn,
    successor: successor && {
      id: successor,
      docPath: getSearchEntry(successor).docPath,
    },
    billing: usageMetered ? "Usage" : billing[unit],
    connections: [
      ...(entry.hasManagedConnection ? ["Managed"] : []),
      ...(entry.allowsUserConnection ? ["User"] : []),
    ],
    cost: usageMetered ? null : priceView(credits),
    costLabel: usageMetered ? USAGE_METERED_LABEL : undefined,
    costNote: usageMetered
      ? entry.cost.info
      : entry.cost.mode === "per_page"
        ? "1 page = 100 records"
        : undefined,
    operations: usageMetered
      ? Object.entries(entry.billableOperations ?? {}).map((row) =>
          operationRow(row as [string, BillableOperationDef]),
        )
      : [],
    outputFieldMode: entry.outputFieldMode,
    outputs:
      entry.outputFieldMode === "config" || entry.outputFieldMode === "dynamic"
        ? { enabled: [], optional: [] }
        : outputGroups(getDefaultSearchOutputFields(searchId), defaultPayload),
    video: searchVideos[searchId as keyof typeof searchVideos] as
      | string
      | undefined,
    formConfig,
    // The curated snippet payload is the code example body and the source of
    // example values in the config reference.
    examplePayload:
      snippet && entry.allowsUserConnection
        ? withExampleConnection(snippet, entry.provider)
        : snippet,
    defaultPayload,
    vocabulary: configVocabulary(),
  };
}

export type SearchEntryData = ReturnType<typeof searchEntryData>;
