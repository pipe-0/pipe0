import { Tabs, Tab } from "fumadocs-ui/components/tabs";
import { StaticCodeBlock } from "@/components/features/docs/static-code-block";

/**
 * A request example rendered in three flavours — pipe0 SDK, Python and cURL —
 * generated from a single request `payload`. Use it for self-contained,
 * single-request examples so the three tabs never drift out of sync.
 *
 * @example
 * export const payload = { pipes: [...], input: [...] };
 * <RequestExample kind="pipes" payload={payload} />
 */
type RequestKind = "pipes" | "search";

const SYNC_ENDPOINT: Record<RequestKind, string> = {
  pipes: "https://api.pipe0.com/v1/pipes/run/sync",
  search: "https://api.pipe0.com/v1/search/run/sync",
};

const SDK_METHOD: Record<RequestKind, string> = {
  pipes: "pipes.pipe",
  search: "searches.search",
};

const isIdentifier = (key: string) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);

function jsString(value: string): string {
  if (value.includes("\n")) {
    // Preserve multi-line templates ({{ … }} / {% … %}) as template literals.
    const escaped = value
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$\{/g, "\\${");
    return `\`${escaped}\``;
  }
  return JSON.stringify(value);
}

/** Serialize a value as an idiomatic JS object literal (unquoted keys). */
function toJsLiteral(value: unknown, pad = ""): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  if (typeof value === "string") return jsString(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const inner = value
      .map((item) => `${pad}  ${toJsLiteral(item, `${pad}  `)}`)
      .join(",\n");
    return `[\n${inner},\n${pad}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) return "{}";
  const inner = entries
    .map(([key, val]) => {
      const k = isIdentifier(key) ? key : JSON.stringify(key);
      return `${pad}  ${k}: ${toJsLiteral(val, `${pad}  `)}`;
    })
    .join(",\n");
  return `{\n${inner},\n${pad}}`;
}

function pyString(value: string): string {
  if (value.includes("\n")) {
    const escaped = value.replace(/\\/g, "\\\\").replace(/"""/g, '\\"\\"\\"');
    return `"""${escaped}"""`;
  }
  return JSON.stringify(value);
}

/** Serialize a value as a Python literal (dict / list / True / False / None). */
function toPython(value: unknown, pad = ""): string {
  if (value === null || value === undefined) return "None";
  if (typeof value === "boolean") return value ? "True" : "False";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return pyString(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const inner = value
      .map((item) => `${pad}    ${toPython(item, `${pad}    `)}`)
      .join(",\n");
    return `[\n${inner},\n${pad}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) return "{}";
  const inner = entries
    .map(([key, val]) => `${pad}    ${JSON.stringify(key)}: ${toPython(val, `${pad}    `)}`)
    .join(",\n");
  return `{\n${inner},\n${pad}}`;
}

/** JSON body, escaped so it can sit inside a single-quoted shell string. */
function toCurlBody(value: unknown): string {
  return JSON.stringify(value, null, 2).replace(/'/g, `'\\''`);
}

export function RequestExample({
  kind = "pipes",
  payload,
}: {
  kind?: RequestKind;
  payload: unknown;
}) {
  const url = SYNC_ENDPOINT[kind];
  const method = SDK_METHOD[kind];

  const sdk = [
    `import { Pipe0 } from "@pipe0/client";`,
    ``,
    `const pipe0 = new Pipe0({ apiKey: process.env.PIPE0_API_KEY });`,
    ``,
    `const result = await pipe0.${method}(${toJsLiteral(payload)});`,
    `console.log(result);`,
  ].join("\n");

  const python = [
    `import requests`,
    ``,
    `response = requests.post(`,
    `    "${url}",`,
    `    headers={"Authorization": f"Bearer {API_KEY}"},`,
    `    json=${toPython(payload, "    ")},`,
    `)`,
    `print(response.json())`,
  ].join("\n");

  const curl = [
    `curl -X POST "${url}" \\`,
    `  -H "Authorization: Bearer $API_KEY" \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -d '${toCurlBody(payload)}'`,
  ].join("\n");

  return (
    <Tabs items={["pipe0 SDK", "Python", "cURL"]}>
      <Tab value="pipe0 SDK">
        <StaticCodeBlock lang="typescript" code={sdk} />
      </Tab>
      <Tab value="Python">
        <StaticCodeBlock lang="python" code={python} />
      </Tab>
      <Tab value="cURL">
        <StaticCodeBlock lang="bash" code={curl} />
      </Tab>
    </Tabs>
  );
}

/**
 * A two-step search → enrich example. The whole point is that the **search
 * response feeds the pipe's `input`**, so each tab keeps that wiring explicit
 * (`search.results` in the SDK, `search["results"]` in Python, a piped
 * `$RESULTS` in cURL).
 *
 * @example
 * export const search = { search: { search_id: "...", config: {...} } };
 * export const enrich = { pipes: [{ pipe_id: "..." }] };
 * <SearchEnrichExample search={search} enrich={enrich} />
 */
export function SearchEnrichExample({
  search,
  enrich,
}: {
  search: unknown;
  enrich: { config?: unknown; pipes: unknown };
}) {
  const searchUrl = SYNC_ENDPOINT.search;
  const pipesUrl = SYNC_ENDPOINT.pipes;
  const { config: enrichConfig, pipes: enrichPipes } = enrich;
  const hasConfig = enrichConfig !== undefined;

  const sdk = [
    `import { Pipe0 } from "@pipe0/client";`,
    ``,
    `const pipe0 = new Pipe0({ apiKey: process.env.PIPE0_API_KEY });`,
    ``,
    `// 1. Search for records.`,
    `const search = await pipe0.searches.search(${toJsLiteral(search)});`,
    ``,
    `// 2. Feed the search results straight into the enrichment request.`,
    `const enriched = await pipe0.pipes.pipe({`,
    hasConfig ? `  config: ${toJsLiteral(enrichConfig, "  ")},` : null,
    `  pipes: ${toJsLiteral(enrichPipes, "  ")},`,
    `  input: search.results,`,
    `});`,
    `console.log(enriched);`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const python = [
    `import requests`,
    ``,
    `headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}`,
    ``,
    `# 1. Search for records.`,
    `search = requests.post(`,
    `    "${searchUrl}",`,
    `    headers=headers,`,
    `    json=${toPython(search, "    ")},`,
    `).json()`,
    ``,
    `# 2. Feed the search results straight into the enrichment request.`,
    `enriched = requests.post(`,
    `    "${pipesUrl}",`,
    `    headers=headers,`,
    `    json={`,
    hasConfig ? `        "config": ${toPython(enrichConfig, "        ")},` : null,
    `        "pipes": ${toPython(enrichPipes, "        ")},`,
    `        "input": search["results"],`,
    `    },`,
    `).json()`,
    `print(enriched)`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const enrichBody = hasConfig
    ? { config: enrichConfig, pipes: enrichPipes }
    : { pipes: enrichPipes };
  const curl = [
    `# 1. Search and capture the results array.`,
    `RESULTS=$(curl -s -X POST "${searchUrl}" \\`,
    `  -H "Authorization: Bearer $API_KEY" \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -d '${toCurlBody(search)}' | jq '.results')`,
    ``,
    `# 2. Enrich, feeding the search results in as the input array.`,
    `curl -X POST "${pipesUrl}" \\`,
    `  -H "Authorization: Bearer $API_KEY" \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -d "$(jq -n --argjson rows "$RESULTS" '${toCurlBody(enrichBody)} + { input: $rows }')"`,
  ].join("\n");

  return (
    <Tabs items={["pipe0 SDK", "Python", "cURL"]}>
      <Tab value="pipe0 SDK">
        <StaticCodeBlock lang="typescript" code={sdk} />
      </Tab>
      <Tab value="Python">
        <StaticCodeBlock lang="python" code={python} />
      </Tab>
      <Tab value="cURL">
        <StaticCodeBlock lang="bash" code={curl} />
      </Tab>
    </Tabs>
  );
}
