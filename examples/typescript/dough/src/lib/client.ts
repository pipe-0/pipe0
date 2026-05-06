import type { PipesEnvironment } from "@pipe0/base";
import { Pipe0 } from "@pipe0/client";

const PROXY_BASE_URL = "https://sandbox-proxy.pipe0.com";
export const API_BASE_URL = `${PROXY_BASE_URL}/v1`;
export const ENVIRONMENT: PipesEnvironment = "sandbox";

// Public token used by the form layer (matches the value baked into @pipe0/common).
export const PUBLIC_KEY = "pk_azohiyu4an9oa2nfgqbu8aax";

export const client = new Pipe0({ baseUrl: PROXY_BASE_URL });
