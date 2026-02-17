import { shikiConfig } from "@/lib/shiki";
import { pageSchema } from "fumadocs-core/source/schema";
import {
  applyMdxPreset,
  defineCollections,
  defineConfig,
  defineDocs,
} from "fumadocs-mdx/config";
import jsonSchema from "fumadocs-mdx/plugins/json-schema";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { RemarkAutoTypeTableOptions } from "fumadocs-typescript";
import type { ElementContent } from "hast";
import type { ShikiTransformer } from "shiki";
import z from "zod";

function transformerEscape(): ShikiTransformer {
  return {
    name: "@shikijs/transformers:remove-notation-escape",
    code(hast) {
      function replace(node: ElementContent) {
        if (node.type === "text") {
          node.value = node.value.replace("[\\!code", "[!code");
        } else if ("children" in node) {
          for (const child of node.children) {
            replace(child);
          }
        }
      }

      replace(hast);
      return hast;
    },
  };
}

export const docs = defineDocs({
  dir: "src/content/docs",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
    async mdxOptions(environment) {
      const { rehypeCodeDefaultOptions } =
        await import("fumadocs-core/mdx-plugins/rehype-code");
      const { remarkSteps } =
        await import("fumadocs-core/mdx-plugins/remark-steps");
      const { transformerTwoslash } = await import("fumadocs-twoslash");
      const { createFileSystemTypesCache } =
        await import("fumadocs-twoslash/cache-fs");
      const { remarkTypeScriptToJavaScript } =
        await import("fumadocs-docgen/remark-ts2js");
      const { default: rehypeKatex } = await import("rehype-katex");
      const {
        remarkAutoTypeTable,
        createGenerator,
        createFileSystemGeneratorCache,
      } = await import("fumadocs-typescript");

      const typeTableOptions: RemarkAutoTypeTableOptions = {
        generator: createGenerator({
          cache: createFileSystemGeneratorCache(".next/fumadocs-typescript"),
        }),
        shiki: shikiConfig,
      };
      return applyMdxPreset({
        rehypeCodeOptions: isLint
          ? false
          : {
              langs: ["ts", "js", "html", "tsx", "mdx", "json"],
              inline: "tailing-curly-colon",
              themes: {
                light: "catppuccin-latte",
                dark: "catppuccin-mocha",
              },
              transformers: [
                ...(rehypeCodeDefaultOptions.transformers ?? []),
                transformerTwoslash({
                  typesCache: createFileSystemTypesCache(),
                }),
                transformerEscape(),
              ],
            },
        remarkCodeTabOptions: {
          parseMdx: true,
        },
        remarkStructureOptions: {
          stringify: {
            filterElement(node) {
              switch (node.type) {
                case "mdxJsxFlowElement":
                case "mdxJsxTextElement":
                  switch (node.name) {
                    case "File":
                    case "TypeTable":
                    case "Callout":
                    case "Card":
                    case "Custom":
                      return true;
                  }
                  return "children-only";
              }

              return true;
            },
          },
        },
        remarkNpmOptions: {
          persist: {
            id: "package-manager",
          },
        },
        remarkPlugins: isLint
          ? []
          : [
              remarkSteps,
              [remarkAutoTypeTable, typeTableOptions],
              remarkTypeScriptToJavaScript,
            ],
        rehypePlugins: (v) => [rehypeKatex, ...v],
      })(environment);
    },
  },
});

const isLint = process.env.LINT === "1";

export const blog = defineCollections({
  type: "doc",
  dir: "src/content/blog",
  schema: pageSchema.extend({
    authors: z
      .array(z.object({ name: z.string(), title: z.string() }))
      .optional(),
    date: z.iso.date().or(z.date()),
    excerpt: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
  async: true,
  async mdxOptions(environment) {
    const { rehypeCodeDefaultOptions } =
      await import("fumadocs-core/mdx-plugins/rehype-code");
    const { remarkSteps } =
      await import("fumadocs-core/mdx-plugins/remark-steps");

    return applyMdxPreset({
      rehypeCodeOptions: isLint
        ? false
        : {
            inline: "tailing-curly-colon",
            themes: {
              light: "catppuccin-latte",
              dark: "catppuccin-mocha",
            },
            transformers: [
              ...(rehypeCodeDefaultOptions.transformers ?? []),
              transformerEscape(),
            ],
          },
      remarkCodeTabOptions: {
        parseMdx: true,
      },
      remarkNpmOptions: {
        persist: {
          id: "package-manager",
        },
      },
      remarkPlugins: isLint ? [] : [remarkSteps],
    })(environment);
  },
});

export default defineConfig({
  plugins: [
    jsonSchema({
      insert: true,
    }),
    lastModified(),
  ],
});
