import { preloadHanken, preloadMono } from "@/lib/fonts";
import { baseOptions, linkItems } from "@/lib/layout.shared";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";

/** The shell blog posts, reviews and author pages share. */
export const Route = createFileRoute("/_article")({
  head: () => ({ links: [preloadHanken, preloadMono] }),
  component: ArticleLayout,
});

function ArticleLayout() {
  return (
    <HomeLayout
      {...baseOptions()}
      links={linkItems}
      themeSwitch={{ enabled: false }}
    >
      <Outlet />
    </HomeLayout>
  );
}
