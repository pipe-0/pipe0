export const BASE_URL = "https://pipe0.com";

export const docsLinkPaths = {
  // Core concepts
  docs: `/docs/`,
  pipeConfig: `/docs/pipes/request-payload#config`,
  inputSanitation: `/docs/pipes/inputs#input-sanitation`,
  fieldStatus: `/docs/pipes/response-object#status`,
  templateTags: `/docs/pipes/templates#tag-syntax`,
  fieldMode: `/docs/pipes/concepts#field-mode`,
  outputFieldToggle: `/docs/pipes/concepts#disable-outputs`,
  fieldModeConfig: `/docs/pipes/concepts#field-mode-config`,
  openAPI: `/docs/api#openapi-specification`,
  catalogs: `/docs/`,
  mcp: "/docs/sdks/mcp",
  async: `/docs/concepts#sync-vs-async`,
  sync: `/docs/concepts#sync-vs-async`,
  waterfallPipes: `/docs/pipes/concepts#waterfall-pipes`,
  globalErrors: `/docs/pipes/response-object#errors`,
  records: `/docs/pipes/response-object#records`,
  pipeline: `/docs/pipes/run-if`,

  // Input / Output
  inputExpansion: `/docs/pipes/inputs#input-expansion`,
  inputObject: `/docs/pipes/request-payload#input`,
  inputField: `/docs/pipes/request-payload#inputfieldname`,
  outputField: `/docs/pipes/response-object#recordfields`,

  // Connections & Auth
  connections: `/docs/connections`,
  authentication: `/docs/authentication`,

  // Configuration
  widgets: `/docs/pipes/request-payload#configwidgetsenabled`,
  fieldDefinitions: `/docs/pipes/request-payload#configfield_definitionsenabled`,

  // Pipes
  pipe: `/docs/pipes/request-payload#pipes`,
  testMode: `/docs/concepts#sandbox-and-production`,
  pipesQuickstart: `/docs/pipes`,
  pipelineRequest: `/docs/pipes/request-payload`,
  pipelineResponse: `/docs/pipes/response-object`,
  pipeCatalog: `/docs/pipe-catalog`,
  record: `/docs/pipes/response-object#records`,

  // Search
  searchCatalog: `/docs/search-catalog`,
  pagination: `/docs/search/pagination`,

  // Billing
  billing: `/docs/billing`,
  billingMode: `/docs/billing#billing-mode`,
  searchBilling: `/docs/billing#search-billing`,
  highUsageBilling: `/docs/billing#high-usage-billing`,

  // SDKs
  elementsReact: `/docs/sdks/form-ui`,

  // API endpoints
  apiReference: '/docs/api',
} as const;

export type DocsLinkKey = keyof typeof docsLinkPaths;

/**
 * Get a full documentation URL (with base URL).
 */
export function getDocsUrl(key: DocsLinkKey): string {
  return `${BASE_URL}${docsLinkPaths[key]}`;
}
