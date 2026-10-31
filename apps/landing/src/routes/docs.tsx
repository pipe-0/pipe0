import { AskAiButton } from "@/components/ai/ask-ai-button";
import { CatalogAwareSidebarItem } from "@/components/features/docs/catalog-aware-sidebar-item";
import { LogoRawSmall } from "@/components/logo";
import { RootProvider } from "@/components/root-provider";
import { getDocsTree } from "@/lib/docs.functions";
import { preloadMono } from "@/lib/fonts";
import { baseOptions, linkItems } from "@/lib/layout.shared";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import "@pipe0/react/styles";

export const Route = createFileRoute("/docs")({
  loader: () => getDocsTree(),
  head: () => ({ links: [preloadMono] }),
  component: Layout,
});

function Layout() {
  const { pageTree } = useFumadocsLoader(Route.useLoaderData());
  const base = baseOptions();

  return (
    <RootProvider>
      <DocsLayout
        {...base}
        tree={pageTree}
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
        <Outlet />

        <AskAiButton />
      </DocsLayout>
    </RootProvider>
  );
}
