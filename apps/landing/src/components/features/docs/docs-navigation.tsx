import type * as PageTree from "fumadocs-core/page-tree";
import { getLayoutTabs, type LayoutTab } from "fumadocs-ui/layouts/shared";
import { useMatch } from "@tanstack/react-router";
import { useMemo } from "react";

const CATALOGS = new Set(["/docs/pipe-catalog", "/docs/search-catalog"]);

function toTab(option: LayoutTab, node: PageTree.Folder): LayoutTab {
  // A tab bound to its folder is active on the pages listed there. A catalog
  // lists its index only, so it matches on the URL prefix instead.
  const tab = CATALOGS.has(option.url)
    ? { ...option, $folder: undefined }
    : option;
  if (!node.icon) return tab;

  return {
    ...tab,
    // Flat hover in the dropdown rows — no gradient wash.
    props: { className: "tabs-dd-item" },
    icon: (
      <div className="btn-glossy flex size-full items-center justify-center rounded-[7px] border text-white [&_svg]:size-4">
        {node.icon}
      </div>
    ),
  };
}

/**
 * The sidebar picks its section by finding the URL in the page tree. Catalog
 * entries are not in the tree, which lists none of the hundreds of them, so
 * their pages name the section: the Documentation sidebar, with the catalog
 * selected in the tab dropdown.
 */
export function useDocsNavigation(pageTree: PageTree.Root) {
  const pipeEntry = useMatch({
    from: "/docs/pipe-catalog/$",
    shouldThrow: false,
  });
  const searchEntry = useMatch({
    from: "/docs/search-catalog/$",
    shouldThrow: false,
  });
  const isCatalogEntry = Boolean(pipeEntry ?? searchEntry);

  return useMemo(() => {
    const documentation = pageTree.children[0] as PageTree.Folder;
    return {
      tree: isCatalogEntry
        ? ({ ...documentation, type: "root" } as PageTree.Root)
        : pageTree,
      tabs: getLayoutTabs(pageTree, { transform: toTab }),
    };
  }, [pageTree, isCatalogEntry]);
}
