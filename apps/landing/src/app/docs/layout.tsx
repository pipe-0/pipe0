import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import { baseOptions, linkItems } from "@/lib/layout.shared";
import { LogoRawSmall } from "@/components/logo";
import { CatalogAwareSidebarItem } from "@/components/features/docs/catalog-aware-sidebar-item";
import { AskAiButton } from "@/components/ai/ask-ai-button";

export default function Layout({
  children,
}: LayoutProps<"/docs">) {
  const base = baseOptions();

  return (
    <RootProvider>
    <DocsLayout
      {...base}
      tree={source.getPageTree()}
      links={linkItems.filter((item) => item.type === "icon")}
      nav={{
        ...base.nav,
        title: (
          <span className="inline-flex items-center gap-2">
            <LogoRawSmall />
            <span>Pipe0</span>
          </span>
        ),
      }}
      containerProps={{ className: "docs-layout-container" }}
      sidebar={{
        defaultOpenLevel: 1,
        components: {
          Item: CatalogAwareSidebarItem,
        },
        tabs: {
          transform(option, node) {
            if (!node.icon) return option;

            return {
              ...option,
              // Flat hover in the dropdown rows — no gradient wash.
              props: { className: "tabs-dd-item" },
              icon: (
                <div className="[&_svg]:size-full card-sky-sm flex size-full items-center justify-center rounded-lg border border-white/15 p-1.5 text-white shadow-sm">
                  {node.icon}
                </div>
              ),
            };
          },
        },
      }}
    >
      {children}

      <AskAiButton />
    </DocsLayout>
    </RootProvider>
  );
}
