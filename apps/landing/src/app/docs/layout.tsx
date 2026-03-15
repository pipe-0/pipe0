import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import { baseOptions, getSection, linkItems } from "@/lib/layout.shared";
import { LogoRawSmall } from "@/components/logo";

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
        tabs: {
          transform(option, node) {
            const meta = source.getNodeMeta(node);
            if (!meta || !node.icon) return option;
            const color = `var(--${getSection(meta.path)}-color, var(--color-fd-foreground))`;

            return {
              ...option,
              icon: (
                <div
                  className="[&_svg]:size-full rounded-lg size-full text-(--tab-color) max-md:bg-(--tab-color)/10 max-md:border max-md:p-1.5"
                  style={
                    {
                      "--tab-color": color,
                    } as object
                  }
                >
                  {node.icon}
                </div>
              ),
            };
          },
        },
      }}
    >
      {children}
    </DocsLayout>
    </RootProvider>
  );
}
