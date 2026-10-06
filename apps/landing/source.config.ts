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
import { z } from "zod";

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

export const legal = defineCollections({
  type: "doc",
  dir: "src/content/legal",
  schema: pageSchema.extend({
    date: z.iso.date().or(z.date()).optional(),
  }),
  async: true,
});

/** MDX options shared by the editorial collections (blog, reviews). */
async function articleMdxOptions(environment: Parameters<ReturnType<typeof applyMdxPreset>>[0]) {
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
}

export const blog = defineCollections({
  type: "doc",
  dir: "src/content/blog",
  schema: pageSchema.extend({
    authors: z
      .array(z.object({ name: z.string(), title: z.string() }))
      .optional(),
    date: z.iso.date().or(z.date()),
    /**
     * Date of the last substantive revision — new facts, corrected claims,
     * re-run numbers. Set by hand; typo and formatting fixes don't count.
     * Shown as "Updated …" and emitted as `dateModified`.
     */
    updated: z.iso.date().or(z.date()).optional(),
    excerpt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    /** Editorial section — the index nav groups posts by this. */
    category: z.enum(["Thinking", "Engineering", "Sales data"]),
    /** Editors' pick — featured on the index with an inverted cover. */
    highlight: z.boolean().optional(),
    /**
     * Cover image path under /public (e.g. /media/blog/20260726-1.jpg).
     * Shown as the post hero and on index/related cards; posts without
     * one fall back to the generated SVG tile (cards only, no hero).
     */
    cover: z.string().optional(),
    /**
     * One to three sentences shown in a TL;DR card between the cover and
     * the body. Also emitted as the BlogPosting `abstract` for answer
     * engines. Omit on posts that don't have one; nothing renders.
     */
    tldr: z.string().optional(),
    /**
     * Frequently asked questions rendered after the body and emitted as
     * FAQPage structured data. Omit on posts that don't have any.
     */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    /**
     * Unpublished draft — excluded from the index, related reading, the
     * sitemap, and direct URLs (404). Remove the flag to publish.
     */
    draft: z.boolean().optional(),
    /**
     * Canonical URL override — point near-duplicate posts at the canonical
     * one so they don't compete in search.
     */
    canonicalUrl: z.string().optional(),
  }),
  async: true,
  // Feeds the /blog/<slug>.md twin served to answer engines and agents.
  postprocess: {
    includeProcessedMarkdown: true,
  },
  mdxOptions: articleMdxOptions,
});

const criterion = z.object({
  /** Out of 5, to one decimal. */
  score: z
    .number()
    .min(1)
    .max(5)
    .refine((v) => Number.isInteger(Math.round(v * 10 * 1e6) / 1e6), {
      message: "Scores take at most one decimal",
    }),
  /** One plain sentence: why this score. Shown under the bar. */
  why: z.string(),
});

const noteList = z.array(z.object({ title: z.string(), body: z.string() }));

/**
 * Tool reviews (/reviews/<slug>). The structured fields render the fixed
 * review layout (verdict card, facts, pros and cons, pricing, alternatives,
 * FAQ) and ship as Review structured data; the MDX body holds the prose.
 * Everything here is plain text: no Markdown, no links.
 */
export const reviews = defineCollections({
  type: "doc",
  dir: "src/content/reviews",
  schema: pageSchema.extend({
    tool: z.object({
      name: z.string(),
      url: z.url(),
      /** Square logo under /public. Cards fall back to a monogram. */
      logo: z.string().optional(),
      category: z.enum([
        "Enrichment platform",
        "Sales database",
        "Waterfall enrichment",
        "Sales engagement",
        "Agent data tools",
      ]),
    }),
    /**
     * The review in one sentence, 30 words or fewer. Used as the TL;DR,
     * the card line, the llms.txt line, and the Review `reviewBody`.
     */
    verdict: z.string(),
    /** The four fixed criteria. The overall score is their mean. */
    scores: z.object({
      easeOfUse: criterion,
      dataQuality: criterion,
      pricingValue: criterion,
      agentAccess: criterion,
    }),
    bestFor: z.array(z.string()),
    skipIf: z.array(z.string()),
    pros: noteList,
    cons: noteList,
    pricing: z.object({
      /** Date the prices were read off the vendor's pricing page. */
      asOf: z.iso.date().or(z.date()),
      source: z.url(),
      /** Lowest paid price in USD per month, for cards and the Offer. */
      startingAt: z.number(),
      /** What `startingAt` buys, e.g. "per seat, billed annually". */
      startingAtNote: z.string(),
      freePlan: z.boolean(),
      plans: z.array(
        z.object({
          name: z.string(),
          price: z.string(),
          includes: z.string(),
        }),
      ),
      /** Costs the plan table doesn't show. */
      notes: z.array(z.string()).optional(),
    }),
    /** Key facts table. Each row names its source. */
    facts: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        source: z.url().optional(),
      }),
    ),
    alternatives: z.array(
      z.object({ name: z.string(), href: z.string(), why: z.string() }),
    ),
    /** The matching /compare/pipe0-vs-<tool> page, if there is one. */
    compare: z.string().optional(),
    /**
     * How pipe0 relates to the tool; picks the disclosure line under the
     * byline. "supplier" means pipe0 buys its data for waterfalls.
     */
    relationship: z
      .enum(["competitor", "supplier", "neutral"])
      .default("competitor"),
    /** Overrides the relationship's default disclosure line. */
    disclosure: z.string().optional(),
    /**
     * Results from pipe0's provider benchmark. Copy numbers only from
     * evidence.md or a read-only query of bench.db, with the run id.
     */
    benchmark: z
      .object({
        /** When the runs happened, e.g. "August 2026". */
        period: z.string(),
        rows: z.array(
          z.object({
            /** What went in and what came out, e.g. "LinkedIn URL to mobile". */
            test: z.string(),
            /**
             * Which seed population: 1,204 stratified LinkedIn profiles, or
             * real pipe0 signup emails. Decides which caveats print.
             */
            dataset: z.enum(["profiles", "signups"]).default("profiles"),
            run: z.string(),
            n: z.number().int(),
            /** Share of records with a result, in percent. */
            coverage: z.number(),
            /** Share of results matching other providers, in percent. */
            agreement: z.number().optional(),
            /** Median response time, e.g. "0.9 s". */
            latency: z.string().optional(),
          }),
        ),
        /** Run-specific caveats, on top of the standard ones. */
        notes: z.array(z.string()).optional(),
      })
      .optional(),
    authors: z.array(z.object({ name: z.string(), title: z.string() })),
    date: z.iso.date().or(z.date()),
    /** Last substantive revision (new prices, re-scored criteria). */
    updated: z.iso.date().or(z.date()).optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })),
    /** Hidden in production builds; dev renders it with a draft banner. */
    draft: z.boolean().optional(),
  }),
  async: true,
  // Feeds the /reviews/<slug>.md twin served to answer engines and agents.
  postprocess: {
    includeProcessedMarkdown: true,
  },
  mdxOptions: articleMdxOptions,
});

export default defineConfig({
  plugins: [
    jsonSchema({
      insert: true,
    }),
    lastModified(),
  ],
});
