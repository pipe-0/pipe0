import { docsLinkPaths, type DocsLinkKey } from "@pipe0/doc-links";

/** A doc-links entry as Link props: `to` takes a path, the hash goes separately. */
export function docLink(key: DocsLinkKey) {
  const [to, hash] = docsLinkPaths[key].split("#") as [string, string?];
  return { to, hash };
}
