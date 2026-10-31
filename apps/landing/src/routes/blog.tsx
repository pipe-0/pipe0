import {
  ArticleLayout,
  articleFontPreloads,
} from "@/components/article-layout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  head: () => ({ links: articleFontPreloads }),
  component: () => (
    <ArticleLayout>
      <Outlet />
    </ArticleLayout>
  ),
});
