import {
  FormSection,
  GeneratedInputMeta,
  GeneratedInputMetaMap,
  inputGuards,
} from "@pipe0/base";

type StaticOption = { value: string; label?: string };

const FALLBACK_BY_PATH: Record<string, unknown> = {
  "config.filters.hq_locations": {
    include: ["United States", "Germany"],
    exclude: [],
  },
  "config.filters.crunchbase_categories": {
    include: ["Software", "Artificial Intelligence"],
    exclude: [],
  },
  "config.filters.crunchbase_investors": {
    include: ["Sequoia Capital", "Andreessen Horowitz"],
    exclude: [],
  },
  "config.filters.tracxn_investors": {
    include: ["Sequoia Capital"],
    exclude: [],
  },
  "config.filters.linkedin_industries": {
    include: ["Software Development"],
    exclude: [],
  },
  "config.filters.linkedin_categories": {
    include: ["Marketing"],
    exclude: [],
  },
  "config.filters.markets": {
    include: ["NYSE"],
    exclude: [],
  },
  "config.filters.competitor_websites": {
    include: ["openai.com"],
    exclude: [],
  },
  "config.filters.profile_summary_keywords": {
    include: ["B2B", "Software"],
    exclude: [],
  },
};

const FALLBACK_BY_CSV_BASENAME: Record<string, string[]> = {
  "regions.csv": ["United States", "Germany"],
  "categories.csv": ["Software", "Artificial Intelligence"],
  "investors.csv": ["Sequoia Capital", "Andreessen Horowitz"],
  "linkedin_industries.csv": ["Software Development"],
  "company_domains.csv": ["openai.com"],
};

function csvBasename(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const last = url.split("/").pop();
  return last && last.endsWith(".csv") ? last : undefined;
}

function pickStaticValues(
  options: readonly StaticOption[] | undefined,
  count: number,
): string[] {
  if (!options || options.length === 0) return [];
  return options.slice(0, count).map((o) => o.value);
}

function getOptionsDef(
  field: GeneratedInputMeta,
): { type: string; file?: string } | undefined {
  if (
    "optionsDef" in field &&
    field.optionsDef &&
    typeof field.optionsDef === "object"
  ) {
    return field.optionsDef as { type: string; file?: string };
  }
  return undefined;
}

function placeholderFor(
  field: GeneratedInputMeta,
  fallbackHint: string,
): string {
  const def = getOptionsDef(field);
  if (def?.type === "csv") {
    const file = csvBasename(def.file);
    return file ? `<see ${file}>` : `<${fallbackHint}>`;
  }
  if (def?.type === "provider") {
    return `<provider-resolved value>`;
  }
  return `<${fallbackHint}>`;
}

function deriveIncludeExcludeValues(field: GeneratedInputMeta): string[] {
  const direct = FALLBACK_BY_PATH[field.path];
  if (direct && typeof direct === "object" && "include" in (direct as object)) {
    return ((direct as { include: string[] }).include ?? []).slice(0, 2);
  }

  if ("options" in field && Array.isArray(field.options)) {
    return pickStaticValues(field.options as StaticOption[], 2);
  }

  const def = getOptionsDef(field);
  if (def?.type === "static") {
    const opts = (field as unknown as { optionsDef?: { options?: StaticOption[] } })
      .optionsDef?.options;
    if (Array.isArray(opts)) return pickStaticValues(opts, 2);
  }
  if (def?.type === "csv") {
    const file = csvBasename(def.file);
    if (file && FALLBACK_BY_CSV_BASENAME[file]) {
      return FALLBACK_BY_CSV_BASENAME[file];
    }
  }

  return [placeholderFor(field, "value")];
}

export function exampleValueForField(field: GeneratedInputMeta): unknown {
  const direct = FALLBACK_BY_PATH[field.path];
  if (direct !== undefined) return direct;

  if (
    inputGuards.include_exclude_input(field) ||
    inputGuards.include_exclude_select_input(field) ||
    inputGuards.async_include_exclude_select_input(field)
  ) {
    return { include: deriveIncludeExcludeValues(field), exclude: [] };
  }

  if (inputGuards.range_input(field)) {
    const f = field as GeneratedInputMetaMap["range_input"];
    return { from: f.min ?? 0, to: f.max ?? 100 };
  }

  if (inputGuards.exact_range_input(field)) {
    const f = field as GeneratedInputMetaMap["exact_range_input"];
    return { gt: f.min ?? 0, lt: f.max ?? 100 };
  }

  if (inputGuards.date_range_input(field)) {
    return {
      gt: "2024-01-01T00:00:00Z",
      lt: "2024-12-31T23:59:59Z",
    };
  }

  if (
    inputGuards.boolean_input(field) ||
    inputGuards.nullable_boolean_input(field)
  ) {
    return true;
  }

  if (inputGuards.text_input(field) || inputGuards.textarea_input(field)) {
    if ("placeholder" in field && field.placeholder) {
      return String(field.placeholder);
    }
    return placeholderFor(field, "text");
  }

  if (inputGuards.select_input(field)) {
    const opts = (field as GeneratedInputMetaMap["select_input"]).options;
    if (Array.isArray(opts) && opts.length > 0) {
      return (opts[0] as StaticOption).value;
    }
    return placeholderFor(field, "option");
  }

  if (inputGuards.multi_select_input(field)) {
    const opts = (field as GeneratedInputMetaMap["multi_select_input"]).options;
    if (Array.isArray(opts) && opts.length > 0) {
      return pickStaticValues(opts as StaticOption[], 2);
    }
    return [placeholderFor(field, "option")];
  }

  if (inputGuards.async_multi_select_input(field)) {
    return [placeholderFor(field, "option")];
  }

  if (inputGuards.ordered_multi_create_input(field) || inputGuards.multi_create_input(field)) {
    return [placeholderFor(field, "value")];
  }

  if (inputGuards.int_input(field) || inputGuards.number_input(field)) {
    const f = field as
      | GeneratedInputMetaMap["int_input"]
      | GeneratedInputMetaMap["number_input"];
    if (f.min !== undefined && f.min !== null) return f.min;
    return inputGuards.int_input(field) ? 10 : 1;
  }

  if (inputGuards.output_field_input(field)) {
    return { enabled: true, alias: "" };
  }

  if (inputGuards.json_extraction_input(field)) {
    return {
      extractions: [
        {
          path: "foo.bar",
          output_field: {
            name: "extracted_name",
            format: "text",
            label: "Extracted name",
            type: "string",
          },
        },
      ],
    };
  }

  if (inputGuards.json_schema_input(field)) {
    return {
      type: "object",
      properties: { foo: { type: "string" } },
      required: ["foo"],
    };
  }

  if (inputGuards.providers_input(field)) {
    return [{ provider: "value" }];
  }

  if (inputGuards.connector_input(field)) {
    return {
      strategy: "first",
      connections: [
        { type: "vault", connection: "provider_connection_id" },
      ],
    };
  }

  if (inputGuards.pipes_trigger_input(field)) {
    return {
      action: "run",
      when: {
        logic: "and",
        conditions: [
          {
            property: "value",
            field_name: "field_name",
            operator: "eq",
            value: "example",
          },
        ],
      },
    };
  }

  return placeholderFor(field, "value");
}

export function generateFieldExampleSnippet(
  field: GeneratedInputMeta,
): string {
  const pathParts = field.path.split(".");
  const key = pathParts[pathParts.length - 1];
  const value = exampleValueForField(field);
  const valueJson = JSON.stringify(value, null, 2)
    .split("\n")
    .map((line, idx) => (idx === 0 ? line : `  ${line}`))
    .join("\n");
  return `{\n  "${key}": ${valueJson}\n}`;
}

function setDeep(target: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split(".");
  let cursor: Record<string, unknown> = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (typeof cursor[k] !== "object" || cursor[k] === null) {
      cursor[k] = {};
    }
    cursor = cursor[k] as Record<string, unknown>;
  }
  cursor[parts[parts.length - 1]] = value;
}

export function buildPopulatedExample(
  formConfig: FormSection[],
  options: { includeOptional?: boolean } = {},
): Record<string, unknown> {
  const includeOptional = options.includeOptional ?? true;
  const out: Record<string, unknown> = {};

  for (const section of formConfig) {
    for (const group of section.groups) {
      for (const field of group.fields) {
        const required = "required" in field && field.required;
        if (!required && !includeOptional) continue;
        setDeep(out, field.path, exampleValueForField(field));
      }
    }
  }

  return out;
}

export function csvFilenameForField(
  field: GeneratedInputMeta,
): { file: string; url: string } | undefined {
  const def = getOptionsDef(field);
  if (def?.type !== "csv" || !def.file) return undefined;
  const file = csvBasename(def.file);
  if (!file) return undefined;
  return { file, url: def.file };
}

export function optionsDefSummary(
  field: GeneratedInputMeta,
):
  | { kind: "csv"; file: string; url: string }
  | { kind: "provider" }
  | { kind: "static"; count: number; options: { value: string; label?: string }[] }
  | undefined {
  const def = getOptionsDef(field);
  if (!def) return undefined;
  if (def.type === "csv") {
    const file = csvBasename(def.file);
    if (!file || !def.file) return undefined;
    return { kind: "csv", file, url: def.file };
  }
  if (def.type === "provider") return { kind: "provider" };
  if (def.type === "static") {
    const raw =
      (field as unknown as { optionsDef?: { options?: unknown[] } })
        .optionsDef?.options ?? [];
    const options = Array.isArray(raw)
      ? (raw as { value: string; label?: string }[])
      : [];
    return { kind: "static", count: options.length, options };
  }
  return undefined;
}
