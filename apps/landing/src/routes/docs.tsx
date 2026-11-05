import { AskAiButton } from "@/components/ai/ask-ai-button";
import { CatalogAwareSidebarItem } from "@/components/features/docs/catalog-aware-sidebar-item";
import { useDocsNavigation } from "@/components/features/docs/docs-navigation";
import { LogoRawSmall } from "@/components/logo";
import { getDocsTree } from "@/lib/docs.functions";
import { preloadMono } from "@/lib/fonts";
import { baseOptions, linkItems } from "@/lib/layout.shared";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

export const Route = createFileRoute("/docs")({
  loader: () => getDocsTree(),
  head: () => ({ links: [preloadMono] }),
  component: Layout,
});

function Layout() {
  const { pageTree } = useFumadocsLoader(Route.useLoaderData());
  const { tree, tabs } = useDocsNavigation(pageTree);
  const base = baseOptions();

  return (
    <DocsLayout
      {...base}
      tree={tree}
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
      tabs={tabs}
      sidebar={{
        defaultOpenLevel: 1,
        components: {
          Item: CatalogAwareSidebarItem,
        },
      }}
    >
      <Outlet />

      <AskAiButton />
    </DocsLayout>
  );
}
