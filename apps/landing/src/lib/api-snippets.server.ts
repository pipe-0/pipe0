import {
  getPipeEntry,
  getSearchEntry,
  pipesSnippetCatalog,
  searchSnippetCatalog,
  type PipeId,
  type SearchId,
} from "@pipe0/base";
import oasToSnippet from "@readme/oas-to-snippet";
import type { SupportedTargets } from "@readme/oas-to-snippet/languages";
import type Oas from "oas";
import type { Operation } from "oas/operation";
import type { DataForHAR } from "oas/types";
import { pipesMiniSpec } from "./pipes/snippet-catalog.server";
import { searchMiniSpec } from "./search/snippet-catalog.server";

const LANGUAGES: SupportedTargets[] = [
  "javascript",
  "python",
  "shell",
  "go",
  "php",
  "http",
];

export type CodeExample = { language: string; code: string };

/** Static per catalog entry, so they are generated once, at prerender. */
function codeExamples(
  oas: Oas,
  operation: Operation,
  harData: DataForHAR,
): CodeExample[] {
  return LANGUAGES.map((language) => {
    const { code } = oasToSnippet(
      oas,
      operation,
      harData,
      { bearerAuth: "<TOKEN>" },
      language,
    );
    return { language, code: String(code) };
  });
}

// Curated snippets pin config.environment, but production is already the
// API default; strip it so the rendered code examples stay minimal.
function toCodeExampleBody({
  config,
  ...rest
}: {
  config?: object;
  [key: string]: unknown;
}) {
  const cleanConfig: Record<string, unknown> = { ...config };
  delete cleanConfig.environment;
  return Object.keys(cleanConfig).length > 0
    ? { ...rest, config: cleanConfig }
    : rest;
}

// A deprecated entry gets no examples: a copyable snippet is what agents and
// people reuse, and it would carry the deprecated id.

export function pipeCodeExamples(pipeId: PipeId) {
  const request = pipesSnippetCatalog[pipeId]?.[0];
  if (!request || getPipeEntry(pipeId).lifecycle?.deprecatedOn) return [];
  return codeExamples(
    pipesMiniSpec,
    pipesMiniSpec.operation("/v1/pipes/run", "post"),
    { body: toCodeExampleBody(request) },
  );
}

export function searchCodeExamples(searchId: SearchId) {
  if (getSearchEntry(searchId).lifecycle?.deprecatedOn) return [];
  return codeExamples(
    searchMiniSpec,
    searchMiniSpec.operation("/v1/search/run", "post"),
    { body: { search: searchSnippetCatalog[searchId]?.[0] } },
  );
}
