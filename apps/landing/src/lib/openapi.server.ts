import { createOpenAPI } from "fumadocs-openapi/server";

const OPENAPI_URL = "https://api.pipe0.com/openapi";

// fumadocs-openapi v11 resolves string inputs as file paths only, so remote
// schemas are fetched via a document factory. The key doubles as the schema id
// and must match the `document` prop in the generated API MDX pages.
export const openapi = createOpenAPI({
  input: {
    [OPENAPI_URL]: async () => {
      const res = await fetch(OPENAPI_URL);
      if (!res.ok) {
        throw new Error(`Failed to fetch OpenAPI schema: ${res.status}`);
      }
      return res.json();
    },
  },
});

type Preloaded = Awaited<
  ReturnType<typeof openapi.preloadOpenAPIPage>
>["preloaded"];
type OpenAPIDocument = Preloaded["docs"][string];

function collectRefs(node: unknown, out: Set<string>) {
  if (Array.isArray(node)) {
    for (const item of node) collectRefs(item, out);
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (key === "$ref" && typeof value === "string") out.add(value);
      else collectRefs(value, out);
    }
  }
}

/**
 * Narrows a preloaded document to the operations one page renders, plus the
 * components they reach through `$ref`. The client <APIPage> receives the
 * whole document as a prop, so without this every API page (and every RSC
 * prefetch of one) ships the full ~1 MB spec.
 */
export function trimPreloaded(
  preloaded: Preloaded,
  document: string,
  operations: { path: string; method: string }[] = [],
): Preloaded {
  const doc = preloaded.docs[document] as Record<string, any> | undefined;
  if (!doc) return preloaded;

  const paths: Record<string, Record<string, unknown>> = {};
  for (const { path, method } of operations) {
    const item = doc.paths?.[path];
    const op = item?.[method];
    if (!op) continue;
    // Path-level keys (parameters, servers, summary) apply to every method.
    const shared = Object.fromEntries(
      Object.entries(item).filter(
        ([key]) =>
          !["get", "put", "post", "delete", "options", "head", "patch", "trace"]
            .includes(key),
      ),
    );
    paths[path] = { ...shared, ...paths[path], [method]: op };
  }

  // Walk `$ref`s transitively. Only local "#/components/<kind>/<name>"
  // pointers occur in a bundled document.
  const kept = new Set<string>();
  const pending = new Set<string>();
  collectRefs(paths, pending);
  while (pending.size > 0) {
    const [ref] = pending;
    pending.delete(ref);
    if (kept.has(ref)) continue;
    kept.add(ref);
    const [, , kind, name] = ref.split("/");
    collectRefs(doc.components?.[kind]?.[name], pending);
  }

  const components: Record<string, Record<string, unknown>> = {};
  for (const ref of kept) {
    const [, , kind, name] = ref.split("/");
    const value = doc.components?.[kind]?.[name];
    if (value === undefined) continue;
    (components[kind] ??= {})[name] = value;
  }
  // Referenced by name from `security`, not by `$ref`.
  if (doc.components?.securitySchemes) {
    components.securitySchemes = doc.components.securitySchemes;
  }

  return {
    ...preloaded,
    docs: {
      ...preloaded.docs,
      [document]: {
        ...doc,
        paths,
        webhooks: undefined,
        components,
      } as OpenAPIDocument,
    },
  };
}
