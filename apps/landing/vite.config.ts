import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { defineConfig } from "vite";
import { catalogDocPaths, prerenderPages } from "./scripts/prerender-pages.ts";

export default defineConfig(async ({ command }) => ({
  server: { port: 3000 },
  // The catalog's pages, fixed at build time, so a URL that names none gets
  // its 404 without loading @pipe0/base (src/lib/source.server.ts).
  define: { __CATALOG_DOC_PATHS__: JSON.stringify(await catalogDocPaths()) },
  resolve: {
    tsconfigPaths: true,
    // fumadocs-ui depends on a newer lucide-react than the app. Two copies
    // render different icon markup on server and client.
    dedupe: ["react", "react-dom", "lucide-react"],
  },
  plugins: [
    mdx(),
    tailwindcss(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({
      // A loader and its component are one chunk. Left in the entry, the loaders
      // would pull every page's content components onto every page.
      router: {
        codeSplittingOptions: {
          defaultBehavior: [
            ["loader", "component"],
            ["errorComponent"],
            ["notFoundComponent"],
          ],
        },
      },
      // These generate docs at prerender and depend on Node.
      importProtection: {
        client: { specifiers: ["oas", "@readme/oas-to-snippet"] },
      },
      // A crawl would follow the legal aliases and write their targets under
      // the alias paths, and it finds nothing the list leaves out.
      prerender: { enabled: true, crawlLinks: false },
      pages: command === "build" ? await prerenderPages() : [],
    }),
    viteReact(),
  ],
}));
