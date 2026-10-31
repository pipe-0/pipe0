import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { createRequire, isBuiltin } from "node:module";
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

/**
 * The snippet libraries on catalog pages import Node's `url` and `path`. Next
 * polyfilled those in the browser. Vite replaces them with an empty module,
 * which only fails at the first call, so any other Node import stops the build
 * here. The server keeps the real modules.
 */
function browserNodeShims(): Plugin {
  const { resolve } = createRequire(import.meta.url);
  const shims: Record<string, string> = {
    url: resolve("url/"),
    path: resolve("path-browserify"),
  };
  return {
    name: "pipe0:browser-node-shims",
    enforce: "pre",
    applyToEnvironment: (environment) => environment.name === "client",
    resolveId(id, importer) {
      if (shims[id]) return shims[id];
      // Declared in json-schema-ref-parser's `browser` field, for local files.
      if (id !== "fs" && isBuiltin(id)) {
        this.error(`${id} in the browser, from ${importer}`);
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
    browserNodeShims(),
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
