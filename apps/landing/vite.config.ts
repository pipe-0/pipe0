import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { defineConfig, type Plugin } from "vite";
import { prerenderPages } from "./scripts/prerender-pages";
import * as MdxConfig from "./source.config";

/**
 * @pipe0/base 1.0.44 calls crypto.randomUUID() at module load, which workerd
 * rejects. Fixed in pipe-0/pipe0-ts#282; delete this once 1.0.45 is in the
 * catalog.
 */
function patchBaseForWorkerd(): Plugin {
  return {
    name: "pipe0:patch-base-for-workerd",
    enforce: "pre",
    transform(code, id) {
      if (id.includes("@pipe0") && code.includes("crypto.randomUUID()")) {
        return code.replaceAll("crypto.randomUUID()", '"pipe0-example"');
      }
    },
  };
}

export default defineConfig(async () => ({
  server: { port: 3000 },
  resolve: {
    tsconfigPaths: true,
    // fumadocs-ui depends on a newer lucide-react than the app. Two copies
    // render different icon markup on server and client.
    dedupe: ["react", "react-dom", "lucide-react"],
  },
  plugins: [
    patchBaseForWorkerd(),
    mdx(MdxConfig),
    tailwindcss(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({
      // The list is complete, so nothing is left to discovery: a crawl misses
      // pages with no inbound link and follows redirects, which would turn the
      // legal aliases into 200 duplicates.
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: false,
        crawlLinks: false,
        failOnError: true,
      },
      pages: await prerenderPages(),
    }),
    viteReact(),
  ],
}));
