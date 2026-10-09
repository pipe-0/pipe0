import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "@/components/root-provider";
import { baseOptions, linkItems } from "@/lib/layout.shared";
import { LogoRawSmall } from "@/components/logo";
import { CatalogAwareSidebarItem } from "@/components/features/docs/catalog-aware-sidebar-item";
import { AskAiButton } from "@/components/ai/ask-ai-button";
import type * as PageTree from "fumadocs-core/page-tree";

/**
 * The tree is serialized into every docs page and every RSC prefetch, and it
 * holds ~530 pages, catalog entries included. Page descriptions, `$ref` source
 * paths and page `$id`s are never read on the client: the sidebar shows names
 * and keys items by position, and the page footer that would show
 * descriptions is disabled. Folder descriptions stay; the tab dropdown
 * renders them.
 */
function slimTree<T extends PageTree.Root | PageTree.Folder>(node: T): T {
  const { $ref: _ref, ...rest } = node as T & { $ref?: unknown };
  const out = {
    ...rest,
    children: node.children.map((child) =>
      child.type === "folder"
        ? slimTree(child)
        : child.type === "page"
          ? slimPage(child)
          : child,
    ),
  } as PageTree.Root | PageTree.Folder;
  if (out.type === "folder" && out.index) out.index = slimPage(out.index);
  if (out.type === "root" && out.fallback) out.fallback = slimTree(out.fallback);
  return out as T;
}

function slimPage(item: PageTree.Item): PageTree.Item {
  // Catalog entries are only in the tree so the sidebar can resolve its root
  // on detail pages (see catalogEntryTreePlugin); they never render, so the
  // URL is all they need. They are ~470 of the ~530 pages.
  if (item.$id?.startsWith("catalog-entry:")) {
    return { type: "page", name: "", url: item.url };
  }
  const {
    description: _description,
    $ref: _ref,
    $id: _id,
    ...rest
  } = item as PageTree.Item & { $ref?: unknown };
  return rest;
}

export default function Layout({
  children,
}: LayoutProps<"/docs">) {
  const base = baseOptions();

  return (
    <RootProvider>
    <DocsLayout
      {...base}
      tree={slimTree(source.getPageTree())}
      links={linkItems.filter((item) => item.type === "icon")}
      nav={{
        ...base.nav,
        title: (
          <span className="inline-flex items-center gap-2">
            <LogoRawSmall />
            <span className="font-medium">pipe0</span>
          </span>
        ),
      }}
      containerProps={{ className: "docs-layout-container" }}
      tabs={{
        transform(option, node) {
          if (!node.icon) return option;

          return {
            ...option,
            // Flat hover in the dropdown rows — no gradient wash.
            props: { className: "tabs-dd-item" },
            icon: (
              <div className="btn-glossy flex size-full items-center justify-center rounded-[7px] border text-white [&_svg]:size-4">
                {node.icon}
              </div>
            ),
          };
        },
      }}
      sidebar={{
        defaultOpenLevel: 1,
        components: {
          Item: CatalogAwareSidebarItem,
        },
      }}
    >
      {children}

      <AskAiButton />
    </DocsLayout>
    </RootProvider>
  );
}
