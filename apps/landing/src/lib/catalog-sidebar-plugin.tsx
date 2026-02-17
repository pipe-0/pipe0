import { Library } from "lucide-react";
import type { LoaderPlugin } from "fumadocs-core/source";

/**
 * Loader plugin that adds a Library icon to pipe and search catalog index pages
 * in the sidebar, similar to how openapiPlugin adds method badges.
 */
export function catalogIconPlugin(): LoaderPlugin {
  return {
    name: "catalog-icons",
    transformPageTree: {
      file(node, filePath) {
        if (!filePath) return node;
        const file = this.storage.read(filePath);
        if (!file || file.format !== "page") return node;

        const virtualType = (file.data as Record<string, unknown>)
          ._virtualType;
        if (
          virtualType === "pipe-catalog-index" ||
          virtualType === "search-catalog-index"
        ) {
          node.name = (
            <>
              {node.name}{" "}
              <Library className="ms-auto size-3.5 shrink-0 text-fd-muted-foreground" />
            </>
          );
        }

        return node;
      },
    },
  };
}
