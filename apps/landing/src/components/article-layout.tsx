import { RootProvider } from "@/components/root-provider";
import { preloadHanken, preloadMono } from "@/lib/fonts";
import { baseOptions, linkItems } from "@/lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";

export const articleFontPreloads = [preloadHanken, preloadMono];

/** The shell blog posts, reviews and author pages share: always light, fumadocs home layout. */
export function ArticleLayout({ children }: { children: ReactNode }) {
  return (
    <RootProvider>
      <HomeLayout
        {...baseOptions()}
        links={linkItems}
        themeSwitch={{ enabled: false }}
      >
        {children}
      </HomeLayout>
    </RootProvider>
  );
}
