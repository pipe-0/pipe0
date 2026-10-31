import {
  ArticleLayout,
  articleFontPreloads,
} from "@/components/article-layout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/authors")({
  head: () => ({ links: articleFontPreloads }),
  component: () => (
    <ArticleLayout>
      <Outlet />
    </ArticleLayout>
  ),
});
