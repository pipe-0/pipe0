export const BASE_URL = "https://pipe0.com";

export const docsLinkPaths = {
  // Core concepts
  docs: `/docs/`,
  pipeConfig: `/docs/pipes/advanced/pipes-request-payload#config`,
  inputSanitation: `/docs/pipes/advanced/pipes-inputs#input-sanitation`,
  fieldStatus: `/docs/pipes/advanced/pipes-response-object#status`,
  templateTags: `/docs/pipes/advanced/pipes-concepts#tag-syntax`,
  fieldMode: `/docs/pipes/advanced/pipes-concepts#field-mode`,
  outputFieldToggle: `/docs/pipes/advanced/pipes-concepts#disable-outputs`,
  fieldModeConfig: `/docs/pipes/advanced/pipes-concepts#field-mode-config`,
  openAPI: `/docs/api#openapi-specification`,
  catalogs: `/docs/`,
  mcp: "/docs/sdks/mcp",
  async: `/docs/pipes#getting-the-task-result`,
  sync: `/docs/pipes#getting-the-result-without-polling`,
  waterfallPipes: `/docs/pipes/advanced/pipes-concepts#waterfall-pipes`,
  globalErrors: `/docs/pipes/advanced/pipes-response-object#errors`,
  records: `/docs/pipes/advanced/pipes-response-object#records`,
  pipeline: `/docs/pipes/advanced/pipes-concepts#run-if`,

  // Input / Output
  inputExpansion: `/docs/pipes/advanced/pipes-inputs#input-expansion`,
  inputObject: `/docs/pipes/advanced/pipes-request-payload#input`,
  inputField: `/docs/pipes/advanced/pipes-request-payload#inputfieldname`,
  outputField: `/docs/pipes/advanced/pipes-response-object#recordfields`,

  // Connections & Auth
  connections: `/docs/connections`,
  authentication: `/docs/authentication`,

  // Configuration
  widgets: `/docs/pipes/advanced/pipes-request-payload#configwidgetsenabled`,
  fieldDefinitions: `/docs/pipes/advanced/pipes-request-payload#configfield_definitionsenabled`,

  // Pipes
  pipe: `/docs/pipes/advanced/pipes-request-payload#pipes`,
  testMode: `/docs/pipes/advanced/pipes-request-payload#configenvironment`,
  pipesQuickstart: `/docs/pipes`,
  pipelineRequest: `/docs/pipes/advanced/pipes-request-payload`,
  pipelineResponse: `/docs/pipes/advanced/pipes-response-object`,
  pipeCatalog: `/docs/pipe-catalog`,
  record: `/docs/pipes/advanced/pipes-response-object#records`,

  // Search
  searchCatalog: `/docs/search-catalog`,
  pagination: `/docs/search/advanced/pagination`,

  // Billing
  billing: `/docs/billing`,
  billingMode: `/docs/billing#billing-mode`,
  searchBilling: `/docs/billing#search-billing`,
  highUsageBilling: `/docs/billing#high-usage-billing`,

  // SDKs
  elementsReact: `/docs/sdks/form-ui`,

  // Examples
  dough: "/docs/pipes/examples/dough",

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
