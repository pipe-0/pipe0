import { Library } from "lucide-react";
import type { LoaderPlugin } from "fumadocs-core/source";
import type * as PageTree from "fumadocs-core/page-tree";

/**
 * Loader plugin that adds a Library icon to pipe and search catalog index pages
 * in the sidebar, similar to how openapiPlugin adds method badges.
 */
/**
 * Loader plugin that adds the virtual pipe/search entry pages to the page
 * tree. They live in hidden folders (`_pipe-entries`, `_search-entries`), so
 * without this the sidebar can't locate a detail page in the tree and falls
 * back to rendering every root folder as a plain collapsible.
 *
 * Entries are appended to the Documentation root (so detail pages get the
 * regular docs sidebar) and to their catalog root (so the sidebar tab dropdown
 * keeps the catalog selected). CatalogAwareSidebarItem hides them from view.
 */
export function catalogEntryTreePlugin(): LoaderPlugin {
  return {
    name: "catalog-entry-tree",
    transformPageTree: {
      root(root) {
        const entries: PageTree.Item[] = [];
        for (const path of this.storage.getFiles()) {
          const file = this.storage.read(path);
          if (!file || file.format !== "page") continue;
          const virtualType = (file.data as Record<string, unknown>)
            ._virtualType;
          if (virtualType !== "pipe-entry" && virtualType !== "search-entry")
            continue;
          entries.push({
            $id: `catalog-entry:${file.slugs.join("/")}`,
            type: "page",
            name: (file.data as { title?: string }).title ?? "",
            url: this.options.url(file.slugs, this.locale),
          });
        }
        if (entries.length === 0) return root;

        for (const node of root.children) {
          if (node.type !== "folder") continue;
          const folderPath = node.$ref?.folder;
          if (folderPath === "(docs)") {
            node.children.push(...entries);
          } else if (
            folderPath === "pipe-catalog" ||
            folderPath === "search-catalog"
          ) {
            node.children.push(
              ...entries.filter((e) =>
                e.url.startsWith(`/docs/${folderPath}/`),
              ),
            );
          }
        }
        return root;
      },
    },
  };
}

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
