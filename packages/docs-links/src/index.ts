export const BASE_URL = "https://pipe0.com";

export const docsLinkPaths = {
  // Core concepts
  docs: `/docs/`,
  pipeConfig: `/docs/request-payload#pipeconfig`,
  inputSanitation: `/docs/input-sanitation`,
  fieldStatus: `/docs/response-object#status`,
  templateTags: `/docs/pipe-concepts#template-tags`,
  fieldMode: `/docs/pipe-concepts#field-mode`,
  outputFieldToggle: `/docs/pipe-concepts#disable-static-pipe-outputs`,
  fieldModeConfig: `/docs/pipe-concepts#field-mode-config`,
  openAPI: `/docs/requests#openapi-31`,
  catalogs: `/docs/catalogs`,
  async: `/docs/requests#sync-or-async`,
  sync: `/docs/requests#sync-or-async`,
  waterfallPipes: `/docs/pipe-concepts#waterfall-pipes`,
  globalErrors: `/docs/response-object#errors`,
  records: `/docs/response-object#records`,
  pipeline: `/docs/pipe-concepts#pipeline`,

  // Input / Output
  inputExpansion: `/docs/pipes-inputs#input-expansion`,
  inputObject: `/docs/request-payload#input`,
  inputField: `/docs/request-payload#inputfieldname`,
  outputField: `/docs/response-object#recordfields`,

  // Connections & Auth
  connections: `/docs/connections`,
  authentication: `/docs/authentication`,

  // Configuration
  widgets: `/docs/pipes-request-payload#-configwidgetsenabled`,
  fieldDefinitions: `/docs/pipes-request-payload#-configfield_definitionsenabled`,

  // Pipes
  pipe: `/docs/request-payload#pipes`,
  testMode: `/docs/requests#sandbox`,
  pipesQuickstart: `/docs/quickstart`,
  pipelineRequest: `/docs/request-payload`,
  pipelineResponse: `/docs/response-object`,
  pipeCatalog: `/docs/pipes/pipes-catalog`,
  record: `/docs/response-object#bing-your-own-connections`,

  // Searches
  searchesQuickstart: `/docs/searches-quickstart`,
  searchCatalog: `/docs/searches/searches-catalog`,

  // Billing
  billing: `/docs/billing`,
  billingMode: `/docs/billing#billing-mode`,
  searchBilling: `/docs/billing#search-billing`,
} as const;

export type DocsLinkKey = keyof typeof docsLinkPaths;

/**
 * Get a full documentation URL (with base URL).
 */
export function getDocsUrl(key: DocsLinkKey): string {
  return `${BASE_URL}${docsLinkPaths[key]}`;
}
